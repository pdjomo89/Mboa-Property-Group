import Link from "next/link";
import {
  ArrowRight,
  Home,
  Bed,
  Bath,
  Square,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  KeyRound,
  Building,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Rentals — Mboa Property Group",
  description: "Browse available rentals across Cameroon — apartments, houses, and studios in Douala, Yaoundé, and beyond.",
};

export default async function RentalsPage() {
  const { t, locale } = await getDict();
  const tt = t.rentals;

  const rentals = [
    { title: locale === "fr" ? "Appartement moderne 2 chambres" : "Modern 2-bedroom apartment", neighborhood: "Bonanjo", city: "Douala", price: 350_000, beds: 2, baths: 2, sqm: 85, tag: tt.tags.featured, gradient: "from-emerald-500 via-teal-500 to-sky-500", soft: "from-emerald-50 to-teal-50", chip: "bg-emerald-100 text-emerald-800" },
    { title: locale === "fr" ? "Maison familiale avec jardin" : "Family house with garden", neighborhood: "Bastos", city: "Yaoundé", price: 600_000, beds: 4, baths: 3, sqm: 180, tag: tt.tags.new, gradient: "from-amber-500 via-orange-500 to-rose-500", soft: "from-amber-50 to-orange-50", chip: "bg-amber-100 text-amber-800" },
    { title: locale === "fr" ? "Studio près de l'université" : "Studio near university", neighborhood: "Ngoa-Ekellé", city: "Yaoundé", price: 120_000, beds: 1, baths: 1, sqm: 32, tag: tt.tags.affordable, gradient: "from-sky-500 via-indigo-500 to-purple-500", soft: "from-sky-50 to-indigo-50", chip: "bg-sky-100 text-sky-800" },
    { title: locale === "fr" ? "3 chambres vue mer" : "Sea-view 3-bedroom", neighborhood: "Bonapriso", city: "Douala", price: 750_000, beds: 3, baths: 2, sqm: 140, tag: tt.tags.premium, gradient: "from-cyan-500 via-blue-500 to-indigo-500", soft: "from-cyan-50 to-blue-50", chip: "bg-cyan-100 text-cyan-800" },
    { title: locale === "fr" ? "Studio rénové 1 chambre" : "Renovated 1-bedroom flat", neighborhood: "Akwa", city: "Douala", price: 200_000, beds: 1, baths: 1, sqm: 55, tag: tt.tags.moveInReady, gradient: "from-rose-500 via-pink-500 to-fuchsia-500", soft: "from-rose-50 to-pink-50", chip: "bg-rose-100 text-rose-800" },
    { title: locale === "fr" ? "Maison de ville avec parking" : "Townhouse with parking", neighborhood: "Mvan", city: "Yaoundé", price: 480_000, beds: 3, baths: 2, sqm: 120, tag: tt.tags.familyFriendly, gradient: "from-violet-500 via-purple-500 to-pink-500", soft: "from-violet-50 to-purple-50", chip: "bg-violet-100 text-violet-800" },
  ];

  const formatXAF = (n: number) => `${n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} XAF`;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <KeyRound className="h-3.5 w-3.5 text-emerald-700" />
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

        <form className="mt-10 mx-auto max-w-4xl rounded-2xl border bg-white p-3 sm:p-4 shadow-lg ring-1 ring-emerald-100">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tt.search.keyword}
                className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition"
              />
            </label>
            <label className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition appearance-none">
                <option value="">{tt.search.allCities}</option>
                <option>Douala</option>
                <option>Yaoundé</option>
              </select>
            </label>
            <label className="relative">
              <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select className="w-full rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition appearance-none">
                <option value="">{tt.search.anyBeds}</option>
                <option>1+</option>
                <option>2+</option>
                <option>3+</option>
                <option>4+</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition"
            >
              <SlidersHorizontal className="h-4 w-4" /> {tt.search.cta}
            </button>
          </div>
        </form>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rentals.map((r) => (
            <article
              key={r.title}
              className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className={`relative h-48 bg-gradient-to-br ${r.gradient} overflow-hidden`}>
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="rounded-2xl bg-white/20 p-5 ring-1 ring-white/30 backdrop-blur">
                    <Home className="h-12 w-12 text-white" strokeWidth={1.75} />
                  </div>
                </div>
                <div className={`absolute top-4 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.chip} shadow-sm`}>
                  <Sparkles className="h-3 w-3" />
                  {r.tag}
                </div>
                <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-foreground shadow-sm backdrop-blur">
                  {formatXAF(r.price)}<span className="text-xs font-medium text-muted-foreground">{tt.perMonth}</span>
                </div>
              </div>

              <div className={`p-6 flex flex-col flex-1 bg-gradient-to-br ${r.soft} group-hover:to-white transition-colors`}>
                <h3 className="text-lg font-semibold leading-snug">{r.title}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {r.neighborhood}, {r.city}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-foreground/80">
                  <span className="inline-flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-emerald-600" /> {r.beds} <span className="text-muted-foreground">{tt.bd}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-sky-600" /> {r.baths} <span className="text-muted-foreground">{tt.ba}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Square className="h-4 w-4 text-amber-600" /> {r.sqm} <span className="text-muted-foreground">m²</span>
                  </span>
                </div>
                <Link
                  href={`/contact?subject=${encodeURIComponent(`${tt.inquire}: ${r.title}`)}`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg transition"
                >
                  {tt.inquire} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
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
                href="/contact?subject=List%20my%20property"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition"
              >
                {tt.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/services"
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
