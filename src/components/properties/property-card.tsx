"use client";

import Link from "next/link";
import { Building2, MapPin, Home, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: {
    _id: string;
    name: string;
    address: string;
    city: string;
    neighborhood?: string;
    totalUnits: number;
    isActive: boolean;
    landlordName?: string;
    occupiedUnits?: number;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/dashboard/properties/${property._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{property.name}</CardTitle>
            </div>
            <Badge variant={property.isActive ? "success" : "secondary"}>
              {property.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.address}, {property.neighborhood && `${property.neighborhood}, `}
            {property.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              {property.totalUnits} units
            </div>
            {property.landlordName && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {property.landlordName}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
