"use client";

import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/ui/motion";
import { buttonStyles } from "@/components/ui/primitives";
import { contact, mailUrl, telUrl, whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export function ContactSection() {
  const { t, lang } = useLanguage();
  const coords = `${contact.lat}, ${contact.lng}`;

  const details = [
    { icon: MapPin, label: t.contact.location, value: contact.city[lang], href: contact.googleMaps, ltr: false },
    { icon: Phone, label: t.contact.phone, value: contact.phoneDisplay, href: telUrl, ltr: true },
    { icon: Mail, label: t.contact.email, value: contact.email, href: mailUrl, ltr: true },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-24">
      <Reveal>
        <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line lg:grid-cols-2">
          <div className="bg-bg p-6 sm:p-10">
            <h2 id="contact-title" className="font-serif text-3xl leading-tight sm:text-4xl rtl:leading-snug">
              {t.contact.title}
            </h2>
            <p className="mt-3 text-muted">{t.contact.subtitle}</p>

            <dl className="mt-8 space-y-5">
              {details.map(({ icon: Icon, label, value, href, ltr }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-gold-line text-gold-text">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="mt-0.5 font-medium">
                      <a href={href} {...(href.startsWith("http") ? external : {})} dir={ltr ? "ltr" : undefined} className="hover:text-gold-text">
                        {value}
                      </a>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telUrl} className={cn(buttonStyles.primary, "px-5 py-3")}>
                <Phone className="size-4" aria-hidden />
                {t.contact.call}
              </a>
              <a href={whatsappUrl()} {...external} className={cn(buttonStyles.gold, "px-5 py-3")}>
                <WhatsAppIcon className="size-4" />
                {t.contact.whatsapp}
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
              <span className="text-sm text-muted">{t.contact.followUs}</span>
              <a href={contact.facebook} {...external} aria-label={t.contact.facebook} className={cn(buttonStyles.secondary, "size-10 p-0")}>
                <FacebookIcon className="size-5" />
              </a>
              <a href={contact.instagram} {...external} aria-label={t.contact.instagram} className={cn(buttonStyles.secondary, "size-10 p-0")}>
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Navigation panel: opens the visitor's own maps app at the office pin. */}
          <div className="relative isolate flex flex-col justify-end bg-surface p-6 sm:p-10 lg:min-h-96">
            <div aria-hidden className="blueprint absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
            <MapPin className="mb-auto size-14 text-gold-text" strokeWidth={1.25} aria-hidden />
            <p className="mt-10 text-lg font-semibold">{contact.city[lang]}</p>
            <p dir="ltr" className="tabular mt-1 text-sm text-muted">
              {coords}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={contact.googleMaps} {...external} className={cn(buttonStyles.primary, "px-5 py-3")}>
                <Navigation className="size-4" aria-hidden />
                {t.contact.openMaps}
              </a>
              <a href={contact.waze} {...external} className={cn(buttonStyles.secondary, "px-5 py-3")}>
                <Navigation className="size-4" aria-hidden />
                {t.contact.openWaze}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
