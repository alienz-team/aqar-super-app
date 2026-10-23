"use client";

import { useEffect, useState } from "react";
import { materialPrices } from "./mock-data";
import type { MaterialQuote } from "./types";

const MAX_TICK = 0.006; // ±0.6% per tick
const MAX_DRIFT = 0.04; // stay within ±4% of the opening price

/**
 * Simulated live feed over the mock bourse. `previousPrice` stays the opening
 * price so "change" reads as change since open. Swap for a Supabase Realtime
 * subscription on `MaterialPrice` when the database is connected.
 */
export function useLivePrices(intervalMs = 5000) {
  const [prices, setPrices] = useState<MaterialQuote[]>(materialPrices);

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date().toISOString();
      setPrices((current) =>
        current.map((p) => {
          if (Math.random() < 0.5) return p;
          const open = p.previousPrice;
          const next = p.unitPrice * (1 + (Math.random() * 2 - 1) * MAX_TICK);
          const clamped = Math.min(open * (1 + MAX_DRIFT), Math.max(open * (1 - MAX_DRIFT), next));
          const step = open < 100 ? 0.05 : 1;
          return { ...p, unitPrice: Math.round(clamped / step) * step, updatedAt: now };
        }),
      );
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return prices;
}

export function priceChange(p: MaterialQuote) {
  const diff = p.unitPrice - p.previousPrice;
  return { diff, pct: p.previousPrice ? (diff / p.previousPrice) * 100 : 0 };
}
