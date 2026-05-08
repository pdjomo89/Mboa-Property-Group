"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";

const COPY = {
  en: {
    subject: "Welcome to the Mboa Property Group newsletter",
    heading: "You're in 👋",
    body: "Thanks for subscribing! You'll be the first to hear about new features, expansion news, and stories from the property management world in Cameroon.",
    sign: "— The Mboa team",
    unsubscribe: "If you didn't sign up, just ignore this email and you won't hear from us again.",
  },
  fr: {
    subject: "Bienvenue dans la newsletter Mboa Property Group",
    heading: "C'est fait 👋",
    body: "Merci pour votre inscription ! Vous serez parmi les premiers à recevoir les nouveautés produit, les annonces d'expansion et les histoires de la gestion immobilière au Cameroun.",
    sign: "— L'équipe Mboa",
    unsubscribe: "Si vous ne vous êtes pas inscrit, ignorez simplement cet e-mail.",
  },
} as const;

export const sendWelcome = internalAction({
  args: {
    email: v.string(),
    locale: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "Mboa Property <onboarding@resend.dev>";

    if (!apiKey) {
      console.warn(
        `Newsletter welcome skipped for ${args.email} — RESEND_API_KEY not configured`
      );
      return;
    }

    const localeKey = args.locale === "fr" ? "fr" : "en";
    const copy = COPY[localeKey];

    const resend = new Resend(apiKey);
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: args.email,
        subject: copy.subject,
        html: renderEmail(copy),
      });
      if (error) throw new Error(error.message);
      console.log(`Newsletter welcome sent to ${args.email} (resend id: ${data?.id})`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Failed to send newsletter welcome to ${args.email}:`, message);
    }
  },
});

type Copy = typeof COPY[keyof typeof COPY];

function renderEmail(c: Copy): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#059669,#10b981 50%,#14b8a6);padding:36px 28px;color:#fff">
        <p style="margin:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;opacity:0.9">Mboa Property Group</p>
        <h1 style="margin:8px 0 0;font-size:26px;font-weight:700">${c.heading}</h1>
      </div>
      <div style="padding:28px">
        <p style="margin:0;font-size:15px;line-height:1.65;color:#1f2937">${c.body}</p>
        <p style="margin:24px 0 0;font-size:14px;color:#6b7280">${c.sign}</p>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #f3f4f6">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5">${c.unsubscribe}</p>
      </div>
    </div>
  </div></body></html>`;
}
