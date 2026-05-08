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
import { Building2, Home, CreditCard, MapPin } from "lucide-react";
import { formatXAF } from "@/lib/format";

export default function MyUnitPage() {
  const myUnit = useQuery(api.units.getMyUnit);

  if (myUnit === undefined) return <LoadingSpinner />;

  if (myUnit === null) {
    return (
      <div>
        <PageHeader title="My Unit" />
        <EmptyState
          icon={Home}
          title="No unit assigned"
          description="You haven't been assigned to a unit yet. Please contact the property admin."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Unit" description="Your current accommodation details" />

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{myUnit.propertyName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Home className="h-4 w-4" />
              Unit Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{myUnit.unitNumber}</p>
          </CardContent>
        </Card>

        {myUnit.monthlyRent && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Monthly Rent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {formatXAF(myUnit.monthlyRent)}
              </p>
            </CardContent>
          </Card>
        )}

        {myUnit.description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{myUnit.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
