"use client";

import { useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LocaleToggle({ current }: { current: Locale }) {
  const [isPending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === current || isPending) return;
    startTransition(() => {
      void setLocale(next);
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 p-0.5 text-xs font-semibold shadow-sm backdrop-blur"
    >
      <button
        type="button"
        onClick={() => change("en")}
        aria-pressed={current === "en"}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full transition ${
          current === "en"
            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow"
            : "text-emerald-800 hover:text-emerald-900"
        } disabled:opacity-60`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => change("fr")}
        aria-pressed={current === "fr"}
        disabled={isPending}
        className={`px-2.5 py-1 rounded-full transition ${
          current === "fr"
            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow"
            : "text-emerald-800 hover:text-emerald-900"
        } disabled:opacity-60`}
      >
        FR
      </button>
    </div>
  );
}
