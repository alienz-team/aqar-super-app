"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Crossfade } from "@/components/ui/Crossfade";
import { buttonStyles } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import { serviceSectors } from "@/lib/mock-data";
import type { ServiceSector, ServiceSectorId } from "@/lib/types";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { sectorIcons } from "./sector-icons";
import { ServiceRequestModal } from "./ServiceRequestModal";

// Matches the grid columns: 1 / 2 / 3 across.
const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

interface ServicesGridProps {
  /** compact: overview cells linking to /services; full: detailed cells with the request modal. */
  variant: "compact" | "full";
  initialSector?: ServiceSectorId;
}

/** Sectors laid out as one ruled sheet (cells share hairlines) rather than floating cards. */
export function ServicesGrid({ variant, initialSector }: ServicesGridProps) {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<ServiceSector | null>(null);

  // Deep link (?sector=...) opens the form after mount, keeping server HTML free of date defaults.
  useEffect(() => {
    const match = serviceSectors.find((s) => s.id === initialSector);
    if (match) setSelected(match);
  }, [initialSector]);

  return (
    <>
      <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {serviceSectors.map((sector, index) => {
          const Icon = sectorIcons[sector.id];
          const copy = t.services.sectors[sector.id];
          return (
            <li key={sector.id} className="flex flex-col bg-bg">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-gold-line bg-surface-2">
                <Crossfade images={sector.images} alt={copy.name} sizes={SIZES} offsetMs={index * 700} />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute bottom-3 start-3 flex size-10 items-center justify-center rounded-sm border border-gold/50 bg-black/60 backdrop-blur-sm">
                  <Icon className="size-5 text-gold" strokeWidth={1.75} aria-hidden />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold">{copy.name}</h3>
                <p className="mt-1.5 text-sm text-muted">{copy.desc}</p>

                {variant === "full" && (
                  <>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {sector.categories.map((c) => (
                        <li key={c} className="rounded-xs border border-line px-2 py-0.5 text-xs text-muted">
                          {t.services.categories[c]}
                        </li>
                      ))}
                    </ul>
                    <p className="tabular mt-4 text-sm text-muted">
                      {interpolate(t.services.providers, { count: formatNumber(sector.providers, lang) })}
                    </p>
                  </>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                  <p className="tabular text-sm font-semibold text-gold-text">
                    {interpolate(t.services.from, { price: formatPrice(sector.startingPrice, lang) })}
                  </p>
                  {variant === "full" ? (
                    <button
                      type="button"
                      onClick={() => setSelected(sector)}
                      className={cn(sector.mode === "technician" ? buttonStyles.primary : buttonStyles.secondary, "px-3 py-2")}
                    >
                      {sector.mode === "technician" ? t.services.bookTechnician : t.services.requestQuote}
                    </button>
                  ) : (
                    <Link href={`/services?sector=${sector.id}`} className={cn(buttonStyles.ghost, "text-gold-text")}>
                      {sector.mode === "technician" ? t.services.bookTechnician : t.services.requestQuote}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {variant === "full" && <ServiceRequestModal sector={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
