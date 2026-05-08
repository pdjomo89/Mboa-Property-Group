import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireRole, createNotification } from "./helpers";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("admin_reviewed"),
        v.literal("landlord_notified"),
        v.literal("repair_in_progress"),
        v.literal("resolved"),
        v.literal("closed")
      )
    ),
  },
  handler: async (ctx, args) => {
    const profile = await requireAuth(ctx);

    let issues;
    if (profile.role === "admin") {
      issues = args.status
        ? await ctx.db
            .query("issues")
            .withIndex("by_status", (q) => q.eq("status", args.status!))
            .collect()
        : await ctx.db.query("issues").collect();
    } else if (profile.role === "tenant") {
      issues = await ctx.db
        .query("issues")
        .withIndex("by_reporter", (q) => q.eq("reportedBy", profile._id))
        .collect();
      if (args.status) {
        issues = issues.filter((i) => i.status === args.status);
      }
    } else {
      // Landlord: issues assigned to them
      issues = await ctx.db
        .query("issues")
        .withIndex("by_assignedTo", (q) => q.eq("assignedTo", profile._id))
        .collect();
      if (args.status) {
        issues = issues.filter((i) => i.status === args.status);
      }
    }

    // Enrich with property and unit info
    const enriched = await Promise.all(
      issues.map(async (issue) => {
        const property = await ctx.db.get(issue.propertyId);
        const unit = await ctx.db.get(issue.unitId);
        const reporter = await ctx.db.get(issue.reportedBy);
        return {
          ...issue,
          propertyName: property?.name ?? "Unknown",
          unitNumber: unit?.unitNumber ?? "Unknown",
          reporterName: reporter?.fullName ?? "Unknown",
        };
      })
    );

    return enriched.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getById = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");

    const property = await ctx.db.get(issue.propertyId);
    const unit = await ctx.db.get(issue.unitId);
    const reporter = await ctx.db.get(issue.reportedBy);
    const assignee = issue.assignedTo
      ? await ctx.db.get(issue.assignedTo)
      : null;

    const statusHistory = await ctx.db
      .query("issueStatusHistory")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .collect();

    const enrichedHistory = await Promise.all(
      statusHistory.map(async (entry) => {
        const changedByProfile = await ctx.db.get(entry.changedBy);
        return {
          ...entry,
          changedByName: changedByProfile?.fullName ?? "Unknown",
        };
      })
    );

    return {
      ...issue,
      propertyName: property?.name ?? "Unknown",
      propertyAddress: property?.address ?? "",
      unitNumber: unit?.unitNumber ?? "Unknown",
      reporterName: reporter?.fullName ?? "Unknown",
      reporterPhone: reporter?.phone ?? "",
      assigneeName: assignee?.fullName ?? null,
      statusHistory: enrichedHistory,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    unitId: v.id("units"),
    urgency: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("plumbing"),
      v.literal("electrical"),
      v.literal("structural"),
      v.literal("appliance"),
      v.literal("pest_control"),
      v.literal("security"),
      v.literal("other")
    ),
    imageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const profile = await requireRole(ctx, ["tenant"]);

    const unit = await ctx.db.get(args.unitId);
    if (!unit) throw new Error("Unit not found");
    if (unit.tenantId?.toString() !== profile._id.toString()) {
      throw new Error("You can only report issues for your assigned unit");
    }

    const property = await ctx.db.get(unit.propertyId);
    const landlordId = property?.landlordId;

    const issueId = await ctx.db.insert("issues", {
      title: args.title,
      description: args.description,
      unitId: args.unitId,
      propertyId: unit.propertyId,
      reportedBy: profile._id,
      assignedTo: landlordId,
      status: "new",
      urgency: args.urgency,
      category: args.category,
      imageIds: args.imageIds,
    });

    // Create status history entry
    await ctx.db.insert("issueStatusHistory", {
      issueId,
      fromStatus: undefined,
      toStatus: "new",
      changedBy: profile._id,
      note: "Issue reported",
    });

    // Notify admins (in-app + WhatsApp + Email)
    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();

    for (const admin of admins) {
      await createNotification(
        ctx,
        admin._id,
        "new_issue",
        "New Issue Reported",
        `${profile.fullName} reported: ${args.title} (${args.urgency} urgency)`,
        issueId,
        {
          issueTitle: args.title,
          propertyName: property?.name,
          unitNumber: unit.unitNumber,
        }
      );
    }

    return issueId;
  },
});

export const updateStatus = mutation({
  args: {
    issueId: v.id("issues"),
    status: v.union(
      v.literal("new"),
      v.literal("admin_reviewed"),
      v.literal("landlord_notified"),
      v.literal("repair_in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await requireAuth(ctx);
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");

    // Validate transition
    const validTransitions: Record<string, { statuses: string[]; roles: string[] }> = {
      new: { statuses: ["admin_reviewed"], roles: ["admin"] },
      admin_reviewed: { statuses: ["landlord_notified"], roles: ["admin"] },
      landlord_notified: { statuses: ["repair_in_progress"], roles: ["admin", "landlord"] },
      repair_in_progress: { statuses: ["resolved"], roles: ["admin"] },
      resolved: { statuses: ["closed"], roles: ["admin", "tenant"] },
    };

    const transition = validTransitions[issue.status];
    if (!transition) throw new Error("No transitions available from current status");
    if (!transition.statuses.includes(args.status)) {
      throw new Error(`Cannot transition from ${issue.status} to ${args.status}`);
    }
    if (!transition.roles.includes(profile.role)) {
      throw new Error("You don't have permission to make this status change");
    }

    await ctx.db.patch(args.issueId, {
      status: args.status,
      ...(args.status === "resolved" ? { resolvedAt: Date.now() } : {}),
    });

    await ctx.db.insert("issueStatusHistory", {
      issueId: args.issueId,
      fromStatus: issue.status,
      toStatus: args.status,
      changedBy: profile._id,
      note: args.note,
    });

    // Fetch property and unit info for rich notifications
    const property = await ctx.db.get(issue.propertyId);
    const unit = await ctx.db.get(issue.unitId);
    const extra = {
      issueTitle: issue.title,
      propertyName: property?.name,
      unitNumber: unit?.unitNumber,
    };

    const statusLabel = args.status.replace(/_/g, " ");

    // Notify the tenant (reporter) about status change
    const reporter = await ctx.db.get(issue.reportedBy);
    if (reporter && reporter._id.toString() !== profile._id.toString()) {
      await createNotification(
        ctx,
        reporter._id,
        "status_change",
        "Issue Status Updated",
        `Your issue "${issue.title}" is now: ${statusLabel}`,
        args.issueId,
        extra
      );
    }

    // Notify landlord when issue is escalated to them
    if (args.status === "landlord_notified" && issue.assignedTo) {
      await createNotification(
        ctx,
        issue.assignedTo,
        "assignment",
        "Issue Requires Your Attention",
        `Issue "${issue.title}" at ${property?.name ?? "property"} needs your attention. Please coordinate repairs.`,
        args.issueId,
        extra
      );
    }

    // Notify admins when landlord or tenant changes status
    if (profile.role !== "admin") {
      const admins = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();

      for (const admin of admins) {
        await createNotification(
          ctx,
          admin._id,
          "status_change",
          "Issue Status Updated",
          `${profile.fullName} changed "${issue.title}" to: ${statusLabel}`,
          args.issueId,
          extra
        );
      }
    }
  },
});

export const addAdminNotes = mutation({
  args: {
    issueId: v.id("issues"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    await ctx.db.patch(args.issueId, { adminNotes: args.notes });
  },
});

export const uploadQuote = mutation({
  args: {
    issueId: v.id("issues"),
    amount: v.number(),
    description: v.string(),
    fileIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const profile = await requireRole(ctx, ["admin"]);
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");

    await ctx.db.patch(args.issueId, {
      quoteAmount: args.amount,
      quoteDescription: args.description,
      quoteFileIds: args.fileIds,
      quoteStatus: "pending",
      quoteRejectionNote: undefined,
    });

    // Notify landlord about the quote
    if (issue.assignedTo) {
      const property = await ctx.db.get(issue.propertyId);
      const unit = await ctx.db.get(issue.unitId);
      await createNotification(
        ctx,
        issue.assignedTo,
        "system",
        "New Repair Quote",
        `A quote of ${args.amount.toLocaleString()} XAF has been submitted for "${issue.title}" at ${property?.name ?? "property"} - Unit ${unit?.unitNumber ?? ""}. Please review and approve or reject.`,
        args.issueId,
        {
          issueTitle: issue.title,
          propertyName: property?.name,
          unitNumber: unit?.unitNumber,
        }
      );
    }
  },
});

export const respondToQuote = mutation({
  args: {
    issueId: v.id("issues"),
    approved: v.boolean(),
    rejectionNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await requireRole(ctx, ["landlord"]);
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");
    if (issue.assignedTo?.toString() !== profile._id.toString()) {
      throw new Error("You can only respond to quotes on your properties");
    }
    if (issue.quoteStatus !== "pending") {
      throw new Error("No pending quote to respond to");
    }

    await ctx.db.patch(args.issueId, {
      quoteStatus: args.approved ? "approved" : "rejected",
      quoteRejectionNote: args.approved ? undefined : args.rejectionNote,
    });

    // Notify admins about the landlord's response
    const property = await ctx.db.get(issue.propertyId);
    const unit = await ctx.db.get(issue.unitId);
    const extra = {
      issueTitle: issue.title,
      propertyName: property?.name,
      unitNumber: unit?.unitNumber,
    };

    const admins = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .collect();

    const statusText = args.approved ? "approved" : "rejected";
    for (const admin of admins) {
      await createNotification(
        ctx,
        admin._id,
        "system",
        `Quote ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
        `${profile.fullName} has ${statusText} the quote of ${issue.quoteAmount?.toLocaleString()} XAF for "${issue.title}"${args.rejectionNote ? `. Reason: ${args.rejectionNote}` : ""}`,
        args.issueId,
        extra
      );
    }
  },
});
