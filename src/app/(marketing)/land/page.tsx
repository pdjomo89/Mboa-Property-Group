import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Home,
  Landmark,
  ShieldCheck,
  Compass,
  ScrollText,
} from "lucide-react";
import { getDict } from "@/lib/i18n/server";
import { LandSearch, type LandCity, type LandPlot, type PriceRange, type SizeRange } from "./land-search";

export const metadata = {
  title: "Buy Land — Mboa Property Group",
  description:
    "Vetted land plots with clean titles across every city in Cameroon — Douala, Yaoundé, Bafoussam, Bamenda, Kribi, Limbe, Buea, Garoua and more.",
};

type CityKey =
  | "douala"
  | "yaounde"
  | "bafoussam"
  | "bamenda"
  | "kribi"
  | "limbe"
  | "buea"
  | "garoua";

const cityStyles: Array<{
  key: CityKey;
  name: string;
  gradient: string;
  soft: string;
  chip: string;
}> = [
  { key: "douala", name: "Douala", gradient: "from-emerald-500 via-teal-500 to-sky-500", soft: "from-emerald-50 to-teal-50", chip: "bg-emerald-100 text-emerald-800" },
  { key: "yaounde", name: "Yaoundé", gradient: "from-amber-500 via-orange-500 to-rose-500", soft: "from-amber-50 to-orange-50", chip: "bg-amber-100 text-amber-800" },
  { key: "bafoussam", name: "Bafoussam", gradient: "from-lime-500 via-green-500 to-emerald-500", soft: "from-lime-50 to-green-50", chip: "bg-lime-100 text-lime-800" },
  { key: "bamenda", name: "Bamenda", gradient: "from-sky-500 via-indigo-500 to-purple-500", soft: "from-sky-50 to-indigo-50", chip: "bg-sky-100 text-sky-800" },
  { key: "kribi", name: "Kribi", gradient: "from-cyan-500 via-blue-500 to-indigo-500", soft: "from-cyan-50 to-blue-50", chip: "bg-cyan-100 text-cyan-800" },
  { key: "limbe", name: "Limbe", gradient: "from-teal-500 via-emerald-500 to-lime-500", soft: "from-teal-50 to-emerald-50", chip: "bg-teal-100 text-teal-800" },
  { key: "buea", name: "Buea", gradient: "from-violet-500 via-purple-500 to-pink-500", soft: "from-violet-50 to-purple-50", chip: "bg-violet-100 text-violet-800" },
  { key: "garoua", name: "Garoua", gradient: "from-rose-500 via-pink-500 to-fuchsia-500", soft: "from-rose-50 to-pink-50", chip: "bg-rose-100 text-rose-800" },
];

const samplePlots: LandPlot[] = [
  { id: "douala-bonanjo", cityKey: "douala", neighborhood: "Bonanjo", sqm: 500, priceXaf: 45_000_000 },
  { id: "douala-akwa", cityKey: "douala", neighborhood: "Akwa", sqm: 800, priceXaf: 60_000_000 },
  { id: "douala-bonapriso", cityKey: "douala", neighborhood: "Bonapriso", sqm: 650, priceXaf: 52_000_000 },
  { id: "yaounde-bastos", cityKey: "yaounde", neighborhood: "Bastos", sqm: 600, priceXaf: 40_000_000 },
  { id: "yaounde-odza", cityKey: "yaounde", neighborhood: "Odza", sqm: 1_000, priceXaf: 30_000_000 },
  { id: "yaounde-nkolbisson", cityKey: "yaounde", neighborhood: "Nkolbisson", sqm: 1_500, priceXaf: 22_000_000 },
  { id: "bafoussam-djeleng", cityKey: "bafoussam", neighborhood: "Djeleng", sqm: 1_500, priceXaf: 12_000_000 },
  { id: "bafoussam-tamdja", cityKey: "bafoussam", neighborhood: "Tamdja", sqm: 2_000, priceXaf: 15_000_000 },
  { id: "bamenda-nkwen", cityKey: "bamenda", neighborhood: "Nkwen", sqm: 1_200, priceXaf: 10_000_000 },
  { id: "bamenda-bambili", cityKey: "bamenda", neighborhood: "Bambili", sqm: 2_500, priceXaf: 14_000_000 },
  { id: "kribi-beachfront", cityKey: "kribi", neighborhood: "Beachfront zone", sqm: 400, priceXaf: 80_000_000 },
  { id: "kribi-mboamanga", cityKey: "kribi", neighborhood: "Mboa Manga", sqm: 1_000, priceXaf: 35_000_000 },
  { id: "limbe-mile4", cityKey: "limbe", neighborhood: "Mile 4", sqm: 800, priceXaf: 25_000_000 },
  { id: "limbe-bonadikombo", cityKey: "limbe", neighborhood: "Bonadikombo", sqm: 1_500, priceXaf: 20_000_000 },
  { id: "buea-molyko", cityKey: "buea", neighborhood: "Molyko", sqm: 700, priceXaf: 18_000_000 },
  { id: "buea-bonduma", cityKey: "buea", neighborhood: "Bonduma", sqm: 1_200, priceXaf: 15_000_000 },
  { id: "garoua-djamboutou", cityKey: "garoua", neighborhood: "Djamboutou", sqm: 3_000, priceXaf: 8_000_000 },
  { id: "garoua-bibemi", cityKey: "garoua", neighborhood: "Bibémi road", sqm: 5_000, priceXaf: 10_000_000 },
];

export default async function LandPage() {
  const { t, locale } = await getDict();
  const tt = t.land;

  const trustItems = [
    { icon: ShieldCheck, label: tt.trust.a },
    { icon: Compass, label: tt.trust.b },
    { icon: ScrollText, label: tt.trust.c },
  ];

  const cities: LandCity[] = cityStyles.map((s) => ({
    key: s.key,
    name: s.name,
    region: tt.cities[s.key].region,
    gradient: s.gradient,
    soft: s.soft,
    chip: s.chip,
  }));

  const priceRanges: PriceRange[] = [
    { key: "under15m", label: tt.search.priceRanges.under15m, min: 0, max: 14_999_999 },
    { key: "m15to30", label: tt.search.priceRanges.m15to30, min: 15_000_000, max: 30_000_000 },
    { key: "m30to50", label: tt.search.priceRanges.m30to50, min: 30_000_001, max: 50_000_000 },
    { key: "m50to80", label: tt.search.priceRanges.m50to80, min: 50_000_001, max: 80_000_000 },
    { key: "over80m", label: tt.search.priceRanges.over80m, min: 80_000_001, max: Number.MAX_SAFE_INTEGER },
  ];

  const sizeRanges: SizeRange[] = [
    { key: "under750", label: tt.search.sizeRanges.under750, min: 0, max: 749 },
    { key: "s750to1500", label: tt.search.sizeRanges.s750to1500, min: 750, max: 1_500 },
    { key: "s1500to3000", label: tt.search.sizeRanges.s1500to3000, min: 1_501, max: 3_000 },
    { key: "over3000", label: tt.search.sizeRanges.over3000, min: 3_001, max: Number.MAX_SAFE_INTEGER },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 px-4 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <Landmark className="h-3.5 w-3.5 text-emerald-700" />
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

        <div className="mt-10 mx-auto max-w-3xl grid gap-3 sm:grid-cols-3">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border bg-white/70 backdrop-blur px-4 py-3 shadow-sm ring-1 ring-emerald-100"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground/80">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/20 ring-1 ring-emerald-100">
            <Image
              src="/pexels-kelly-17290979.jpg"
              alt={tt.story.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/50 via-emerald-900/10 to-transparent" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-800 shadow backdrop-blur">
              <Landmark className="h-3.5 w-3.5" />
              {tt.story.imageCaption}
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Home className="h-3 w-3" />
              {tt.story.pill}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {tt.story.headline}
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {tt.story.body}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {tt.story.body2}
            </p>
            <Link
              href="/contact?subject=Land%20advisor"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition"
            >
              {tt.story.cta} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <LandSearch
            cities={cities}
            plots={samplePlots}
            priceRanges={priceRanges}
            sizeRanges={sizeRanges}
            locale={locale}
            t={{
              pill: tt.search.pill,
              headlineLead: tt.search.headlineLead,
              headlineAccent: tt.search.headlineAccent,
              cityLabel: tt.search.cityLabel,
              allCities: tt.search.allCities,
              priceLabel: tt.search.priceLabel,
              anyPrice: tt.search.anyPrice,
              sizeLabel: tt.search.sizeLabel,
              anySize: tt.search.anySize,
              cta: tt.search.cta,
              resultsCount: tt.search.resultsCount,
              noResults: tt.search.noResults,
              inquire: tt.inquire,
              plotArea: tt.plotArea,
            }}
          />
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
                href="/contact?subject=Land%20inquiry"
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
