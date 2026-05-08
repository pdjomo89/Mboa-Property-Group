import {
  ArrowRight,
  Newspaper,
  Building2,
  Handshake,
  Calendar,
  Sparkles,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { getDict } from "@/lib/i18n/server";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

export const metadata = {
  title: "News — Mboa Property Group",
  description: "Latest updates, announcements, and stories from Mboa Property Group.",
};

export default async function NewsPage() {
  const { t, locale } = await getDict();
  const tt = t.news;

  const articles = [
    {
      icon: Newspaper,
      category: tt.categories.product,
      date: "Apr 2026",
      badgeIcon: Sparkles,
      title: tt.articles.a.title,
      body: tt.articles.a.body,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      softBg: "from-emerald-50 to-teal-50",
      accent: "text-emerald-700",
      chip: "bg-emerald-100 text-emerald-800",
    },
    {
      icon: Building2,
      category: tt.categories.expansion,
      date: "Mar 2026",
      badgeIcon: TrendingUp,
      title: tt.articles.b.title,
      body: tt.articles.b.body,
      gradient: "from-sky-500 via-indigo-500 to-purple-500",
      softBg: "from-sky-50 to-indigo-50",
      accent: "text-indigo-700",
      chip: "bg-indigo-100 text-indigo-800",
      image: "/antonin77-apartment-743378.jpg",
    },
    {
      icon: Handshake,
      category: tt.categories.partnership,
      date: "Feb 2026",
      badgeIcon: Megaphone,
      title: tt.articles.c.title,
      body: tt.articles.c.body,
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      softBg: "from-amber-50 to-orange-50",
      accent: "text-orange-700",
      chip: "bg-orange-100 text-orange-800",
      image: "/geralt-hands-3331216.jpg",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {tt.pill}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            {tt.headlineLead}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              {tt.headlineAccent}
            </span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{tt.lead}</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {articles.map(({ icon: Icon, category, date, badgeIcon: BadgeIcon, title, body, gradient, softBg, accent, chip, image }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <span className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${gradient}`} />

              <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <>
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="rounded-2xl bg-white/20 p-5 ring-1 ring-white/30 backdrop-blur">
                        <Icon className="h-12 w-12 text-white" strokeWidth={1.75} />
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
                  <BadgeIcon className="h-3 w-3 text-amber-500" />
                  {tt.featured}
                </div>
              </div>

              <div className={`p-6 flex flex-col flex-1 bg-gradient-to-br ${softBg} group-hover:to-white transition-colors`}>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 ${chip}`}>
                    {category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {date}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1 leading-relaxed">{body}</p>
                <a
                  href="#"
                  className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${accent} hover:gap-2 transition-all`}
                >
                  {t.common.readMore} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 sm:p-10 text-white shadow-xl shadow-emerald-500/20 overflow-hidden relative">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-lime-400/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <Megaphone className="h-3.5 w-3.5" />
                {tt.newsletterPill}
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold">{tt.newsletterHeadline}</h2>
              <p className="mt-2 text-emerald-50/90 max-w-md">{tt.newsletterLead}</p>
            </div>
            <NewsletterForm t={tt} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
