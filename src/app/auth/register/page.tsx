"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { signIn } = useAuthActions();
  const createProfile = useMutation(api.users.createProfile);
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneEmail = `${phone.replace(/\s/g, "")}@mboa.cm`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (
      !phone.match(/^\+?237\d{9}$/) &&
      !phone.match(/^\d{9}$/) &&
      !phone.match(/^\+?1\d{10}$/)
    ) {
      setError("Please enter a valid phone number (e.g., 237XXXXXXXXX or +1XXXXXXXXXX)");
      return;
    }

    setLoading(true);

    try {
      // Register with Convex Auth using phone-as-email
      await signIn("password", {
        email: phoneEmail,
        password,
        flow: "signUp",
      });

      // Create profile
      const normalizedPhone = phone.startsWith("+")
        ? phone
        : phone.startsWith("237")
          ? `+${phone}`
          : phone.startsWith("1") && phone.length === 11
            ? `+${phone}`
            : `+237${phone}`;

      await createProfile({
        fullName,
        phone: normalizedPhone,
        role,
        preferredLanguage: language,
        email: phoneEmail,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-5 pointer-events-none"
        style={{ backgroundImage: "url('/logo.png')", backgroundSize: "500px" }}
      />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <Image src="/logo.png" alt="Mboa Property Group" width={120} height={120} className="object-contain mx-auto" />
          </div>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription className="text-base">
            Join Mboa Property Group
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="237XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Cameroon: 237XXXXXXXXX or U.S.: +1XXXXXXXXXX
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={language}
                  onValueChange={(v) => setLanguage(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Fran&ccedil;ais</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
