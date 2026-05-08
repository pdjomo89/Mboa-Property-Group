"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/loading-spinner";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, Mail, MessageSquare } from "lucide-react";

export default function SettingsPage() {
  const { profile, isLoading } = useCurrentUser();
  const updateProfile = useMutation(api.users.updateProfile);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [email, setEmail] = useState("");

  // Notification preferences
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPhone(profile.phone);
      setLanguage(profile.preferredLanguage);
      setEmail(profile.email ?? "");
      setNotifyWhatsApp(profile.notifyWhatsApp !== false);
      setNotifyEmail(profile.notifyEmail !== false);
      setWhatsAppPhone(profile.whatsAppPhone ?? "");
      setNotificationEmail(profile.notificationEmail ?? "");
    }
  }, [profile]);

  if (isLoading) return <PageLoading />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({
        fullName,
        phone,
        preferredLanguage: language,
        email: email || undefined,
        notifyWhatsApp,
        notifyEmail,
        whatsAppPhone: whatsAppPhone || undefined,
        notificationEmail: notificationEmail || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Settings" description="Manage your profile and notification preferences" />

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {profile?.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
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

            <Separator />

            {/* Notification Preferences */}
            <div>
              <h3 className="text-base font-semibold mb-4">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose how you want to receive notifications about issues, messages, and updates.
              </p>

              <div className="space-y-4">
                {/* WhatsApp */}
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">WhatsApp Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive issue updates and messages via WhatsApp
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifyWhatsApp}
                        onClick={() => setNotifyWhatsApp(!notifyWhatsApp)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          notifyWhatsApp ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
                            notifyWhatsApp ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {notifyWhatsApp && (
                      <div className="space-y-2">
                        <Label htmlFor="whatsAppPhone" className="text-xs">
                          WhatsApp Number (leave empty to use your profile phone)
                        </Label>
                        <Input
                          id="whatsAppPhone"
                          placeholder={phone || "+237XXXXXXXXX"}
                          value={whatsAppPhone}
                          onChange={(e) => setWhatsAppPhone(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive issue updates and messages via email
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifyEmail}
                        onClick={() => setNotifyEmail(!notifyEmail)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          notifyEmail ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
                            notifyEmail ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    {notifyEmail && (
                      <div className="space-y-2">
                        <Label htmlFor="notificationEmail" className="text-xs">
                          Notification Email (leave empty to use your profile email)
                        </Label>
                        <Input
                          id="notificationEmail"
                          type="email"
                          placeholder={email || "your@email.com"}
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Saved!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
