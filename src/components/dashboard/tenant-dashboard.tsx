"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IssueForm } from "@/components/issues/issue-form";
import {
  AlertTriangle,
  Home,
  CreditCard,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { formatXAF } from "@/lib/format";

export function TenantDashboard() {
  const myUnit = useQuery(api.units.getMyUnit);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* My Property Info */}
      {myUnit ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              My Property
            </CardTitle>
            <CardDescription>Your current rental information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Property</p>
                  <p className="font-medium">{myUnit.propertyName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                  <p className="font-medium">{myUnit.unitNumber}</p>
                </div>
              </div>
              {myUnit.monthlyRent && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                    <p className="font-medium">{formatXAF(myUnit.monthlyRent)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : myUnit === null ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Home className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              You haven&apos;t been assigned to a unit yet. Please contact the admin.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Report Issue */}
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setShowForm(true)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Report an Issue</h3>
                <p className="text-sm text-muted-foreground">
                  Something broken? Let us know
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Pay Rent */}
        <Link href="/dashboard/pay-rent">
          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Pay Rent</h3>
                  <p className="text-sm text-muted-foreground">
                    Make your monthly payment
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* My Property */}
        <Link href="/dashboard/my-unit">
          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">My Property</h3>
                  <p className="text-sm text-muted-foreground">
                    View property details
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <IssueForm
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
