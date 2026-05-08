"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface PropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PropertyForm({ onSuccess, onCancel }: PropertyFormProps) {
  const createProperty = useMutation(api.properties.create);
  const landlords = useQuery(api.users.listByRole, { role: "landlord" }) ?? [];

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [landlordId, setLandlordId] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createProperty({
        name,
        address,
        city,
        neighborhood: neighborhood || undefined,
        description: description || undefined,
        landlordId: landlordId as Id<"profiles">,
        totalUnits: parseInt(totalUnits) || 0,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create property");
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
      <div className="space-y-2">
        <Label htmlFor="name">Property Name</Label>
        <Input
          id="name"
          placeholder="e.g., Residence Les Palmiers"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="e.g., Rue 1.234, Bonapriso"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Douala">Douala</SelectItem>
              <SelectItem value="Yaoundé">Yaound&eacute;</SelectItem>
              <SelectItem value="Bafoussam">Bafoussam</SelectItem>
              <SelectItem value="Bamenda">Bamenda</SelectItem>
              <SelectItem value="Kribi">Kribi</SelectItem>
              <SelectItem value="Limbe">Limbe</SelectItem>
              <SelectItem value="Buea">Buea</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            id="neighborhood"
            placeholder="e.g., Bonapriso"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalUnits">Total Units</Label>
          <Input
            id="totalUnits"
            type="number"
            min="1"
            placeholder="e.g., 10"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Landlord</Label>
          <Select value={landlordId} onValueChange={setLandlordId}>
            <SelectTrigger>
              <SelectValue placeholder="Select landlord" />
            </SelectTrigger>
            <SelectContent>
              {landlords.map((l) => (
                <SelectItem key={l._id} value={l._id}>
                  {l.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the property..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !landlordId}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Property
        </Button>
      </div>
    </form>
  );
}
