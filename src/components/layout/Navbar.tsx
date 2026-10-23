"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { InstallAppButton } from "./InstallAppButton";
import { Logo } from "./Logo";
import { isActive, navItems } from "./nav-items";
import { LanguageToggle, ThemeToggle } from "./Toggles";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label={t.nav.main} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    <span className={cn("border-b-2 pb-1", active ? "border-gold" : "border-transparent")}>
                      {t.nav[item.key]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <InstallAppButton />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
