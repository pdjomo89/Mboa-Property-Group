import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("tenant"),
      v.literal("landlord")
    ),
    fullName: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    preferredLanguage: v.union(v.literal("fr"), v.literal("en")),
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
    notifyWhatsApp: v.optional(v.boolean()),
    notifyEmail: v.optional(v.boolean()),
    whatsAppPhone: v.optional(v.string()),
    notificationEmail: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_role", ["role"])
    .index("by_phone", ["phone"]),

  properties: defineTable({
    name: v.string(),
    address: v.string(),
    city: v.string(),
    neighborhood: v.optional(v.string()),
    description: v.optional(v.string()),
    landlordId: v.id("profiles"),
    totalUnits: v.number(),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    createdBy: v.id("profiles"),
  })
    .index("by_landlord", ["landlordId"])
    .index("by_city", ["city"]),

  units: defineTable({
    propertyId: v.id("properties"),
    unitNumber: v.string(),
    description: v.optional(v.string()),
    monthlyRent: v.optional(v.number()),
    tenantId: v.optional(v.id("profiles")),
    isOccupied: v.boolean(),
  })
    .index("by_property", ["propertyId"])
    .index("by_tenant", ["tenantId"]),

  issues: defineTable({
    title: v.string(),
    description: v.string(),
    unitId: v.id("units"),
    propertyId: v.id("properties"),
    reportedBy: v.id("profiles"),
    assignedTo: v.optional(v.id("profiles")),
    status: v.union(
      v.literal("new"),
      v.literal("admin_reviewed"),
      v.literal("landlord_notified"),
      v.literal("repair_in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    urgency: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("plumbing"),
      v.literal("electrical"),
      v.literal("structural"),
      v.literal("appliance"),
      v.literal("pest_control"),
      v.literal("security"),
      v.literal("other")
    ),
    imageIds: v.optional(v.array(v.id("_storage"))),
    resolvedAt: v.optional(v.number()),
    adminNotes: v.optional(v.string()),
    quoteAmount: v.optional(v.number()),
    quoteDescription: v.optional(v.string()),
    quoteFileIds: v.optional(v.array(v.id("_storage"))),
    quoteStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    quoteRejectionNote: v.optional(v.string()),
  })
    .index("by_property", ["propertyId"])
    .index("by_unit", ["unitId"])
    .index("by_reporter", ["reportedBy"])
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"]),

  issueStatusHistory: defineTable({
    issueId: v.id("issues"),
    fromStatus: v.optional(v.string()),
    toStatus: v.string(),
    changedBy: v.id("profiles"),
    note: v.optional(v.string()),
  }).index("by_issue", ["issueId"]),

  messages: defineTable({
    issueId: v.id("issues"),
    senderId: v.id("profiles"),
    content: v.string(),
    imageId: v.optional(v.id("_storage")),
    isSystemMessage: v.boolean(),
  }).index("by_issue", ["issueId"]),

  notifications: defineTable({
    recipientId: v.id("profiles"),
    type: v.union(
      v.literal("new_issue"),
      v.literal("status_change"),
      v.literal("new_message"),
      v.literal("assignment"),
      v.literal("system")
    ),
    title: v.string(),
    body: v.string(),
    issueId: v.optional(v.id("issues")),
    isRead: v.boolean(),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_unread", ["recipientId", "isRead"]),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    role: v.union(
      v.literal("tenant"),
      v.literal("landlord"),
      v.literal("partner"),
      v.literal("other")
    ),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
      v.literal("archived")
    ),
  }).index("by_status", ["status"]),

  notificationLogs: defineTable({
    notificationId: v.optional(v.id("notifications")),
    recipientId: v.id("profiles"),
    channel: v.union(v.literal("whatsapp"), v.literal("email")),
    status: v.union(
      v.literal("sent"),
      v.literal("failed"),
      v.literal("pending")
    ),
    externalId: v.optional(v.string()),
    error: v.optional(v.string()),
    to: v.string(),
    subject: v.optional(v.string()),
    body: v.string(),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_channel", ["channel"]),
});

export default schema;
