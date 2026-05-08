import { Target, Users } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "About — Mboa Property Group",
  description:
    "Learn about Mboa Property Group, a Cameroonian property management platform connecting tenants, landlords, and managers.",
};

export default async function AboutPage() {
  const { t } = await getDict();
  const tt = t.about;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {tt.pill}
        </span>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">{tt.headline}</h1>
        <p className="mt-6 text-base text-muted-foreground">{tt.lead}</p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div className="group relative overflow-hidden rounded-3xl border bg-white p-8 sm:p-10 shadow-sm ring-1 ring-emerald-100 hover:shadow-xl transition-all">
          <span className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="relative mt-6 text-2xl sm:text-3xl font-bold tracking-tight">{tt.mission.title}</h2>
          <p className="relative mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">{tt.mission.body}</p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border bg-white p-8 sm:p-10 shadow-sm ring-1 ring-amber-100 hover:shadow-xl transition-all">
          <span className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-100/60 blur-3xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="relative mt-6 text-2xl sm:text-3xl font-bold tracking-tight">{tt.community.title}</h2>
          <p className="relative mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">{tt.community.body}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: "500+", label: tt.stats.properties, gradient: "from-emerald-500 to-green-500" },
          { value: "2,000+", label: tt.stats.tenants, gradient: "from-teal-500 to-emerald-500" },
          { value: "98%", label: tt.stats.resolved, gradient: "from-amber-500 to-orange-500" },
          { value: "24/7", label: tt.stats.support, gradient: "from-sky-500 to-indigo-500" },
        ].map(({ value, label, gradient }) => (
          <div key={label} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
