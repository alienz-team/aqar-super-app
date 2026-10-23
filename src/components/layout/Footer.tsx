"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Logo } from "./Logo";
import { navItems } from "./nav-items";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-gold-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-muted">{t.footer.about}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              <a href="tel:+218210000000" className="inline-flex items-center gap-2 hover:text-ink">
                <Phone className="size-4" aria-hidden />
                <span dir="ltr">+218 21 000 0000</span>
              </a>
            </li>
            <li>
              <a href="mailto:care@aqar.example" className="inline-flex items-center gap-2 hover:text-ink">
                <Mail className="size-4" aria-hidden />
                care@aqar.example
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-5 text-center text-xs text-muted">{t.footer.rights}</p>
    </footer>
  );
}
