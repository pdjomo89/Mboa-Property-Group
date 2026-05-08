"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function NewsletterForm({ t, locale }: { t: Dictionary["news"]; locale: Locale }) {
  const subscribe = useMutation(api.newsletter.subscribe);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const result = await subscribe({
        email: email.trim(),
        source: "news-page",
        locale,
      });
      const message =
        result.status === "already_subscribed" ? t.newsletterAlready : t.newsletterSuccess;
      setStatus({ kind: "success", message });
      setEmail("");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      const message =
        code.includes("EMAIL_INVALID") || code.includes("EMAIL_REQUIRED")
          ? t.newsletterErrorInvalid
          : t.newsletterErrorGeneric;
      setStatus({ kind: "error", message });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <div className="w-full md:w-auto">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting || status.kind === "success"}
          placeholder={t.newsletterPlaceholder}
          className="rounded-full border-0 bg-white/15 px-5 py-3 text-sm text-white placeholder:text-emerald-100/70 ring-1 ring-white/30 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60 sm:w-72 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={submitting || status.kind === "success"}
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
              {t.subscribing}
            </>
          ) : (
            <>
              {t.subscribe} <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {status.kind === "success" && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur">
          <CheckCircle2 className="h-3.5 w-3.5 text-lime-300" />
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-rose-300/50 backdrop-blur">
          <AlertCircle className="h-3.5 w-3.5 text-rose-200" />
          {status.message}
        </p>
      )}
    </div>
  );
}
