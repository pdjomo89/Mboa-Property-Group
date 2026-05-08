"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyForm } from "@/components/properties/property-form";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Plus } from "lucide-react";

export default function PropertiesPage() {
  const { isAdmin } = useCurrentUser();
  const properties = useQuery(api.properties.list);
  const [showForm, setShowForm] = useState(false);

  if (properties === undefined) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Manage your property portfolio"
        action={
          isAdmin ? (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          ) : undefined
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description={
            isAdmin
              ? "Get started by adding your first property."
              : "No properties are assigned to you yet."
          }
          action={
            isAdmin ? (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property as any} />
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <PropertyForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
