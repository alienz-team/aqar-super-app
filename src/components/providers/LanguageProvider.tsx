"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { dictionaries, directions, type Dictionary, type Lang } from "@/dictionaries";

export const LANG_STORAGE_KEY = "aqar-lang";

/** Runs in <head> before paint so the page never flashes the wrong direction. */
export const langBootScript = `(function(){try{var l=localStorage.getItem("${LANG_STORAGE_KEY}");if(l==="ar"||l==="en"){var h=document.documentElement;h.lang=l;h.dir=l==="ar"?"rtl":"ltr";}}catch(e){}})();`;

// Tiny external store: localStorage is the source of truth, with an
// in-memory fallback for browsers where storage access throws.
const listeners = new Set<() => void>();
let memoryLang: Lang | null = null;

function readLang(): Lang {
  if (memoryLang) return memoryLang;
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function writeLang(next: Lang) {
  memoryLang = next;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    // Storage blocked: the in-memory value still drives this session.
  }
  listeners.forEach((l) => l());
}

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribe, readLang, () => "en");
  const dir = directions[lang];

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => writeLang(next), []);
  const toggleLang = useCallback(() => writeLang(readLang() === "ar" ? "en" : "ar"), []);

  const value = useMemo(
    () => ({ lang, dir, t: dictionaries[lang], setLang, toggleLang }),
    [lang, dir, setLang, toggleLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
