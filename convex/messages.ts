import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, createNotification } from "./helpers";

export const listByIssue = query({
  args: { issueId: v.id("issues") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_issue", (q) => q.eq("issueId", args.issueId))
      .collect();

    const enriched = await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          senderName: sender?.fullName ?? "Unknown",
          senderRole: sender?.role ?? "unknown",
        };
      })
    );

    return enriched;
  },
});

export const send = mutation({
  args: {
    issueId: v.id("issues"),
    content: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const profile = await requireAuth(ctx);
    const issue = await ctx.db.get(args.issueId);
    if (!issue) throw new Error("Issue not found");

    const messageId = await ctx.db.insert("messages", {
      issueId: args.issueId,
      senderId: profile._id,
      content: args.content,
      imageId: args.imageId,
      isSystemMessage: false,
    });

    // Fetch context for rich notifications
    const property = await ctx.db.get(issue.propertyId);
    const unit = await ctx.db.get(issue.unitId);
    const extra = {
      issueTitle: issue.title,
      propertyName: property?.name,
      unitNumber: unit?.unitNumber,
    };

    // Notify relevant parties
    const notifyIds: Set<string> = new Set();

    // Always notify admin if sender is not admin
    if (profile.role !== "admin") {
      const admins = await ctx.db
        .query("profiles")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();
      admins.forEach((a) => notifyIds.add(a._id));
    }

    // Notify reporter if sender is admin
    if (profile.role === "admin" && issue.reportedBy.toString() !== profile._id.toString()) {
      notifyIds.add(issue.reportedBy);
    }

    // Notify landlord if sender is admin and landlord is assigned
    if (profile.role === "admin" && issue.assignedTo) {
      notifyIds.add(issue.assignedTo);
    }

    // Remove sender from notifications
    notifyIds.delete(profile._id);

    const truncatedContent = args.content.length > 100
      ? args.content.substring(0, 100) + "..."
      : args.content;

    for (const recipientId of notifyIds) {
      await createNotification(
        ctx,
        recipientId,
        "new_message",
        "New Message",
        `${profile.fullName}: ${truncatedContent}`,
        args.issueId,
        extra
      );
    }

    return messageId;
  },
});
