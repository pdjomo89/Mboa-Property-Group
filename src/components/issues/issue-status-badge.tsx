import { Badge } from "@/components/ui/badge";
import { ISSUE_STATUS_LABELS, type IssueStatus } from "@/lib/constants";

const statusVariants: Record<IssueStatus, "default" | "secondary" | "destructive" | "outline" | "warning" | "success"> = {
  new: "destructive",
  admin_reviewed: "warning",
  landlord_notified: "warning",
  repair_in_progress: "default",
  resolved: "success",
  closed: "secondary",
};

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return (
    <Badge variant={statusVariants[status]}>
      {ISSUE_STATUS_LABELS[status]}
    </Badge>
  );
}
