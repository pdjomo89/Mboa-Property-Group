import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export type Role = "admin" | "tenant" | "landlord";

export async function getProfile(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
}

export async function requireAuth(ctx: QueryCtx) {
  const profile = await getProfile(ctx);
  if (!profile) throw new Error("Not authenticated");
  return profile;
}

export async function requireRole(ctx: QueryCtx, allowedRoles: Role[]) {
  const profile = await requireAuth(ctx);
  if (!allowedRoles.includes(profile.role)) {
    throw new Error("Unauthorized: insufficient permissions");
  }
  return profile;
}

export async function requireAdmin(ctx: QueryCtx) {
  return requireRole(ctx, ["admin"]);
}

/**
 * Creates an in-app notification AND schedules external delivery
 * (WhatsApp + Email) based on user preferences.
 */
export async function createNotification(
  ctx: MutationCtx,
  recipientId: string | Id<"profiles">,
  type: "new_issue" | "status_change" | "new_message" | "assignment" | "system",
  title: string,
  body: string,
  issueId?: string | Id<"issues">,
  extra?: {
    issueTitle?: string;
    propertyName?: string;
    unitNumber?: string;
  }
) {
  // 1. Create in-app notification
  const notificationId = await ctx.db.insert("notifications", {
    recipientId: recipientId as Id<"profiles">,
    type,
    title,
    body,
    issueId: issueId as Id<"issues"> | undefined,
    isRead: false,
  });

  // 2. Schedule external notification dispatch (WhatsApp + Email)
  await ctx.scheduler.runAfter(0, internal.notificationDispatcher.dispatch, {
    recipientId: recipientId as Id<"profiles">,
    notificationId,
    title,
    body,
    type,
    issueTitle: extra?.issueTitle,
    propertyName: extra?.propertyName,
    unitNumber: extra?.unitNumber,
  });

  return notificationId;
}
