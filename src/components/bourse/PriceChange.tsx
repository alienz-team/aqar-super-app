"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { priceChange } from "@/lib/use-live-prices";
import type { MaterialQuote } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

export function PriceChange({ quote, className }: { quote: MaterialQuote; className?: string }) {
  const { lang } = useLanguage();
  const { pct } = priceChange(quote);
  const rounded = Math.round(pct * 100) / 100;
  const Icon = rounded > 0 ? TrendingUp : rounded < 0 ? TrendingDown : Minus;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";

  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-1 font-medium",
        rounded > 0 ? "text-up" : rounded < 0 ? "text-down" : "text-muted",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
      <span dir="ltr">
        {sign}
        {formatNumber(Math.abs(rounded), lang, 2)}%
      </span>
    </span>
  );
}
