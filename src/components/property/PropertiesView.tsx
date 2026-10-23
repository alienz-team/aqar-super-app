"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { TextReveal } from "@/components/ui/motion";
import { buttonStyles, Field, inputStyles, Segmented } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import { cities, properties } from "@/lib/mock-data";
import {
  applyFilters,
  CATEGORIES,
  defaultFilters,
  RENT_CYCLES,
  toQueryString,
  type PropertyFilters,
} from "@/lib/property-filters";
import { cn, formatNumber } from "@/lib/utils";
import { PropertyGrid } from "./PropertyGrid";

export function PropertiesView({ initialFilters }: { initialFilters: PropertyFilters }) {
  const { t, lang } = useLanguage();
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const results = useMemo(() => applyFilters(properties, filters), [filters]);

  // Keep the URL shareable without triggering a server round trip.
  useEffect(() => {
    window.history.replaceState(null, "", `/properties${toQueryString(filters)}`);
  }, [filters]);

  const update = (patch: Partial<PropertyFilters>) => setFilters((f) => ({ ...f, ...patch }));

  function changeType(type: PropertyFilters["type"]) {
    // A rent period only applies to rentals.
    update(type === "SALE" ? { type, cycle: "ALL" } : { type });
  }

  const isFiltered = toQueryString(filters) !== "";

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-20">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
        <TextReveal
          key={lang}
          as="h1"
          immediate
          text={t.propertiesPage.title}
          className="text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-7xl rtl:leading-tight rtl:tracking-normal"
        />
        <p className="text-muted lg:pb-2">{t.propertiesPage.subtitle}</p>
      </header>

      {/* Filters as one ruled strip: hairlines above and below, groups separated by space, not boxes. */}
      <section
        aria-label={t.propertiesPage.filters}
        className="mt-10 grid gap-x-8 gap-y-5 border-y border-line py-6 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-end"
      >
        <div className="flex flex-wrap gap-x-8 gap-y-4 lg:contents">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-muted">{t.propertiesPage.listingType}</span>
            <Segmented
              label={t.propertiesPage.listingType}
              value={filters.type}
              onChange={changeType}
              options={(["ALL", "SALE", "RENT"] as const).map((v) => ({ value: v, label: t.listingTypes[v] }))}
            />
          </div>
          {filters.type !== "SALE" && (
            <div>
              <span className="mb-1.5 block text-sm font-medium text-muted">{t.propertiesPage.rentCycle}</span>
              <Segmented
                label={t.propertiesPage.rentCycle}
                value={filters.cycle}
                onChange={(cycle) => update(cycle === "ALL" ? { cycle } : { cycle, type: "RENT" })}
                options={(["ALL", ...RENT_CYCLES] as const).map((v) => ({ value: v, label: t.rentCycles[v] }))}
              />
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-start-3">
          <Field label={t.propertiesPage.category}>
            <select
              value={filters.category}
              onChange={(e) => update({ category: e.target.value as PropertyFilters["category"] })}
              className={inputStyles}
            >
              <option value="ALL">{t.hero.anyCategory}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t.categories[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.propertiesPage.city}>
            <select value={filters.city} onChange={(e) => update({ city: e.target.value })} className={inputStyles}>
              <option value="ALL">{t.hero.anyCity}</option>
              {cities.map((c) => (
                <option key={c.en} value={c.en}>
                  {c[lang]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <div className="mb-8 mt-6 flex min-h-10 items-center justify-between gap-4">
        <p className="tabular text-sm text-muted" aria-live="polite">
          {interpolate(t.propertiesPage.results, { count: formatNumber(results.length, lang) })}
        </p>
        {isFiltered && (
          <button type="button" onClick={() => setFilters(defaultFilters)} className={buttonStyles.ghost}>
            {t.propertiesPage.clear}
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <PropertyGrid items={results} />
      ) : (
        <div className="rounded-sm border border-dashed border-line px-6 py-20 text-center">
          <SearchX className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden />
          <p className="mt-4 font-semibold">{t.propertiesPage.emptyTitle}</p>
          <p className="mt-1.5 text-sm text-muted">{t.propertiesPage.emptyBody}</p>
          <button type="button" onClick={() => setFilters(defaultFilters)} className={cn(buttonStyles.primary, "mt-6")}>
            {t.propertiesPage.clear}
          </button>
        </div>
      )}
    </div>
  );
}
