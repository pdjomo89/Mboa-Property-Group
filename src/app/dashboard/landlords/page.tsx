"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, UserCircle } from "lucide-react";
import { formatPhone } from "@/lib/format";

export default function LandlordsPage() {
  const landlords = useQuery(api.users.listByRole, { role: "landlord" });

  if (landlords === undefined) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Landlords"
        description={`${landlords.length} registered landlord${landlords.length !== 1 ? "s" : ""}`}
      />

      {landlords.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="No landlords yet"
          description="Landlords will appear here once they register."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {landlords.map((landlord) => (
            <Card key={landlord._id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-purple-50 text-purple-600">
                      {landlord.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{landlord.fullName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {formatPhone(landlord.phone)}
                    </p>
                  </div>
                  <Badge variant={landlord.isActive ? "success" : "secondary"}>
                    {landlord.isActive ? "Active" : "Inactive"}
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
