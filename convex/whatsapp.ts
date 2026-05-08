"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Twilio from "twilio";

// Send WhatsApp message via Twilio
export const sendWhatsApp = internalAction({
  args: {
    to: v.string(),
    body: v.string(),
    recipientId: v.id("profiles"),
    notificationId: v.optional(v.id("notifications")),
  },
  handler: async (ctx, args) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !fromNumber) {
      console.error("Twilio credentials not configured");
      // Log the failure
      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "whatsapp",
        status: "failed",
        to: args.to,
        body: args.body,
        error: "Twilio credentials not configured",
      });
      return;
    }

    const client = Twilio(accountSid, authToken);

    // Normalize phone number for WhatsApp
    let whatsappTo = args.to.replace(/\s/g, "");
    if (!whatsappTo.startsWith("+")) {
      whatsappTo = `+${whatsappTo}`;
    }

    try {
      const message = await client.messages.create({
        body: args.body,
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${whatsappTo}`,
      });

      // Log success
      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "whatsapp",
        status: "sent",
        to: args.to,
        body: args.body,
        externalId: message.sid,
      });

      console.log(`WhatsApp sent to ${whatsappTo}: ${message.sid}`);
    } catch (error: any) {
      console.error(`WhatsApp failed to ${whatsappTo}:`, error.message);

      // Log failure
      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "whatsapp",
        status: "failed",
        to: args.to,
        body: args.body,
        error: error.message,
      });
    }
  },
});
