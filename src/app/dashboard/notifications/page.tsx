"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  MessageSquare,
  ArrowRightCircle,
  Info,
} from "lucide-react";
import { formatDateTime } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, React.ReactNode> = {
  new_issue: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  status_change: <ArrowRightCircle className="h-5 w-5 text-blue-500" />,
  new_message: <MessageSquare className="h-5 w-5 text-green-500" />,
  assignment: <Info className="h-5 w-5 text-purple-500" />,
  system: <Bell className="h-5 w-5 text-gray-500" />,
};

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list) ?? [];
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications === undefined) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        action={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={() => markAllAsRead({})}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={cn(
                "transition-colors",
                !notification.isRead && "bg-primary/5 border-primary/20"
              )}
            >
              <CardContent className="py-4 flex items-start gap-3">
                <div className="mt-0.5">
                  {typeIcons[notification.type] ?? typeIcons.system}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.isRead && (
                      <Badge variant="default" className="h-4 text-[10px]">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(notification._creationTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {notification.issueId && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/issues/${notification.issueId}`}>
                        View
                      </Link>
                    </Button>
                  )}
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        markAsRead({ notificationId: notification._id })
                      }
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
