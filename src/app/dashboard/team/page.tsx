"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Shield, Users } from "lucide-react";
import { formatPhone } from "@/lib/format";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export default function TeamPage() {
  const allUsers = useQuery(api.users.listAll);
  const changeRole = useMutation(api.users.changeRole);
  const [loading, setLoading] = useState<string | null>(null);

  if (allUsers === undefined) return <LoadingSpinner />;

  const admins = allUsers.filter((u) => u.role === "admin");
  const nonAdmins = allUsers.filter((u) => u.role !== "admin");

  const handlePromote = async (profileId: Id<"profiles">) => {
    setLoading(profileId);
    try {
      await changeRole({ profileId, role: "admin" });
    } finally {
      setLoading(null);
    }
  };

  const handleDemote = async (profileId: Id<"profiles">, originalRole: string) => {
    setLoading(profileId);
    try {
      await changeRole({
        profileId,
        role: (originalRole === "admin" ? "tenant" : originalRole) as any,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Team Management"
        description="Manage admin access for your employees"
      />

      {/* Current Admins */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admins ({admins.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((user) => (
            <Card key={user._id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {formatPhone(user.phone)}
                    </p>
                  </div>
                  <Badge variant="default">Admin</Badge>
                </div>
                {admins.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-destructive hover:text-destructive"
                    onClick={() => handleDemote(user._id, "tenant")}
                    disabled={loading === user._id}
                  >
                    Remove Admin
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Users */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Other Users ({nonAdmins.length})
        </h2>
        {nonAdmins.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No other users"
            description="When tenants or landlords register, they will appear here. You can promote them to admin."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nonAdmins.map((user) => (
              <Card key={user._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {formatPhone(user.phone)}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => handlePromote(user._id)}
                    disabled={loading === user._id}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
