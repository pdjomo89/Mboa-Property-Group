import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email) throw new Error("EMAIL_REQUIRED");
    if (email.length > 320 || !EMAIL_RE.test(email)) throw new Error("EMAIL_INVALID");

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      if (existing.status === "active") {
        return { status: "already_subscribed" as const };
      }
      await ctx.db.patch(existing._id, { status: "active" });
      await ctx.scheduler.runAfter(0, internal.newsletterEmail.sendWelcome, {
        email,
        locale: args.locale,
      });
      return { status: "resubscribed" as const };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email,
      status: "active",
      source: args.source,
      locale: args.locale,
    });
    await ctx.scheduler.runAfter(0, internal.newsletterEmail.sendWelcome, {
      email,
      locale: args.locale,
    });
    return { status: "subscribed" as const };
  },
});
