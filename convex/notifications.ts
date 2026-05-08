import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireAuth(ctx);
    return ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) => q.eq("recipientId", profile._id))
      .order("desc")
      .take(50);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireAuth(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) =>
        q.eq("recipientId", profile._id).eq("isRead", false)
      )
      .collect();
    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const profile = await requireAuth(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) return;
    if (notification.recipientId.toString() !== profile._id.toString()) return;
    await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const profile = await requireAuth(ctx);
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_recipient_unread", (q) =>
        q.eq("recipientId", profile._id).eq("isRead", false)
      )
      .collect();

    for (const notification of unread) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});
