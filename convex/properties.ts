import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAuth } from "./helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireAuth(ctx);

    if (profile.role === "admin") {
      return ctx.db.query("properties").collect();
    }

    if (profile.role === "landlord") {
      return ctx.db
        .query("properties")
        .withIndex("by_landlord", (q) => q.eq("landlordId", profile._id))
        .collect();
    }

    // Tenant: get properties through their unit
    const units = await ctx.db
      .query("units")
      .withIndex("by_tenant", (q) => q.eq("tenantId", profile._id))
      .collect();

    const propertyIds = [...new Set(units.map((u) => u.propertyId))];
    const properties = await Promise.all(
      propertyIds.map((id) => ctx.db.get(id))
    );
    return properties.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

export const getById = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const property = await ctx.db.get(args.propertyId);
    if (!property) throw new Error("Property not found");

    const landlord = await ctx.db.get(property.landlordId);
    const units = await ctx.db
      .query("units")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    return {
      ...property,
      landlordName: landlord?.fullName ?? "Unknown",
      units,
      occupiedUnits: units.filter((u) => u.isOccupied).length,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    city: v.string(),
    neighborhood: v.optional(v.string()),
    description: v.optional(v.string()),
    landlordId: v.id("profiles"),
    totalUnits: v.number(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    return ctx.db.insert("properties", {
      ...args,
      imageUrl: undefined,
      isActive: true,
      createdBy: admin._id,
    });
  },
});

export const update = mutation({
  args: {
    propertyId: v.id("properties"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    neighborhood: v.optional(v.string()),
    description: v.optional(v.string()),
    landlordId: v.optional(v.id("profiles")),
    totalUnits: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { propertyId, ...updates } = args;
    const property = await ctx.db.get(propertyId);
    if (!property) throw new Error("Property not found");

    const cleanUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) cleanUpdates[key] = value;
    }

    await ctx.db.patch(propertyId, cleanUpdates);
  },
});

export const remove = mutation({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.propertyId, { isActive: false });
  },
});
