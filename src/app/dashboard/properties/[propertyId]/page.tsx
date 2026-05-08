"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { UnitForm } from "@/components/properties/unit-form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Home, MapPin, Plus, User, UserPlus } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatXAF } from "@/lib/format";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.propertyId as Id<"properties">;
  const { isAdmin } = useCurrentUser();
  const property = useQuery(api.properties.getById, { propertyId });
  const tenants = useQuery(api.users.listByRole, { role: "tenant" }) ?? [];
  const assignTenant = useMutation(api.units.assignTenant);

  const [showUnitForm, setShowUnitForm] = useState(false);
  const [assigningUnit, setAssigningUnit] = useState<string | null>(null);

  if (property === undefined) return <LoadingSpinner />;

  const handleAssignTenant = async (unitId: string, tenantId: string) => {
    await assignTenant({
      unitId: unitId as Id<"units">,
      tenantId: tenantId as Id<"profiles">,
    });
    setAssigningUnit(null);
  };

  const handleRemoveTenant = async (unitId: string) => {
    await assignTenant({
      unitId: unitId as Id<"units">,
      tenantId: undefined,
    });
  };

  return (
    <div>
      <PageHeader
        title={property.name}
        description={`${property.address}, ${property.city}`}
        action={
          isAdmin ? (
            <Button onClick={() => setShowUnitForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          ) : undefined
        }
      />

      {/* Property Info */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Home className="h-4 w-4" />
              Total Units
            </div>
            <p className="text-2xl font-bold">{property.totalUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <User className="h-4 w-4" />
              Occupied
            </div>
            <p className="text-2xl font-bold">
              {property.occupiedUnits} / {property.units.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <User className="h-4 w-4" />
              Landlord
            </div>
            <p className="text-lg font-semibold">{property.landlordName}</p>
          </CardContent>
        </Card>
      </div>

      {/* Units List */}
      <h2 className="text-xl font-semibold mb-4">Units</h2>
      {property.units.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No units yet"
          description="Add units to this property."
          action={
            isAdmin ? (
              <Button onClick={() => setShowUnitForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {property.units.map((unit) => (
            <Card key={unit._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Unit {unit.unitNumber}</CardTitle>
                  <Badge variant={unit.isOccupied ? "default" : "outline"}>
                    {unit.isOccupied ? "Occupied" : "Vacant"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {unit.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {unit.description}
                  </p>
                )}
                {unit.monthlyRent && (
                  <p className="text-sm font-medium mb-2">
                    {formatXAF(unit.monthlyRent)}/month
                  </p>
                )}
                {unit.tenantId ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tenant assigned
                    </span>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTenant(unit._id)}
                        className="text-destructive text-xs"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ) : isAdmin ? (
                  assigningUnit === unit._id ? (
                    <Select
                      onValueChange={(v) => handleAssignTenant(unit._id, v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((t) => (
                          <SelectItem key={t._id} value={t._id}>
                            {t.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setAssigningUnit(unit._id)}
                    >
                      <UserPlus className="mr-1 h-3 w-3" />
                      Assign Tenant
                    </Button>
                  )
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showUnitForm} onOpenChange={setShowUnitForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Unit to {property.name}</DialogTitle>
          </DialogHeader>
          <UnitForm
            propertyId={propertyId}
            onSuccess={() => setShowUnitForm(false)}
            onCancel={() => setShowUnitForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
