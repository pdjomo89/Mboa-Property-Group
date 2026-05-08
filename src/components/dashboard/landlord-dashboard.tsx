"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IssueCard } from "@/components/issues/issue-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronRight,
  Wrench,
} from "lucide-react";

export function LandlordDashboard() {
  const properties = useQuery(api.properties.list) ?? [];
  const issues = useQuery(api.issues.list, {}) ?? [];

  const openIssues = issues.filter(
    (i) => !["resolved", "closed"].includes(i.status)
  );
  const needsAttention = issues.filter(
    (i) => i.status === "landlord_notified"
  );
  const inProgress = issues.filter(
    (i) => i.status === "repair_in_progress"
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Building2 className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{properties.length}</p>
            <p className="text-xs text-muted-foreground">My Properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{needsAttention.length}</p>
            <p className="text-xs text-muted-foreground">Needs Attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Wrench className="h-6 w-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{inProgress.length}</p>
            <p className="text-xs text-muted-foreground">Repairs In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {issues.filter((i) => i.status === "resolved" || i.status === "closed").length}
            </p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Issues needing attention */}
      {needsAttention.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-red-600">
              Requires Your Attention
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/issues">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {needsAttention.map((issue) => (
              <IssueCard key={issue._id} issue={issue as any} />
            ))}
          </div>
        </div>
      )}

      {/* All open issues */}
      {openIssues.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Open Issues</h2>
          </div>
          <div className="space-y-3">
            {openIssues.slice(0, 10).map((issue) => (
              <IssueCard key={issue._id} issue={issue as any} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CheckCircle}
          title="All clear!"
          description="No open issues on your properties."
        />
      )}
    </div>
  );
}
