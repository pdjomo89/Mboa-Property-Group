import { ISSUE_STATUS_LABELS, type IssueStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { CheckCircle, Circle } from "lucide-react";

interface TimelineEntry {
  _id: string;
  _creationTime: number;
  fromStatus?: string;
  toStatus: string;
  changedByName: string;
  note?: string;
}

export function IssueTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Status History</h3>
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
        {entries.map((entry, i) => (
          <div key={entry._id} className="relative flex gap-3">
            <div className="absolute -left-6 mt-0.5">
              {i === entries.length - 1 ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {ISSUE_STATUS_LABELS[entry.toStatus as IssueStatus] ?? entry.toStatus}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.changedByName} &middot;{" "}
                {formatDateTime(entry._creationTime)}
              </p>
              {entry.note && (
                <p className="text-sm text-muted-foreground mt-1 italic">
                  &ldquo;{entry.note}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
