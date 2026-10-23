"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { isActive, navItems } from "./nav-items";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t.nav.main}
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-4">
        {navItems.map(({ href, mobileKey, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                  active ? "text-gold-text" : "text-muted",
                )}
              >
                <Icon className="size-5" aria-hidden strokeWidth={active ? 2.25 : 1.75} />
                {t.nav[mobileKey]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
