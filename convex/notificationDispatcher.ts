"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Central dispatcher: sends notifications via all enabled channels for a user
export const dispatch = internalAction({
  args: {
    recipientId: v.id("profiles"),
    notificationId: v.optional(v.id("notifications")),
    title: v.string(),
    body: v.string(),
    type: v.string(),
    issueTitle: v.optional(v.string()),
    propertyName: v.optional(v.string()),
    unitNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch recipient profile to get preferences and contact info
    const profile: any = await ctx.runQuery(
      internal.internalQueries.getRecipientProfile,
      { recipientId: args.recipientId }
    );

    if (!profile) {
      console.error(`Profile not found for recipient: ${args.recipientId}`);
      return;
    }

    // Build contextual messages
    const whatsAppBody = formatWhatsAppMessage(args, profile);
    const emailSubject = args.title;
    const emailBody = formatEmailBody(args, profile);

    const promises: Promise<unknown>[] = [];

    // Send WhatsApp if enabled and phone available
    if (profile.notifyWhatsApp !== false) {
      const whatsAppPhone = profile.whatsAppPhone || profile.phone;
      if (whatsAppPhone) {
        promises.push(
          ctx.runAction(internal.whatsapp.sendWhatsApp, {
            to: whatsAppPhone,
            body: whatsAppBody,
            recipientId: args.recipientId,
            notificationId: args.notificationId,
          })
        );
      }
    }

    // Send email if enabled and email available
    if (profile.notifyEmail !== false) {
      const email = profile.notificationEmail || profile.email;
      if (email) {
        promises.push(
          ctx.runAction(internal.email.sendEmail, {
            to: email,
            subject: emailSubject,
            body: emailBody,
            recipientId: args.recipientId,
            notificationId: args.notificationId,
          })
        );
      }
    }

    // Send all in parallel
    await Promise.allSettled(promises);
  },
});

function formatWhatsAppMessage(
  args: {
    title: string;
    body: string;
    type: string;
    issueTitle?: string;
    propertyName?: string;
    unitNumber?: string;
  },
  profile: { fullName: string; preferredLanguage: string }
): string {
  const isFr = profile.preferredLanguage === "fr";
  const name = profile.fullName.split(" ")[0];

  const greeting = isFr ? `Bonjour ${name}` : `Hello ${name}`;
  const appName = "Mboa Property Group";

  let message = `${greeting},\n\n`;

  switch (args.type) {
    case "new_issue":
      message += isFr
        ? `Un nouveau problème a été signalé.\n\n`
        : `A new issue has been reported.\n\n`;
      break;
    case "status_change":
      message += isFr
        ? `Le statut d'un problème a été mis à jour.\n\n`
        : `An issue status has been updated.\n\n`;
      break;
    case "new_message":
      message += isFr
        ? `Vous avez reçu un nouveau message.\n\n`
        : `You have received a new message.\n\n`;
      break;
    case "assignment":
      message += isFr
        ? `Un problème nécessite votre attention.\n\n`
        : `An issue requires your attention.\n\n`;
      break;
    default:
      message += "";
  }

  message += `${args.body}`;

  if (args.propertyName) {
    const label = isFr ? "Propriété" : "Property";
    message += `\n${label}: ${args.propertyName}`;
  }
  if (args.unitNumber) {
    const label = isFr ? "Unité" : "Unit";
    message += `\n${label}: ${args.unitNumber}`;
  }
  if (args.issueTitle) {
    const label = isFr ? "Problème" : "Issue";
    message += `\n${label}: ${args.issueTitle}`;
  }

  message += `\n\n— ${appName}`;

  return message;
}

function formatEmailBody(
  args: {
    title: string;
    body: string;
    type: string;
    issueTitle?: string;
    propertyName?: string;
    unitNumber?: string;
  },
  profile: { fullName: string; preferredLanguage: string }
): string {
  const isFr = profile.preferredLanguage === "fr";
  const name = profile.fullName.split(" ")[0];

  let details = args.body;

  if (args.propertyName || args.unitNumber || args.issueTitle) {
    details += "<br><br><strong>";
    details += isFr ? "Détails:" : "Details:";
    details += "</strong><br>";

    if (args.propertyName) {
      details += `${isFr ? "Propriété" : "Property"}: ${args.propertyName}<br>`;
    }
    if (args.unitNumber) {
      details += `${isFr ? "Unité" : "Unit"}: ${args.unitNumber}<br>`;
    }
    if (args.issueTitle) {
      details += `${isFr ? "Problème" : "Issue"}: ${args.issueTitle}<br>`;
    }
  }

  return `${isFr ? "Bonjour" : "Hello"} ${name},<br><br>${details}`;
}
