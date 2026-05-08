import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireAdmin } from "./helpers";

export const create = internalMutation({
  args: {
    recipientId: v.id("profiles"),
    notificationId: v.optional(v.id("notifications")),
    channel: v.union(v.literal("whatsapp"), v.literal("email")),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("pending")),
    to: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
    externalId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("notificationLogs", args);
  },
});

// Admin can view notification logs for debugging
export const list = query({
  args: {
    channel: v.optional(v.union(v.literal("whatsapp"), v.literal("email"))),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.channel) {
      return ctx.db
        .query("notificationLogs")
        .withIndex("by_channel", (q) => q.eq("channel", args.channel!))
        .order("desc")
        .take(50);
    }

    return ctx.db.query("notificationLogs").order("desc").take(50);
  },
});
