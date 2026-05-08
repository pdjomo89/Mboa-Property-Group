import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  KeyRound,
  Receipt,
  Wrench,
  ShieldCheck,
  ClipboardList,
  FileSpreadsheet,
  Sparkles,
  ChartBar,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Services — Mboa Property Group",
  description: "Property services for landlords and tenants in Cameroon — placement, rent collection, maintenance, inspections, and more.",
};

export default async function ServicesPage() {
  const { t } = await getDict();
  const tt = t.services;

  const services = [
    { icon: KeyRound, title: tt.items.placement.title, body: tt.items.placement.body, gradient: "from-emerald-500 to-teal-500", soft: "from-emerald-50 to-teal-50", ring: "ring-emerald-100" },
    { icon: Receipt, title: tt.items.rent.title, body: tt.items.rent.body, gradient: "from-amber-500 to-orange-500", soft: "from-amber-50 to-orange-50", ring: "ring-amber-100" },
    { icon: Wrench, title: tt.items.maintenance.title, body: tt.items.maintenance.body, gradient: "from-sky-500 to-indigo-500", soft: "from-sky-50 to-indigo-50", ring: "ring-sky-100", image: "/picjumbo_com-tools-864983.jpg" },
    { icon: ClipboardList, title: tt.items.mediation.title, body: tt.items.mediation.body, gradient: "from-rose-500 to-pink-500", soft: "from-rose-50 to-pink-50", ring: "ring-rose-100", image: "/nzchrissy2-connections-990699.jpg" },
    { icon: ShieldCheck, title: tt.items.inspections.title, body: tt.items.inspections.body, gradient: "from-violet-500 to-purple-500", soft: "from-violet-50 to-purple-50", ring: "ring-violet-100", image: "/sergey2025-worker-9824293.jpg" },
    { icon: FileSpreadsheet, title: tt.items.reporting.title, body: tt.items.reporting.body, gradient: "from-cyan-500 to-blue-500", soft: "from-cyan-50 to-blue-50", ring: "ring-cyan-100", image: "/pexels-analysis-1841158.jpg" },
  ];

  const steps = [
    { n: "01", ...tt.steps.a },
    { n: "02", ...tt.steps.b },
    { n: "03", ...tt.steps.c },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {tt.pill}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {tt.headlineLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              {tt.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground">{tt.lead}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, body, gradient, soft, ring, image }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ${ring} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
            >
              <span className={`absolute top-0 left-0 z-10 h-1 w-full bg-gradient-to-r ${gradient}`} />
              {image && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative flex-1 p-6">
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${soft} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              <ChartBar className="h-3.5 w-3.5" />
              {tt.stepsPill}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{tt.stepsHeadline}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-5xl font-bold bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent">{n}</p>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 sm:p-12 text-white shadow-xl shadow-emerald-500/20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{tt.ctaHeadline}</h2>
              <p className="mt-3 text-emerald-50/90 max-w-md">{tt.ctaLead}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition"
              >
                {tt.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/rentals"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition"
              >
                {tt.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
