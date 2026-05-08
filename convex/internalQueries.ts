import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const getRecipientProfile = internalQuery({
  args: { recipientId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.recipientId);
  },
});
