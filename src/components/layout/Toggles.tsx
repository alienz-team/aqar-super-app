"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles } from "@/components/ui/primitives";
import { useMounted } from "@/lib/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  const mounted = useMounted();
  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t.actions.toLight : t.actions.toDark}
      className={buttonStyles.ghost}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}

export function LanguageToggle() {
  const { t, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.actions.toggleLangLabel}
      className={`${buttonStyles.ghost} min-w-14 font-semibold`}
    >
      {t.actions.toggleLang}
    </button>
  );
}
