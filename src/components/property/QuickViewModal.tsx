"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Crown, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Modal } from "@/components/ui/Modal";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { buttonStyles } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import { telUrl, whatsappUrl } from "@/lib/contact";
import type { PropertyListing } from "@/lib/types";
import { unsplashLoader } from "@/lib/unsplash-loader";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

interface QuickViewModalProps {
  property: PropertyListing | null;
  onClose: () => void;
  /** Book (rentals) or request a viewing (sales); the grid swaps this modal for the form. */
  onAction: (property: PropertyListing) => void;
}

export function QuickViewModal({ property, onClose, onAction }: QuickViewModalProps) {
  const { lang } = useLanguage();
  return (
    <Modal open={property !== null} onClose={onClose} title={property?.title[lang] ?? ""} className="max-w-4xl">
      {property && <QuickViewBody key={property.id} property={property} onAction={onAction} />}
    </Modal>
  );
}

function QuickViewBody({ property: p, onAction }: { property: PropertyListing; onAction: (property: PropertyListing) => void }) {
  const { t, lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const isRent = p.listingType === "RENT";
  const count = p.images.length;
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count);

  const specs = [
    p.bedrooms !== undefined && { label: t.property.beds, value: formatNumber(p.bedrooms, lang) },
    p.bathrooms !== undefined && { label: t.property.baths, value: formatNumber(p.bathrooms, lang) },
    { label: t.property.area, value: `${formatNumber(p.areaSqm, lang)} ${t.property.sqm}` },
  ].filter((s): s is { label: string; value: string } => Boolean(s));

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div role="group" aria-label={t.property.gallery} className="min-w-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-surface-2">
          <Image
            key={p.images[index]}
            src={p.images[index]}
            alt={`${p.title[lang]}. ${interpolate(t.property.photoOf, { n: formatNumber(index + 1, lang), total: formatNumber(count, lang) })}`}
            fill
            sizes="(min-width: 768px) 520px, 100vw"
            loader={unsplashLoader}
            className="object-cover"
          />
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t.property.prevPhoto}
                className="absolute start-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/75"
              >
                <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t.property.nextPhoto}
                className="absolute end-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm hover:bg-black/75"
              >
                <ChevronRight className="size-5 rtl:rotate-180" aria-hidden />
              </button>
              <span className="tabular absolute bottom-2 end-2 rounded-xs bg-black/55 px-2 py-0.5 text-xs text-white backdrop-blur-sm" aria-live="polite">
                {formatNumber(index + 1, lang)} / {formatNumber(count, lang)}
              </span>
            </>
          )}
        </div>
        {count > 1 && (
          <ul className="mt-2 grid grid-flow-col auto-cols-[4.5rem] gap-2 overflow-x-auto pb-1">
            {p.images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={interpolate(t.property.showPhoto, { n: formatNumber(i + 1, lang) })}
                  aria-current={i === index || undefined}
                  className={cn(
                    "relative block aspect-[4/3] w-full overflow-hidden rounded-xs border bg-surface-2",
                    i === index ? "border-gold" : "border-line opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="72px" loader={unsplashLoader} className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-xs border border-line px-2 py-1">
            {t.categories[p.category]}
            <span className="text-muted"> / {isRent ? t.property.forRent : t.property.forSale}</span>
          </span>
          {p.isNew && <span className="rounded-xs bg-brand px-2 py-1 font-bold text-brand-ink">{t.property.new}</span>}
          {p.isVip && (
            <span className="gold-metal inline-flex items-center gap-1 rounded-xs px-2 py-1 font-bold">
              <Crown className="size-3.5" aria-hidden />
              {t.property.vip}
            </span>
          )}
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden />
          {p.city[lang]}
        </p>
        <p className="tabular mt-1">
          <span className="text-2xl font-semibold tracking-tight text-gold-text">{formatPrice(p.price, lang)}</span>
          {isRent && <span className="ms-1 text-sm text-muted">{t.property.perCycle[p.rentCycle]}</span>}
        </p>

        <dl className="mt-4 grid border-y border-line" style={{ gridTemplateColumns: `repeat(${specs.length}, minmax(0, 1fr))` }}>
          {specs.map((s, i) => (
            <div key={s.label} className={cn("py-3", i > 0 && "border-s border-line ps-4")}>
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="tabular mt-0.5 text-sm font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-muted">{p.description[lang]}</p>

        <div className="mt-auto grid gap-2 pt-6">
          <button type="button" onClick={() => onAction(p)} className={cn(isRent ? buttonStyles.gold : buttonStyles.primary, "w-full py-3")}>
            {isRent ? t.property.bookNow : t.property.requestViewing}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl(interpolate(t.property.whatsappMessage, { name: p.title[lang] }))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles.secondary}
            >
              <WhatsAppIcon className="size-4" />
              {t.contact.whatsapp}
            </a>
            <a href={telUrl} className={buttonStyles.secondary}>
              <Phone className="size-4" aria-hidden />
              {t.property.callUs}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
