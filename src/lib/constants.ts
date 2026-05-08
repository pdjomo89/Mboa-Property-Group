export const ROLES = {
  ADMIN: "admin",
  TENANT: "tenant",
  LANDLORD: "landlord",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ISSUE_STATUSES = {
  NEW: "new",
  ADMIN_REVIEWED: "admin_reviewed",
  LANDLORD_NOTIFIED: "landlord_notified",
  REPAIR_IN_PROGRESS: "repair_in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[keyof typeof ISSUE_STATUSES];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  new: "New",
  admin_reviewed: "Admin Reviewed",
  landlord_notified: "Landlord Notified",
  repair_in_progress: "Repair In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const URGENCY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type Urgency = (typeof URGENCY_LEVELS)[keyof typeof URGENCY_LEVELS];

export const URGENCY_LABELS: Record<Urgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const ISSUE_CATEGORIES = {
  PLUMBING: "plumbing",
  ELECTRICAL: "electrical",
  STRUCTURAL: "structural",
  APPLIANCE: "appliance",
  PEST_CONTROL: "pest_control",
  SECURITY: "security",
  OTHER: "other",
} as const;

export type IssueCategory =
  (typeof ISSUE_CATEGORIES)[keyof typeof ISSUE_CATEGORIES];

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  structural: "Structural",
  appliance: "Appliance",
  pest_control: "Pest Control",
  security: "Security",
  other: "Other",
};

export const COMMON_ISSUES: { title: string; category: IssueCategory; urgency: Urgency }[] = [
  { title: "Leaking faucet or pipe", category: "plumbing", urgency: "medium" },
  { title: "Clogged drain or toilet", category: "plumbing", urgency: "high" },
  { title: "No hot water", category: "plumbing", urgency: "high" },
  { title: "Power outlet not working", category: "electrical", urgency: "medium" },
  { title: "Frequent power outages", category: "electrical", urgency: "high" },
  { title: "Light fixture broken", category: "electrical", urgency: "low" },
  { title: "Cracked wall or ceiling", category: "structural", urgency: "medium" },
  { title: "Broken window or door", category: "structural", urgency: "high" },
  { title: "Roof leak", category: "structural", urgency: "critical" },
  { title: "Air conditioner not working", category: "appliance", urgency: "medium" },
  { title: "Refrigerator malfunction", category: "appliance", urgency: "high" },
  { title: "Washing machine issue", category: "appliance", urgency: "low" },
  { title: "Insect or rodent infestation", category: "pest_control", urgency: "high" },
  { title: "Termite damage", category: "pest_control", urgency: "critical" },
  { title: "Broken lock or door handle", category: "security", urgency: "critical" },
  { title: "Security light not working", category: "security", urgency: "high" },
  { title: "Other issue", category: "other", urgency: "medium" },
];

// Tenant-friendly status mapping
export const TENANT_STATUS_MAP: Record<IssueStatus, string> = {
  new: "Received",
  admin_reviewed: "Received",
  landlord_notified: "In Progress",
  repair_in_progress: "In Progress",
  resolved: "Closed",
  closed: "Closed",
};

export type TenantStatus = "Received" | "In Progress" | "Closed";

export const TENANT_STATUS_STEPS: TenantStatus[] = ["Received", "In Progress", "Closed"];

export const VALID_STATUS_TRANSITIONS: Record<IssueStatus, { nextStatuses: IssueStatus[]; allowedRoles: Role[] }[]> = {
  new: [{ nextStatuses: ["admin_reviewed"], allowedRoles: ["admin"] }],
  admin_reviewed: [{ nextStatuses: ["landlord_notified"], allowedRoles: ["admin"] }],
  landlord_notified: [{ nextStatuses: ["repair_in_progress"], allowedRoles: ["admin", "landlord"] }],
  repair_in_progress: [{ nextStatuses: ["resolved"], allowedRoles: ["admin"] }],
  resolved: [{ nextStatuses: ["closed"], allowedRoles: ["admin", "tenant"] }],
  closed: [],
};
