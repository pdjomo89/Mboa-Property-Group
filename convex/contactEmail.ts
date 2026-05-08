"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const notifyAdmin = internalAction({
  args: { submissionId: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "Mboa Property <notifications@mboa.cm>";
    const adminEmail =
      process.env.CONTACT_INBOX_EMAIL ?? "hello@mboapropertygroup.com";

    if (!apiKey) {
      console.warn(
        "Contact submission saved, but RESEND_API_KEY is not configured — admin email skipped"
      );
      return;
    }

    const submission = await ctx.runQuery(internal.contact.getById, {
      id: args.submissionId,
    });
    if (!submission) {
      console.error(`Contact submission ${args.submissionId} not found`);
      return;
    }

    const resend = new Resend(apiKey);
    const subject = submission.subject
      ? `[Contact] ${submission.subject} — ${submission.name}`
      : `[Contact] New message from ${submission.name}`;

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        replyTo: submission.email,
        subject,
        html: renderEmail(submission),
      });
      if (error) throw new Error(error.message);
      console.log(`Contact email sent to ${adminEmail} (resend id: ${data?.id})`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Failed to email admin about contact ${args.submissionId}:`, message);
    }
  },
});

type Submission = {
  name: string;
  email: string;
  subject?: string;
  role: "tenant" | "landlord" | "partner" | "other";
  message: string;
};

function renderEmail(s: Submission): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#111827;font-size:14px">${escapeHtml(value)}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
      <div style="border-bottom:2px solid #16a34a;padding-bottom:12px;margin-bottom:20px">
        <h1 style="margin:0;font-size:18px;color:#16a34a">New contact submission</h1>
      </div>
      <table style="border-collapse:collapse;width:100%">
        ${row("Name", s.name)}
        ${row("Email", s.email)}
        ${row("Role", s.role)}
        ${s.subject ? row("Subject", s.subject) : ""}
      </table>
      <div style="margin-top:20px">
        <p style="margin:0 0 6px;color:#6b7280;font-size:13px">Message</p>
        <pre style="margin:0;padding:14px;background:#f9fafb;border-radius:8px;white-space:pre-wrap;font-family:inherit;font-size:14px;color:#111827;line-height:1.5">${escapeHtml(s.message)}</pre>
      </div>
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px">Reply directly to this email to respond to ${escapeHtml(s.name)}.</p>
  </div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
  );
}
