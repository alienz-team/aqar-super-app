"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { interpolate } from "@/dictionaries";
import type { MaterialQuote } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";
import { PriceChange } from "./PriceChange";

export function BourseTable({ prices }: { prices: MaterialQuote[] }) {
  const { t, lang } = useLanguage();
  const mounted = useMounted();
  const latest = prices.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), prices[0]?.updatedAt ?? "");
  // Formatted only on the client: the server's time zone would not match the viewer's.
  const time = mounted && latest
    ? new Intl.DateTimeFormat(lang === "ar" ? "ar-LY" : "en-LY", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(latest))
    : "—";

  return (
    <div className="glass overflow-hidden rounded-sm shadow-[0_40px_100px_-50px_rgb(0_0_0/0.7)]">
      <table className="w-full text-start text-sm">
        <thead className="border-b border-line text-xs text-muted">
          <tr>
            <th scope="col" className="px-5 py-4 text-start font-medium sm:px-8">{t.bourse.material}</th>
            <th scope="col" className="hidden px-5 py-4 text-start font-medium sm:table-cell">{t.bourse.unit}</th>
            <th scope="col" className="px-5 py-4 text-end font-medium">{t.bourse.price}</th>
            <th scope="col" className="px-5 py-4 text-end font-medium sm:px-8">{t.bourse.change}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {prices.map((p) => (
            <tr key={p.materialType} className="transition-colors hover:bg-surface/60">
              <th scope="row" className="px-5 py-5 text-start text-base font-medium sm:px-8">
                {lang === "ar" ? p.nameAr : p.nameEn}
                <span className="block text-xs font-normal text-muted sm:hidden">{p.unit[lang]}</span>
              </th>
              <td className="hidden px-5 py-5 text-muted sm:table-cell">{p.unit[lang]}</td>
              <td className="tabular px-5 py-5 text-end text-base font-semibold tracking-tight sm:text-lg">
                {formatPrice(p.unitPrice, lang, p.unitPrice < 100 ? 2 : 0)}
              </td>
              <td className="px-5 py-5 text-end sm:px-8">
                <PriceChange quote={p} className="justify-end" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-5 py-4 text-xs text-muted sm:px-8" aria-live="polite">
        {interpolate(t.bourse.updated, { time })}
      </p>
    </div>
  );
}
