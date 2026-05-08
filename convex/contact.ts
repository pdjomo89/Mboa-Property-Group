import { v } from "convex/values";
import { mutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const RoleValidator = v.union(
  v.literal("tenant"),
  v.literal("landlord"),
  v.literal("partner"),
  v.literal("other")
);

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    role: RoleValidator,
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const message = args.message.trim();
    const subject = args.subject?.trim();

    if (!name) throw new Error("Name is required");
    if (!email || !email.includes("@")) throw new Error("Valid email is required");
    if (!message) throw new Error("Message is required");
    if (name.length > 200 || email.length > 320 || message.length > 5000) {
      throw new Error("Input too long");
    }

    const id = await ctx.db.insert("contactSubmissions", {
      name,
      email,
      subject: subject || undefined,
      role: args.role,
      message,
      status: "new",
    });

    await ctx.scheduler.runAfter(0, internal.contactEmail.notifyAdmin, {
      submissionId: id,
    });

    return { id };
  },
});

export const getById = internalQuery({
  args: { id: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
