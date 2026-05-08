import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireAuth } from "./helpers";

export const listByProperty = query({
  args: { propertyId: v.id("properties") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const units = await ctx.db
      .query("units")
      .withIndex("by_property", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    // Enrich with tenant names
    const enriched = await Promise.all(
      units.map(async (unit) => {
        let tenantName = null;
        if (unit.tenantId) {
          const tenant = await ctx.db.get(unit.tenantId);
          tenantName = tenant?.fullName ?? null;
        }
        return { ...unit, tenantName };
      })
    );

    return enriched;
  },
});

export const create = mutation({
  args: {
    propertyId: v.id("properties"),
    unitNumber: v.string(),
    description: v.optional(v.string()),
    monthlyRent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return ctx.db.insert("units", {
      ...args,
      tenantId: undefined,
      isOccupied: false,
    });
  },
});

export const update = mutation({
  args: {
    unitId: v.id("units"),
    unitNumber: v.optional(v.string()),
    description: v.optional(v.string()),
    monthlyRent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { unitId, ...updates } = args;

    const cleanUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) cleanUpdates[key] = value;
    }

    await ctx.db.patch(unitId, cleanUpdates);
  },
});

export const assignTenant = mutation({
  args: {
    unitId: v.id("units"),
    tenantId: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.tenantId) {
      // Verify the profile is a tenant
      const profile = await ctx.db.get(args.tenantId);
      if (!profile || profile.role !== "tenant") {
        throw new Error("Invalid tenant profile");
      }
    }

    await ctx.db.patch(args.unitId, {
      tenantId: args.tenantId,
      isOccupied: !!args.tenantId,
    });
  },
});

export const remove = mutation({
  args: { unitId: v.id("units") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.unitId);
  },
});

export const getMyUnit = query({
  args: {},
  handler: async (ctx) => {
    const profile = await requireAuth(ctx);
    if (profile.role !== "tenant") return null;

    const unit = await ctx.db
      .query("units")
      .withIndex("by_tenant", (q) => q.eq("tenantId", profile._id))
      .first();

    if (!unit) return null;

    const property = await ctx.db.get(unit.propertyId);
    return { ...unit, propertyName: property?.name ?? "Unknown" };
  },
});
