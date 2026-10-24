"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { contact, mailUrl, telUrl, whatsappUrl } from "@/lib/contact";
import { formatNumber } from "@/lib/utils";
import { Logo } from "./Logo";
import { navItems } from "./nav-items";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const linkClass = "inline-flex items-center gap-2 hover:text-ink";

export function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="mt-24 border-t border-gold-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1.4fr]">
        <div className="max-w-sm">
          <Logo size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-muted">{t.footer.about}</p>
          <Link href="/#about" className="mt-4 inline-flex items-baseline gap-2 text-sm hover:text-gold-text">
            <span dir="ltr" className="tabular font-serif text-2xl text-gold-text">
              +{formatNumber(17, lang)}
            </span>
            <span className="text-muted">{t.about.yearsLabel}</span>
          </Link>
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
              <a href={contact.googleMaps} {...external} className={linkClass}>
                <MapPin className="size-4" aria-hidden />
                {contact.city[lang]}
              </a>
            </li>
            <li>
              <a href={telUrl} className={linkClass}>
                <Phone className="size-4" aria-hidden />
                <span dir="ltr">{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} {...external} className={linkClass}>
                <WhatsAppIcon className="size-4" />
                {t.contact.whatsapp}
              </a>
            </li>
            <li>
              <a href={mailUrl} className={linkClass}>
                <Mail className="size-4" aria-hidden />
                <span dir="ltr">{contact.email}</span>
              </a>
            </li>
            <li>
              <a href={contact.facebook} {...external} className={linkClass}>
                <FacebookIcon className="size-4" />
                {t.contact.facebook}
              </a>
            </li>
            <li>
              <a href={contact.instagram} {...external} className={linkClass}>
                <InstagramIcon className="size-4" />
                {t.contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-5 text-center text-xs text-muted">{t.footer.rights}</p>
    </footer>
  );
}
