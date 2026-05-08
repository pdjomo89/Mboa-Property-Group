"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueForm } from "@/components/issues/issue-form";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Plus } from "lucide-react";
import { TENANT_STATUS_MAP } from "@/lib/constants";

export default function IssuesPage() {
  const { isTenant } = useCurrentUser();
  const allIssues = useQuery(api.issues.list, {});
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  if (allIssues === undefined) return <LoadingSpinner />;

  // For tenants, filter by tenant-friendly status
  const filteredIssues =
    activeTab === "all"
      ? allIssues
      : isTenant
        ? allIssues.filter((i) => TENANT_STATUS_MAP[i.status] === activeTab)
        : allIssues.filter((i) => i.status === activeTab);

  // Tenant-friendly counts
  const tenantCounts = {
    received: allIssues.filter(
      (i) => TENANT_STATUS_MAP[i.status] === "Received"
    ).length,
    inProgress: allIssues.filter(
      (i) => TENANT_STATUS_MAP[i.status] === "In Progress"
    ).length,
    closed: allIssues.filter(
      (i) => TENANT_STATUS_MAP[i.status] === "Closed"
    ).length,
  };

  return (
    <div>
      <PageHeader
        title={isTenant ? "My Issues" : "Issues"}
        description={
          isTenant
            ? "Track the status of your reported issues"
            : "Manage property issues"
        }
        action={
          isTenant ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          ) : undefined
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All ({allIssues.length})</TabsTrigger>
          {isTenant ? (
            <>
              <TabsTrigger value="Received">
                Received ({tenantCounts.received})
              </TabsTrigger>
              <TabsTrigger value="In Progress">
                In Progress ({tenantCounts.inProgress})
              </TabsTrigger>
              <TabsTrigger value="Closed">
                Closed ({tenantCounts.closed})
              </TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="new">
                New ({allIssues.filter((i) => i.status === "new").length})
              </TabsTrigger>
              <TabsTrigger value="admin_reviewed">
                Reviewed (
                {allIssues.filter((i) => i.status === "admin_reviewed").length})
              </TabsTrigger>
              <TabsTrigger value="repair_in_progress">
                In Progress (
                {
                  allIssues.filter((i) => i.status === "repair_in_progress")
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved (
                {allIssues.filter((i) => i.status === "resolved").length})
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>

      {filteredIssues.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No issues"
          description={
            activeTab === "all"
              ? isTenant
                ? "No issues reported yet. Report an issue if something needs fixing."
                : "No issues to display."
              : "No issues with this status."
          }
          action={
            isTenant && activeTab === "all" ? (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue as any}
              tenantView={isTenant}
            />
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <IssueForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
