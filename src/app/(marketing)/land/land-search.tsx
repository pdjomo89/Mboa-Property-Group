"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building, MapPin, Search, Square, Wallet } from "lucide-react";

export type LandCity = {
  key: string;
  name: string;
  region: string;
  gradient: string;
  soft: string;
  chip: string;
};

export type LandPlot = {
  id: string;
  cityKey: string;
  neighborhood: string;
  sqm: number;
  priceXaf: number;
};

export type PriceRange = {
  key: string;
  label: string;
  min: number;
  max: number;
};

export type SizeRange = {
  key: string;
  label: string;
  min: number;
  max: number;
};

type Strings = {
  pill: string;
  headlineLead: string;
  headlineAccent: string;
  cityLabel: string;
  allCities: string;
  priceLabel: string;
  anyPrice: string;
  sizeLabel: string;
  anySize: string;
  cta: string;
  resultsCount: string;
  noResults: string;
  inquire: string;
  plotArea: string;
};

export function LandSearch({
  cities,
  plots,
  priceRanges,
  sizeRanges,
  locale,
  t,
}: {
  cities: LandCity[];
  plots: LandPlot[];
  priceRanges: PriceRange[];
  sizeRanges: SizeRange[];
  locale: string;
  t: Strings;
}) {
  const [cityKey, setCityKey] = useState<string>("");
  const [priceKey, setPriceKey] = useState<string>("");
  const [sizeKey, setSizeKey] = useState<string>("");

  const priceByKey = useMemo(() => {
    const map = new Map<string, PriceRange>();
    for (const r of priceRanges) map.set(r.key, r);
    return map;
  }, [priceRanges]);

  const sizeByKey = useMemo(() => {
    const map = new Map<string, SizeRange>();
    for (const r of sizeRanges) map.set(r.key, r);
    return map;
  }, [sizeRanges]);

  const filtered = useMemo(() => {
    const priceRange = priceKey ? priceByKey.get(priceKey) : undefined;
    const sizeRange = sizeKey ? sizeByKey.get(sizeKey) : undefined;
    return plots.filter((p) => {
      if (cityKey && p.cityKey !== cityKey) return false;
      if (priceRange && (p.priceXaf < priceRange.min || p.priceXaf > priceRange.max)) return false;
      if (sizeRange && (p.sqm < sizeRange.min || p.sqm > sizeRange.max)) return false;
      return true;
    });
  }, [cityKey, priceKey, sizeKey, plots, priceByKey, sizeByKey]);

  const cityByKey = useMemo(() => {
    const map = new Map<string, LandCity>();
    for (const c of cities) map.set(c.key, c);
    return map;
  }, [cities]);

  const formatXAF = (n: number) =>
    `${n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} XAF`;

  return (
    <div>
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Search className="h-3 w-3" />
          {t.pill}
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
          {t.headlineLead}{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {t.headlineAccent}
          </span>
        </h2>
      </div>

      <form
        className="mt-8 mx-auto max-w-4xl rounded-2xl border bg-white p-3 sm:p-4 shadow-lg ring-1 ring-emerald-100"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">{t.cityLabel}</span>
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={cityKey}
              onChange={(e) => setCityKey(e.target.value)}
              className="w-full appearance-none rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition"
            >
              <option value="">{t.allCities}</option>
              {cities.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name} — {c.region}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">{t.priceLabel}</span>
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={priceKey}
              onChange={(e) => setPriceKey(e.target.value)}
              className="w-full appearance-none rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition"
            >
              <option value="">{t.anyPrice}</option>
              {priceRanges.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <span className="sr-only">{t.sizeLabel}</span>
            <Square className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={sizeKey}
              onChange={(e) => setSizeKey(e.target.value)}
              className="w-full appearance-none rounded-xl border border-emerald-100 bg-emerald-50/30 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:bg-white focus:border-emerald-300 transition"
            >
              <option value="">{t.anySize}</option>
              {sizeRanges.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition"
          >
            <Search className="h-4 w-4" /> {t.cta}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {filtered.length} {t.resultsCount}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 mx-auto max-w-lg rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center text-sm text-emerald-800">
          {t.noResults}
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const city = cityByKey.get(p.cityKey);
            if (!city) return null;
            return (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <span
                  className={`absolute top-0 left-0 z-10 h-1 w-full bg-gradient-to-r ${city.gradient}`}
                />
                <div
                  className={`relative h-40 bg-gradient-to-br ${city.gradient} overflow-hidden`}
                >
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                  <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex h-full items-center justify-center">
                    <div className="rounded-2xl bg-white/20 p-5 ring-1 ring-white/30 backdrop-blur">
                      <MapPin
                        className="h-10 w-10 text-white"
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>
                  <div
                    className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${city.chip} shadow-sm`}
                  >
                    {city.region}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-foreground shadow-sm backdrop-blur">
                    {formatXAF(p.priceXaf)}
                  </div>
                </div>

                <div
                  className={`p-6 flex flex-col flex-1 bg-gradient-to-br ${city.soft} group-hover:to-white transition-colors`}
                >
                  <h3 className="text-lg font-semibold leading-snug">
                    {p.neighborhood}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {city.name}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-foreground/80">
                    <span className="inline-flex items-center gap-1.5">
                      <Square className="h-4 w-4 text-amber-600" />
                      {p.sqm.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")}{" "}
                      <span className="text-muted-foreground">
                        {t.plotArea}
                      </span>
                    </span>
                  </div>
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`${t.inquire} — ${city.name}, ${p.neighborhood}`)}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-lg transition"
                  >
                    {t.inquire} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
