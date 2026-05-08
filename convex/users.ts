import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireRole } from "./helpers";

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const createProfile = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("tenant"),
      v.literal("landlord")
    ),
    preferredLanguage: v.union(v.literal("fr"), v.literal("en")),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) return existing._id;

    // First user becomes admin automatically
    let role = args.role;
    const adminExists = await ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", "admin"))
      .first();
    if (!adminExists) {
      role = "admin";
    }

    return ctx.db.insert("profiles", {
      userId,
      fullName: args.fullName,
      phone: args.phone,
      role,
      preferredLanguage: args.preferredLanguage,
      email: args.email,
      isActive: true,
    });
  },
});

export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    preferredLanguage: v.optional(v.union(v.literal("fr"), v.literal("en"))),
    email: v.optional(v.string()),
    notifyWhatsApp: v.optional(v.boolean()),
    notifyEmail: v.optional(v.boolean()),
    whatsAppPhone: v.optional(v.string()),
    notificationEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    const updates: Record<string, any> = {};
    if (args.fullName !== undefined) updates.fullName = args.fullName;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.preferredLanguage !== undefined)
      updates.preferredLanguage = args.preferredLanguage;
    if (args.email !== undefined) updates.email = args.email;
    if (args.notifyWhatsApp !== undefined) updates.notifyWhatsApp = args.notifyWhatsApp;
    if (args.notifyEmail !== undefined) updates.notifyEmail = args.notifyEmail;
    if (args.whatsAppPhone !== undefined) updates.whatsAppPhone = args.whatsAppPhone;
    if (args.notificationEmail !== undefined) updates.notificationEmail = args.notificationEmail;

    await ctx.db.patch(profile._id, updates);
  },
});

export const listByRole = query({
  args: {
    role: v.union(
      v.literal("admin"),
      v.literal("tenant"),
      v.literal("landlord")
    ),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("profiles")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["admin"]);
    return ctx.db.query("profiles").collect();
  },
});

export const changeRole = mutation({
  args: {
    profileId: v.id("profiles"),
    role: v.union(
      v.literal("admin"),
      v.literal("tenant"),
      v.literal("landlord")
    ),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, ["admin"]);
    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error("Profile not found");
    await ctx.db.patch(args.profileId, { role: args.role });
  },
});

export const getProfileById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.profileId);
  },
});
