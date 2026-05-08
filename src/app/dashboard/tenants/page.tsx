"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Users } from "lucide-react";
import { formatPhone } from "@/lib/format";

export default function TenantsPage() {
  const tenants = useQuery(api.users.listByRole, { role: "tenant" });

  if (tenants === undefined) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Tenants"
        description={`${tenants.length} registered tenant${tenants.length !== 1 ? "s" : ""}`}
      />

      {tenants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No tenants yet"
          description="Tenants will appear here once they register."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card key={tenant._id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-50 text-blue-600">
                      {tenant.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tenant.fullName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {formatPhone(tenant.phone)}
                    </p>
                  </div>
                  <Badge variant={tenant.isActive ? "success" : "secondary"}>
                    {tenant.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
