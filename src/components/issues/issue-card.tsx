"use client";

import Link from "next/link";
import { AlertTriangle, Building2, Clock, User, CheckCircle2, Circle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IssueStatusBadge } from "./issue-status-badge";
import {
  URGENCY_LABELS,
  CATEGORY_LABELS,
  TENANT_STATUS_MAP,
  TENANT_STATUS_STEPS,
  type IssueStatus,
  type Urgency,
  type IssueCategory,
  type TenantStatus,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

const urgencyColors: Record<string, string> = {
  low: "text-blue-600",
  medium: "text-amber-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

interface IssueCardProps {
  issue: {
    _id: string;
    _creationTime: number;
    title: string;
    description: string;
    status: IssueStatus;
    urgency: Urgency;
    category: IssueCategory;
    propertyName: string;
    unitNumber: string;
    reporterName: string;
  };
  tenantView?: boolean;
}

function StatusTracker({ status }: { status: IssueStatus }) {
  const currentTenantStatus = TENANT_STATUS_MAP[status];
  const currentIndex = TENANT_STATUS_STEPS.indexOf(currentTenantStatus as TenantStatus);

  return (
    <div className="flex items-center gap-1 mt-3">
      {TENANT_STATUS_STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                )}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5" />
                  )}
                </div>
                {i < TENANT_STATUS_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 ${
                      i < currentIndex ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  isCurrent ? "font-semibold text-primary" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function IssueCard({ issue, tenantView }: IssueCardProps) {
  return (
    <Link href={`/dashboard/issues/${issue._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{issue.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-1">
                {issue.description}
              </CardDescription>
            </div>
            {tenantView ? (
              <Badge
                variant={
                  TENANT_STATUS_MAP[issue.status] === "Closed"
                    ? "success"
                    : TENANT_STATUS_MAP[issue.status] === "In Progress"
                      ? "default"
                      : "warning"
                }
              >
                {TENANT_STATUS_MAP[issue.status]}
              </Badge>
            ) : (
              <IssueStatusBadge status={issue.status} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {issue.propertyName} - {issue.unitNumber}
            </span>
            {!tenantView && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {issue.reporterName}
              </span>
            )}
            <span
              className={`flex items-center gap-1 font-medium ${urgencyColors[issue.urgency]}`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {URGENCY_LABELS[issue.urgency]}
            </span>
            <Badge variant="outline" className="text-xs">
              {CATEGORY_LABELS[issue.category]}
            </Badge>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              {formatDateTime(issue._creationTime)}
            </span>
          </div>
          {tenantView && <StatusTracker status={issue.status} />}
        </CardContent>
      </Card>
    </Link>
  );
}
