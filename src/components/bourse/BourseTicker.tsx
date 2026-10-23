"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useLivePrices } from "@/lib/use-live-prices";
import type { MaterialQuote } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PriceChange } from "./PriceChange";

function TickerItems({ prices }: { prices: MaterialQuote[] }) {
  const { lang } = useLanguage();
  return (
    <>
      {prices.map((p) => (
        <li key={p.materialType} className="flex shrink-0 items-baseline gap-2.5 px-6">
          <span className="text-sm text-muted">{lang === "ar" ? p.nameAr : p.nameEn}</span>
          <span className="tabular font-semibold">{formatPrice(p.unitPrice, lang, p.unitPrice < 100 ? 2 : 0)}</span>
          <PriceChange quote={p} className="text-sm" />
        </li>
      ))}
    </>
  );
}

/** Board-style marquee of live bourse prices. Pauses on hover; static under reduced motion. */
export function BourseTicker() {
  const { t } = useLanguage();
  const prices = useLivePrices();

  return (
    <section aria-label={t.ticker.label} className="ticker flex items-stretch border-y border-line bg-surface">
      <p className="z-10 flex shrink-0 items-center gap-2 border-e border-line bg-surface px-4 text-sm font-semibold text-gold-text">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-gold opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-gold" />
        </span>
        {t.bourse.live}
      </p>
      <div className="min-w-0 flex-1 overflow-hidden py-3">
        <div className="ticker-track flex w-max">
          <ul className="flex">
            <TickerItems prices={prices} />
          </ul>
          {/* Second copy makes the loop seamless; hidden from assistive tech. */}
          <ul className="flex" aria-hidden>
            <TickerItems prices={prices} />
          </ul>
        </div>
      </div>
    </section>
  );
}
