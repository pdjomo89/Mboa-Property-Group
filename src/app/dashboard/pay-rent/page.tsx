"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Phone, Banknote } from "lucide-react";
import { formatXAF } from "@/lib/format";

export default function PayRentPage() {
  const { profile, isLoading } = useCurrentUser();
  const myUnit = useQuery(api.units.getMyUnit);

  if (isLoading || myUnit === undefined) return <PageLoading />;

  if (!myUnit) {
    return (
      <div>
        <PageHeader
          title="Pay Rent"
          description="You are not assigned to a unit yet."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Pay Rent"
        description="Choose a payment method to pay your monthly rent"
      />

      <div className="space-y-6">
        {/* Rent Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Rent Summary</CardTitle>
            <CardDescription>
              {myUnit.propertyName} - Unit {myUnit.unitNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Amount Due</span>
              <span className="text-3xl font-bold text-primary">
                {myUnit.monthlyRent ? formatXAF(myUnit.monthlyRent) : "Contact admin"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50">
                  <Phone className="h-7 w-7 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">MTN Mobile Money</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay with your MTN MoMo wallet
                  </p>
                </div>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                  <Phone className="h-7 w-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Orange Money</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay with your Orange Money wallet
                  </p>
                </div>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <Banknote className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay via direct bank transfer
                  </p>
                </div>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Payment integration is being set up. For now, please contact your property admin to arrange payment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
