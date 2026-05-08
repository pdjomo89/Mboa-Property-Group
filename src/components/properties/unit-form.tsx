"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface UnitFormProps {
  propertyId: Id<"properties">;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UnitForm({ propertyId, onSuccess, onCancel }: UnitFormProps) {
  const createUnit = useMutation(api.units.create);
  const tenants = useQuery(api.users.listByRole, { role: "tenant" }) ?? [];

  const [unitNumber, setUnitNumber] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUnit({
        propertyId,
        unitNumber,
        description: description || undefined,
        monthlyRent: monthlyRent ? parseInt(monthlyRent) : undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create unit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input
            id="unitNumber"
            placeholder="e.g., A1, B12"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent (XAF)</Label>
          <Input
            id="monthlyRent"
            type="number"
            placeholder="e.g., 150000"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="unitDesc">Description (optional)</Label>
        <Input
          id="unitDesc"
          placeholder="e.g., 2-bedroom apartment, ground floor"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Unit
        </Button>
      </div>
    </form>
  );
}
