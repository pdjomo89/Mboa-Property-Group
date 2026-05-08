"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssueCard } from "@/components/issues/issue-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Users,
  UserCircle,
} from "lucide-react";

export function AdminDashboard() {
  const properties = useQuery(api.properties.list) ?? [];
  const issues = useQuery(api.issues.list, {}) ?? [];
  const tenants = useQuery(api.users.listByRole, { role: "tenant" }) ?? [];
  const landlords = useQuery(api.users.listByRole, { role: "landlord" }) ?? [];

  const openIssues = issues.filter(
    (i) => !["resolved", "closed"].includes(i.status)
  );
  const newIssues = issues.filter((i) => i.status === "new");

  const stats = [
    {
      label: "Properties",
      value: properties.length,
      icon: Building2,
      href: "/dashboard/properties",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Open Issues",
      value: openIssues.length,
      icon: AlertTriangle,
      href: "/dashboard/issues",
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Tenants",
      value: tenants.length,
      icon: Users,
      href: "/dashboard/tenants",
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Landlords",
      value: landlords.length,
      icon: UserCircle,
      href: "/dashboard/landlords",
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* New Issues requiring attention */}
      {newIssues.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">New Issues Requiring Attention</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/issues">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {newIssues.slice(0, 5).map((issue) => (
              <IssueCard key={issue._id} issue={issue as any} />
            ))}
          </div>
        </div>
      )}

      {/* Recent issues */}
      {newIssues.length === 0 && issues.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Issues</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/issues">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <IssueCard key={issue._id} issue={issue as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
