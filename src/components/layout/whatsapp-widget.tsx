"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const WHATSAPP_NUMBER = "18186472187";

export function WhatsAppWidget({ t }: { t: Dictionary["whatsapp"] }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(message.trim() || t.defaultMessage);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-emerald-100 bg-white shadow-2xl shadow-emerald-500/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-4 text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur">
                <WhatsAppIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-tight">{t.brand}</p>
                <p className="text-xs text-emerald-100/90 flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-lime-300 animate-pulse" />
                  {t.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.closeLabel}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="rounded-2xl rounded-tl-sm bg-white border border-emerald-100 px-4 py-3 text-sm text-foreground/80 shadow-sm max-w-[85%]">
              {t.greeting}
            </div>
          </div>

          <form onSubmit={send} className="border-t border-emerald-100 p-3 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.placeholder}
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-emerald-100 bg-emerald-50/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition max-h-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(e as unknown as React.FormEvent);
                  }
                }}
              />
              <button
                type="submit"
                aria-label="Send via WhatsApp"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-green-500 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              {t.footnote}
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.closeLabel : t.openLabel}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 hover:shadow-emerald-500/60 transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-50 blur-xl -z-10 group-hover:opacity-75 transition-opacity" />
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-lime-400 ring-2 ring-white" />
          </span>
        )}
        {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004A9.87 9.87 0 0 1 7.1 20.45l-.355-.21-3.674.964.982-3.583-.231-.367a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.892 6.994c-.003 5.45-4.437 9.882-9.879 9.882m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
