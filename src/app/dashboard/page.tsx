"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { TenantDashboard } from "@/components/dashboard/tenant-dashboard";
import { LandlordDashboard } from "@/components/dashboard/landlord-dashboard";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading-spinner";

export default function DashboardPage() {
  const { profile, isLoading } = useCurrentUser();

  if (isLoading) return <PageLoading />;

  const greeting = getGreeting();

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${profile?.fullName?.split(" ")[0] ?? "there"}`}
        description={getRoleDescription(profile?.role)}
      />
      {profile?.role === "admin" && <AdminDashboard />}
      {profile?.role === "tenant" && <TenantDashboard />}
      {profile?.role === "landlord" && <LandlordDashboard />}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getRoleDescription(role?: string): string {
  switch (role) {
    case "admin":
      return "Here's an overview of your property management operations.";
    case "tenant":
      return "Here's the status of your unit and reported issues.";
    case "landlord":
      return "Here's an overview of your properties and their issues.";
    default:
      return "";
  }
}
