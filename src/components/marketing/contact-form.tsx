"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowRight, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Role = "tenant" | "landlord" | "partner" | "other";
type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

export function ContactForm({ t }: { t: Dictionary["contact"]["form"] }) {
  const submit = useMutation(api.contact.submit);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [role, setRole] = useState<Role>("tenant");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      await submit({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || undefined,
        role,
        message: message.trim(),
      });
      setStatus({ kind: "success" });
      setName("");
      setEmail("");
      setSubject("");
      setRole("tenant");
      setMessage("");
    } catch (err) {
      const m = err instanceof Error ? err.message : t.error.fallback;
      setStatus({ kind: "error", message: m });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <form onSubmit={onSubmit} className="lg:col-span-3 relative overflow-hidden rounded-3xl border bg-white p-6 sm:p-8 shadow-xl ring-1 ring-emerald-100">
      <span className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
      <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.title}</h2>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        {status.kind === "success" && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold">{t.success.title}</p>
              <p className="text-emerald-800/80">{t.success.body}</p>
            </div>
          </div>
        )}
        {status.kind === "error" && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-rose-600" />
            <div>
              <p className="font-semibold">{t.error.title}</p>
              <p className="text-rose-800/80">{status.message}</p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium">{t.name}</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                disabled={submitting}
                className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">{t.email}</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                disabled={submitting}
                className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="text-sm font-medium">{t.subject}</label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              type="text"
              disabled={submitting}
              className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-sm font-medium">{t.roleLabel}</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="role" value="tenant" checked={role === "tenant"} onChange={() => setRole("tenant")} disabled={submitting} className="peer sr-only" />
                <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-center text-sm font-medium text-foreground/70 hover:border-emerald-300 peer-checked:bg-gradient-to-br peer-checked:from-emerald-500 peer-checked:to-teal-500 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-md transition">
                  {t.roles.tenant}
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="role" value="landlord" checked={role === "landlord"} onChange={() => setRole("landlord")} disabled={submitting} className="peer sr-only" />
                <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-center text-sm font-medium text-foreground/70 hover:border-amber-300 peer-checked:bg-gradient-to-br peer-checked:from-amber-500 peer-checked:to-orange-500 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-md transition">
                  {t.roles.landlord}
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="role" value="partner" checked={role === "partner"} onChange={() => setRole("partner")} disabled={submitting} className="peer sr-only" />
                <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-center text-sm font-medium text-foreground/70 hover:border-sky-300 peer-checked:bg-gradient-to-br peer-checked:from-sky-500 peer-checked:to-indigo-500 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-md transition">
                  {t.roles.partner}
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="role" value="other" checked={role === "other"} onChange={() => setRole("other")} disabled={submitting} className="peer sr-only" />
                <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-center text-sm font-medium text-foreground/70 hover:border-rose-300 peer-checked:bg-gradient-to-br peer-checked:from-rose-500 peer-checked:to-pink-500 peer-checked:text-white peer-checked:border-transparent peer-checked:shadow-md transition">
                  {t.roles.other}
                </div>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="message" className="text-sm font-medium">{t.message}</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              disabled={submitting}
              className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition resize-none disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t.submit}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
