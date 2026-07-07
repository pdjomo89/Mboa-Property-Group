"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SiteHeaderClient({ t, toggle }: { t: Dictionary; toggle: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/services", label: t.nav.services },
    { href: "/rentals", label: t.nav.rentals },
    { href: "/land", label: t.nav.land },
    { href: "/about", label: t.nav.about },
    { href: "/news", label: t.nav.news },
    { href: "/partners", label: t.nav.partners },
    { href: "/careers", label: t.nav.careers },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white text-xs">
        <div className="container mx-auto flex h-8 items-center justify-between px-4">
          <p className="hidden sm:block opacity-90">{t.nav.announcement}</p>
          <div className="flex items-center gap-4 opacity-90">
            <a href="tel:+237600000000" className="hover:opacity-100 transition">
              +237 6 00 00 00 00
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="mailto:hello@mboapropertygroup.com" className="hidden sm:inline hover:opacity-100 transition">
              hello@mboapropertygroup.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-1 shadow-md ring-2 ring-emerald-100 transition group-hover:ring-emerald-200">
              <Image
                src="/logo.png"
                alt="Mboa Property Group"
                width={40}
                height={40}
                className="object-contain rounded-lg bg-white"
              />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-lg bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                Mboa Property Group
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-700/70">
                Cameroon
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-foreground/70 hover:text-emerald-700 hover:bg-emerald-50/60"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {toggle}
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors px-3 py-2"
            >
              {t.common.signIn}
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-green-500 transition-all"
            >
              {t.common.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
