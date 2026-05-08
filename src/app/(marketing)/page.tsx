import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  MessageSquare,
  Wrench,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t } = await getDict();
  const tt = t.home;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl" />
          <div className="absolute top-20 -right-24 h-96 w-96 rounded-full bg-teal-300/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-300/30 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-20 pb-24 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-emerald-800 shadow-sm backdrop-blur hover:bg-white transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {tt.announcement}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
            <span className="block">{tt.headlineTop}</span>
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              {tt.headlineBottom}
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">{tt.lead}</p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3 text-base font-medium text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-green-500 transition-all"
            >
              {t.common.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-emerald-200 bg-white/80 px-8 py-3 text-base font-medium text-emerald-800 backdrop-blur hover:bg-white hover:border-emerald-300 transition-all"
            >
              {t.common.signIn}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {tt.trust.a}
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-500" /> {tt.trust.b}
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-lime-500" /> {tt.trust.c}
            </li>
          </ul>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Building2, label: tt.stats.properties, value: "500+", color: "from-emerald-500 to-green-500" },
              { icon: Users, label: tt.stats.tenants, value: "2,000+", color: "from-teal-500 to-emerald-500" },
              { icon: Wrench, label: tt.stats.resolved, value: "98%", color: "from-amber-500 to-orange-500" },
              { icon: Shield, label: tt.stats.support, value: "24/7", color: "from-sky-500 to-indigo-500" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 text-left shadow-sm backdrop-blur hover:shadow-md transition"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white shadow`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {tt.featuresPill}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
            {tt.featuresHeadlineLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {tt.featuresHeadlineAccent}
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground">{tt.featuresLead}</p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Wrench, ...tt.features.issue, gradient: "from-orange-500 to-amber-500", ring: "ring-orange-200/60", bg: "from-orange-50 to-amber-50", accent: "bg-orange-500", image: "/pexels-hands-1851218.jpg" as string | undefined },
            { icon: MessageSquare, ...tt.features.chat, gradient: "from-sky-500 to-indigo-500", ring: "ring-sky-200/60", bg: "from-sky-50 to-indigo-50", accent: "bg-sky-500", image: "/geralt-laptop-3964426.jpg" as string | undefined },
            { icon: Shield, ...tt.features.roles, gradient: "from-emerald-500 to-green-500", ring: "ring-emerald-200/60", bg: "from-emerald-50 to-green-50", accent: "bg-emerald-500", image: undefined as string | undefined },
          ].map(({ icon: Icon, title, body, gradient, ring, bg, accent, image }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ${ring} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
            >
              <span className={`absolute top-0 left-0 z-10 h-1 w-full bg-gradient-to-r ${gradient}`} />
              {image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative flex-1 p-6">
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/5`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accent}`} />
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                <div className="mt-5 inline-flex items-center text-sm font-medium text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.common.learnMore} <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
