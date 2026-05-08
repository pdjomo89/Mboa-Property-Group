import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Users,
  UserCircle,
  Bell,
  Settings,
  Home,
  CreditCard,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const commonItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const adminItems: NavItem[] = [
  ...commonItems,
  { label: "Properties", href: "/dashboard/properties", icon: Building2 },
  { label: "Issues", href: "/dashboard/issues", icon: AlertTriangle },
  { label: "Tenants", href: "/dashboard/tenants", icon: Users },
  { label: "Landlords", href: "/dashboard/landlords", icon: UserCircle },
  { label: "Team", href: "/dashboard/team", icon: Shield },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const tenantItems: NavItem[] = [
  ...commonItems,
  { label: "My Property", href: "/dashboard/my-unit", icon: Home },
  { label: "Report Issue", href: "/dashboard/issues", icon: AlertTriangle },
  { label: "Pay Rent", href: "/dashboard/pay-rent", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const landlordItems: NavItem[] = [
  ...commonItems,
  { label: "Properties", href: "/dashboard/properties", icon: Building2 },
  { label: "Issues", href: "/dashboard/issues", icon: AlertTriangle },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function getNavItems(role: string): NavItem[] {
  switch (role) {
    case "admin":
      return adminItems;
    case "tenant":
      return tenantItems;
    case "landlord":
      return landlordItems;
    default:
      return commonItems;
  }
}
