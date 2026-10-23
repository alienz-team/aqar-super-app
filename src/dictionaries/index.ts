import en from "./en.json";
import ar from "./ar.json";

export type Lang = "en" | "ar";
export type Dictionary = typeof en;

// Annotating `ar` as Dictionary makes a missing/renamed key a type error.
const arabic: Dictionary = ar;

export const dictionaries: Record<Lang, Dictionary> = { en, ar: arabic };

export const directions: Record<Lang, "ltr" | "rtl"> = { en: "ltr", ar: "rtl" };

/** Replaces `{name}` placeholders: interpolate("{count} days", { count: 3 }). */
export function interpolate(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}
