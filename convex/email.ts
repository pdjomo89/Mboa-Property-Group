"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

// Send email via Resend
export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    html: v.optional(v.string()),
    recipientId: v.id("profiles"),
    notificationId: v.optional(v.id("notifications")),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Mboa Property <notifications@mboa.cm>";

    if (!apiKey) {
      console.error("Resend API key not configured");
      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "email",
        status: "failed",
        to: args.to,
        subject: args.subject,
        body: args.body,
        error: "Resend API key not configured",
      });
      return;
    }

    const resend = new Resend(apiKey);

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: args.to,
        subject: args.subject,
        html: args.html ?? generateEmailHtml(args.subject, args.body),
      });

      if (error) {
        throw new Error(error.message);
      }

      // Log success
      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "email",
        status: "sent",
        to: args.to,
        subject: args.subject,
        body: args.body,
        externalId: data?.id,
      });

      console.log(`Email sent to ${args.to}: ${data?.id}`);
    } catch (error: any) {
      console.error(`Email failed to ${args.to}:`, error.message);

      await ctx.runMutation(internal.notificationLogs.create, {
        recipientId: args.recipientId,
        notificationId: args.notificationId,
        channel: "email",
        status: "failed",
        to: args.to,
        subject: args.subject,
        body: args.body,
        error: error.message,
      });
    }
  },
});

function generateEmailHtml(subject: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #16a34a;">
        <h1 style="margin: 0; font-size: 20px; color: #16a34a;">Mboa Property Group</h1>
      </div>

      <!-- Content -->
      <h2 style="margin: 0 0 12px; font-size: 18px; color: #1a1a1a;">${subject}</h2>
      <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4a4a4a;">${body}</p>

      <!-- CTA -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://mboa-property.vercel.app"}/dashboard"
           style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">
          View in Dashboard
        </a>
      </div>

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          Mboa Property Group - Property Management in Cameroon
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
