import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lang } from "@/dictionaries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ar-LY uses Western digits (1,234), as Libyan price tags do.
const locales: Record<Lang, string> = { en: "en-LY", ar: "ar-LY" };

export function formatNumber(value: number, lang: Lang, fractionDigits = 0) {
  return new Intl.NumberFormat(locales[lang], {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Libyan Dinar: "LYD 1,250" / "1,250 د.ل". */
export function formatPrice(value: number, lang: Lang, fractionDigits = 0) {
  const n = formatNumber(value, lang, fractionDigits);
  return lang === "ar" ? `${n} د.ل` : `LYD ${n}`;
}

/** Local yyyy-mm-dd, for <input type="date"> min values. */
export function toDateInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
