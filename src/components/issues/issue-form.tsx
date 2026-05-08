"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ImagePlus, X } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import {
  URGENCY_LABELS,
  CATEGORY_LABELS,
  COMMON_ISSUES,
} from "@/lib/constants";

interface IssueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function IssueForm({ onSuccess, onCancel }: IssueFormProps) {
  const createIssue = useMutation(api.issues.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const myUnit = useQuery(api.units.getMyUnit);

  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIssueSelect = (value: string) => {
    setSelectedIssue(value);
    if (value === "__custom__") {
      setUrgency("");
      setCategory("");
      return;
    }
    const issue = COMMON_ISSUES.find((i) => i.title === value);
    if (issue) {
      setUrgency(issue.urgency);
      setCategory(issue.category);
    }
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (): Promise<Id<"_storage">[]> => {
    const ids: Id<"_storage">[] = [];
    for (const img of images) {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": img.file.type },
        body: img.file,
      });
      const { storageId } = await result.json();
      ids.push(storageId);
    }
    return ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myUnit) return;
    setError("");
    setLoading(true);

    try {
      const imageIds = images.length > 0 ? await uploadImages() : undefined;
      const title =
        selectedIssue === "__custom__"
          ? "Other issue"
          : selectedIssue;

      await createIssue({
        title,
        description,
        unitId: myUnit._id as Id<"units">,
        urgency: urgency as any,
        category: category as any,
        imageIds,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  if (myUnit === undefined) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading your unit info...
      </div>
    );
  }

  if (myUnit === null) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          You are not assigned to any unit yet. Please contact the admin to be
          assigned to a unit before reporting issues.
        </p>
        <Button variant="outline" onClick={onCancel} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  const isCustom = selectedIssue === "__custom__";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md bg-muted p-3 text-sm">
        Reporting for: <strong>{myUnit.propertyName}</strong> - Unit{" "}
        <strong>{myUnit.unitNumber}</strong>
      </div>

      {/* Predefined issue selection */}
      <div className="space-y-2">
        <Label>What is the issue?</Label>
        <Select value={selectedIssue} onValueChange={handleIssueSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select an issue..." />
          </SelectTrigger>
          <SelectContent>
            {COMMON_ISSUES.map((issue) => (
              <SelectItem key={issue.title} value={issue.title}>
                {issue.title}
              </SelectItem>
            ))}
            <SelectItem value="__custom__">
              Something else...
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show urgency/category overrides when custom or for adjustments */}
      {isCustom && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Urgency</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(URGENCY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Auto-filled info when a predefined issue is selected */}
      {selectedIssue && !isCustom && (
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="rounded bg-muted px-2 py-1">
            Category: {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
          </span>
          <span className="rounded bg-muted px-2 py-1">
            Urgency: {URGENCY_LABELS[urgency as keyof typeof URGENCY_LABELS]}
          </span>
        </div>
      )}

      {/* Notes / description */}
      <div className="space-y-2">
        <Label htmlFor="description">Additional Notes</Label>
        <Textarea
          id="description"
          placeholder="Provide more details about the issue — location, when it started, how severe it is..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <Label>Photos (up to 5)</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative h-24 w-24 rounded-lg border overflow-hidden group"
            >
              <img
                src={img.preview}
                alt={`Upload ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-xs">Add</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageAdd}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !selectedIssue || (!isCustom ? false : !urgency || !category)}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Issue
        </Button>
      </div>
    </form>
  );
}
