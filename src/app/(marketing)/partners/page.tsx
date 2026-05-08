import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  HardHat,
  Cpu,
  UtensilsCrossed,
  ShoppingBag,
  Ticket,
  Code2,
  Sparkles,
  Globe,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Partners — Mboa Property Group",
  description: "Trusted landlords, agencies, and service providers across Cameroon.",
};

export default async function PartnersPage() {
  const { t } = await getDict();
  const tt = t.partners;

  const partners = [
    { name: "Survey Engineering Sarl", category: "Engineering", icon: HardHat, gradient: "from-orange-500 to-amber-500", soft: "from-orange-50 to-amber-50", ring: "ring-orange-200" },
    { name: "AfriNovaTech Consulting", category: "IT Consulting", icon: Cpu, gradient: "from-violet-500 to-indigo-500", soft: "from-violet-50 to-indigo-50", ring: "ring-violet-200" },
    { name: "TaraFoods", category: "Food", icon: UtensilsCrossed, gradient: "from-emerald-500 to-green-500", soft: "from-emerald-50 to-green-50", ring: "ring-emerald-200" },
    { name: "Shop by JLC", category: "Retail", icon: ShoppingBag, gradient: "from-pink-500 to-rose-500", soft: "from-pink-50 to-rose-50", ring: "ring-pink-200" },
    { name: "TicketApp", category: "Ticketing", icon: Ticket, gradient: "from-sky-500 to-blue-500", soft: "from-sky-50 to-blue-50", ring: "ring-sky-200" },
    { name: "J'aime le Code", category: "Software", icon: Code2, gradient: "from-teal-500 to-cyan-500", soft: "from-teal-50 to-cyan-50", ring: "ring-teal-200" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Handshake className="h-3.5 w-3.5 text-emerald-600" />
            {tt.pill}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {tt.headlineLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              {tt.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{tt.lead}</p>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {partners.map(({ name, category, icon: Icon, gradient, soft, ring }) => (
            <div
              key={name}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm ring-1 ${ring} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <span className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${soft} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/5`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-bold">{name}</p>
                  <p className={`text-xs font-medium uppercase tracking-wider bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    {category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Globe, value: "8+", label: tt.stats.cities, gradient: "from-emerald-500 to-teal-500" },
            { icon: Handshake, value: "50+", label: tt.stats.providers, gradient: "from-amber-500 to-orange-500" },
            { icon: Sparkles, value: "100%", label: tt.stats.vetted, gradient: "from-sky-500 to-indigo-500" },
          ].map(({ icon: Icon, value, label, gradient }) => (
            <div
              key={label}
              className="rounded-2xl border bg-white p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 sm:p-12 text-white shadow-xl shadow-emerald-500/20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {tt.ctaPill}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold">{tt.ctaHeadline}</h2>
              <p className="mt-3 text-emerald-50/90 max-w-md">{tt.ctaLead}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition"
              >
                {t.common.getInTouch} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
              >
                {t.common.learnMore}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
