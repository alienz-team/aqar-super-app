import type { MaterialQuote, MaterialType } from "./types";

export type FinishingLevel = "skeleton" | "economy" | "luxury" | "vip";

export const finishingLevels: FinishingLevel[] = ["skeleton", "economy", "luxury", "vip"];

/** Material consumed per m² of built-up area (typical reinforced-concrete residential averages). */
const consumption: Record<FinishingLevel, Record<MaterialType, number>> = {
  skeleton: { IRON_TON: 0.045, CEMENT_BAG: 2.6, BRICKS_1000: 0.014, SAND_LOAD: 0.016, SOLAR_PANEL_KW: 0 },
  economy: { IRON_TON: 0.045, CEMENT_BAG: 3.4, BRICKS_1000: 0.015, SAND_LOAD: 0.022, SOLAR_PANEL_KW: 0 },
  luxury: { IRON_TON: 0.05, CEMENT_BAG: 3.8, BRICKS_1000: 0.016, SAND_LOAD: 0.025, SOLAR_PANEL_KW: 0.01 },
  vip: { IRON_TON: 0.055, CEMENT_BAG: 4.2, BRICKS_1000: 0.017, SAND_LOAD: 0.028, SOLAR_PANEL_KW: 0.02 },
};

/**
 * Labour + finishing works (LYD per m²) on top of the bourse materials. Tuned so totals land
 * near Libyan market rates: ~650 skeleton, ~1,500 economy, ~2,300 luxury, ~3,500 VIP per m².
 */
const worksPerSqm: Record<FinishingLevel, number> = {
  skeleton: 250,
  economy: 1_050,
  luxury: 1_750,
  vip: 2_850,
};

export interface CostLine {
  materialType: MaterialType;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CostBreakdown {
  builtArea: number;
  lines: CostLine[];
  materialsTotal: number;
  worksTotal: number;
  total: number;
  perSqm: number;
}

export function estimateCost(
  roofArea: number,
  floors: number,
  level: FinishingLevel,
  prices: MaterialQuote[],
): CostBreakdown {
  const builtArea = Math.max(0, roofArea) * Math.max(0, floors);
  const ratios = consumption[level];

  const lines = prices
    .map((p) => {
      const quantity = builtArea * ratios[p.materialType];
      return { materialType: p.materialType, quantity, unitPrice: p.unitPrice, total: quantity * p.unitPrice };
    })
    .filter((line) => line.quantity > 0);

  const materialsTotal = lines.reduce((sum, l) => sum + l.total, 0);
  const worksTotal = builtArea * worksPerSqm[level];
  const total = materialsTotal + worksTotal;

  return { builtArea, lines, materialsTotal, worksTotal, total, perSqm: builtArea ? total / builtArea : 0 };
}
