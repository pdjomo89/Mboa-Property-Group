import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  GraduationCap,
  Rocket,
  Coffee,
  UserPlus,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Careers — Mboa Property Group",
  description: "Join Mboa Property Group and help shape the future of property management in Cameroon.",
};

export default async function CareersPage() {
  const { t } = await getDict();
  const tt = t.careers;

  const positions = [
    { title: tt.positions.manager.title, body: tt.positions.manager.body, location: "Douala", type: tt.types.fullTime, department: tt.departments.operations, gradient: "from-emerald-500 to-teal-500", chip: "bg-emerald-100 text-emerald-800" },
    { title: tt.positions.success.title, body: tt.positions.success.body, location: "Yaoundé", type: tt.types.fullTime, department: tt.departments.support, gradient: "from-amber-500 to-orange-500", chip: "bg-amber-100 text-amber-800" },
    { title: tt.positions.technician.title, body: tt.positions.technician.body, location: "Douala / Yaoundé", type: tt.types.contract, department: tt.departments.maintenance, gradient: "from-sky-500 to-indigo-500", chip: "bg-sky-100 text-sky-800" },
    { title: tt.positions.engineer.title, body: tt.positions.engineer.body, location: tt.types.remote, type: tt.types.fullTime, department: tt.departments.engineering, gradient: "from-violet-500 to-purple-500", chip: "bg-violet-100 text-violet-800" },
  ];

  const values = [
    { icon: Heart, ...tt.values.tenants, gradient: "from-rose-500 to-pink-500" },
    { icon: Sparkles, ...tt.values.clarity, gradient: "from-amber-500 to-orange-500" },
    { icon: Rocket, ...tt.values.speed, gradient: "from-sky-500 to-indigo-500" },
    { icon: GraduationCap, ...tt.values.learning, gradient: "from-emerald-500 to-teal-500" },
  ];

  const perks = [
    { icon: Coffee, ...tt.perks.health },
    { icon: GraduationCap, ...tt.perks.learning },
    { icon: Sparkles, ...tt.perks.equity },
    { icon: Clock, ...tt.perks.flex },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Briefcase className="h-3.5 w-3.5 text-emerald-700" />
            {tt.pill}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {tt.headlineLeadA}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              {tt.headlineAccent}
            </span>{" "}
            {tt.headlineLeadB}
          </h1>
          <p className="mt-4 text-muted-foreground">{tt.lead}</p>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight">{tt.valuesHeadline}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body, gradient }) => (
              <div key={title} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              <UserPlus className="h-3.5 w-3.5" />
              {tt.positionsPill}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{tt.positionsHeadline}</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {positions.map(({ title, location, type, department, body, gradient, chip }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <span className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ${chip}`}>
                        {department}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" /> {type}
                      </span>
                    </div>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow`}>
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{body}</p>
                <Link
                  href={`/contact?subject=${encodeURIComponent(`${tt.apply}: ${title}`)}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:gap-2 transition-all"
                >
                  {tt.apply} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight">{tt.perksHeadline}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
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
            <div className="md:justify-self-end">
              <Link
                href="/contact?subject=General%20application"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition"
              >
                {t.common.getInTouch} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
