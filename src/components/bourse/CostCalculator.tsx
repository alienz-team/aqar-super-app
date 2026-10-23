"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles, Field, inputStyles, Segmented } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import { estimateCost, finishingLevels, type FinishingLevel } from "@/lib/calculator";
import type { MaterialQuote } from "@/lib/types";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

const MAX_FLOORS = 10;

export function CostCalculator({ prices }: { prices: MaterialQuote[] }) {
  const { t, lang } = useLanguage();
  const [roofInput, setRoofInput] = useState("300");
  const [floors, setFloors] = useState(2);
  const [level, setLevel] = useState<FinishingLevel>("economy");

  const roofArea = Math.min(Math.max(Number(roofInput) || 0, 0), 100_000);
  const result = useMemo(() => estimateCost(roofArea, floors, level, prices), [roofArea, floors, level, prices]);
  const names = useMemo(() => new Map(prices.map((p) => [p.materialType, lang === "ar" ? p.nameAr : p.nameEn])), [prices, lang]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="space-y-7">
        <Field label={t.calc.roofArea}>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={10}
            value={roofInput}
            onChange={(e) => setRoofInput(e.target.value)}
            className={cn(inputStyles, "tabular text-base")}
          />
        </Field>

        <div>
          <span id="floors-label" className="mb-1.5 block text-sm font-medium text-muted">
            {t.calc.floors}
          </span>
          <div role="group" aria-labelledby="floors-label" className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t.calc.floorLess}
              onClick={() => setFloors((f) => Math.max(1, f - 1))}
              disabled={floors <= 1}
              className={cn(buttonStyles.secondary, "size-11 p-0")}
            >
              <Minus className="size-4" />
            </button>
            <output aria-live="polite" className="tabular w-10 text-center text-xl font-semibold">
              {formatNumber(floors, lang)}
            </output>
            <button
              type="button"
              aria-label={t.calc.floorMore}
              onClick={() => setFloors((f) => Math.min(MAX_FLOORS, f + 1))}
              disabled={floors >= MAX_FLOORS}
              className={cn(buttonStyles.secondary, "size-11 p-0")}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-muted">{t.calc.level}</span>
          <Segmented
            label={t.calc.level}
            value={level}
            onChange={setLevel}
            options={finishingLevels.map((l) => ({ value: l, label: t.calc.levels[l] }))}
            className="flex w-full"
          />
        </div>

        <p className="tabular flex justify-between border-t border-line pt-5 text-sm">
          <span className="text-muted">{t.calc.builtArea}</span>
          <span className="font-semibold">
            {formatNumber(result.builtArea, lang)} {t.property.sqm}
          </span>
        </p>
      </div>

      <div className="glass rounded-sm p-6 sm:p-8" aria-live="polite">
        <table className="tabular w-full text-sm">
          <caption className="mb-4 text-start font-serif text-2xl">{t.calc.materials}</caption>
          <thead className="text-xs text-muted">
            <tr>
              <th scope="col" className="pb-2 text-start font-medium">{t.bourse.material}</th>
              <th scope="col" className="pb-2 text-end font-medium">{t.calc.quantity}</th>
              <th scope="col" className="pb-2 text-end font-medium">{t.calc.subtotal}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {result.lines.map((line) => (
              <tr key={line.materialType}>
                <th scope="row" className="py-3 text-start font-normal">{names.get(line.materialType)}</th>
                <td className="py-3 text-end text-muted">
                  {formatNumber(line.quantity, lang, line.materialType === "CEMENT_BAG" ? 0 : 1)}{" "}
                  {t.calc.qtyUnits[line.materialType]}
                </td>
                <td className="py-3 text-end">{formatPrice(line.total, lang)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-line">
            <tr>
              <th scope="row" colSpan={2} className="pt-3 text-start font-medium text-muted">{t.calc.materials}</th>
              <td className="pt-3 text-end font-medium">{formatPrice(result.materialsTotal, lang)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={2} className="pt-1.5 text-start font-medium text-muted">{t.calc.works}</th>
              <td className="pt-1.5 text-end font-medium">{formatPrice(result.worksTotal, lang)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-t border-gold-line pt-6">
          <div>
            <p className="text-sm text-muted">{t.calc.total}</p>
            <p className="tabular mt-1 font-serif text-4xl text-gold-text sm:text-5xl">{formatPrice(result.total, lang)}</p>
          </div>
          <p className="tabular text-sm text-muted">
            {interpolate(t.calc.perSqm, { price: formatPrice(result.perSqm, lang) })}
          </p>
        </div>

        <p className="mt-4 text-xs text-muted">{t.calc.disclaimer}</p>
        <Link href="/services?sector=contracting" className={cn(buttonStyles.primary, "mt-6 w-full px-6 py-3 sm:w-auto")}>
          {t.calc.getQuote}
        </Link>
      </div>
    </div>
  );
}
