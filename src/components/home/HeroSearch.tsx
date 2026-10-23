"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles } from "@/components/ui/primitives";
import { cities } from "@/lib/mock-data";
import { CATEGORIES, toQueryString, type PropertyFilters } from "@/lib/property-filters";
import type { PropertyCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "sale" | "rent" | "daily";

const dailyCategories: PropertyCategory[] = ["ISTIRAHA", "CHALET", "EVENT_HALL"];

const fieldStyles = "block px-5 py-3.5 transition-colors focus-within:bg-surface";
const selectStyles = "mt-0.5 w-full cursor-pointer bg-transparent text-base font-semibold text-ink";

/** Search bar in one ruled strip: mode tabs on top, fields divided by hairlines. */
export function HeroSearch() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sale");
  const [city, setCity] = useState<string>("ALL");
  const [category, setCategory] = useState<PropertyCategory | "ALL">("ALL");

  const categoryOptions = mode === "daily" ? dailyCategories : CATEGORIES.filter((c) => !dailyCategories.includes(c));
  const modes: { value: Mode; label: string }[] = [
    { value: "sale", label: t.hero.tabs.sale },
    { value: "rent", label: t.hero.tabs.rent },
    { value: "daily", label: t.hero.tabs.daily },
  ];

  function changeMode(next: Mode) {
    setMode(next);
    setCategory(next === "daily" ? "ISTIRAHA" : "ALL");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filters: PropertyFilters = {
      type: mode === "sale" ? "SALE" : "RENT",
      cycle: mode === "daily" ? "DAILY" : "ALL",
      category,
      city,
    };
    router.push(`/properties${toQueryString(filters)}`);
  }

  return (
    <form onSubmit={handleSubmit} aria-label={t.hero.searchLabel}>
      <div role="radiogroup" aria-label={t.hero.searchLabel} className="flex">
        {modes.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => changeMode(m.value)}
              className={cn(
                "whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors first:rounded-ss-sm last:rounded-se-sm sm:px-6",
                active ? "bg-bg text-ink" : "bg-black/40 text-white/75 backdrop-blur-md hover:text-white",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="grid overflow-hidden rounded-b-sm rounded-se-sm bg-bg shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:grid-cols-[1fr_1fr_auto]">
        <label className={fieldStyles}>
          <span className="block text-xs font-medium text-muted">{t.hero.city}</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={selectStyles}>
            <option value="ALL">{t.hero.anyCity}</option>
            {cities.map((c) => (
              <option key={c.en} value={c.en}>
                {c[lang]}
              </option>
            ))}
          </select>
        </label>
        <label className={cn(fieldStyles, "border-t border-line sm:border-s sm:border-t-0")}>
          <span className="block text-xs font-medium text-muted">{t.hero.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PropertyCategory | "ALL")}
            className={selectStyles}
          >
            {mode !== "daily" && <option value="ALL">{t.hero.anyCategory}</option>}
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {t.categories[c]}
              </option>
            ))}
          </select>
        </label>
        <div className="border-t border-line p-2 sm:border-t-0">
          <button type="submit" className={cn(buttonStyles.primary, "h-full w-full px-8 py-3.5")}>
            <Search className="size-4" aria-hidden />
            {t.hero.search}
          </button>
        </div>
      </div>
    </form>
  );
}
