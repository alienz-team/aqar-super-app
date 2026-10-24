"use client";

import { Crown, Eye, MapPin } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { buttonStyles } from "@/components/ui/primitives";
import { propertyWhatsappUrl } from "@/lib/contact";
import type { PropertyListing } from "@/lib/types";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { PropertyVisual } from "./PropertyVisual";

interface PropertyCardProps {
  property: PropertyListing;
  onAction: (property: PropertyListing) => void;
  onQuickView: (property: PropertyListing) => void;
}

export function PropertyCard({ property: p, onAction, onQuickView }: PropertyCardProps) {
  const { t, lang } = useLanguage();
  const isRent = p.listingType === "RENT";

  // Land and halls have no rooms, so the spec strip shrinks to what applies.
  const specs = [
    p.bedrooms !== undefined && { label: t.property.beds, value: formatNumber(p.bedrooms, lang) },
    p.bathrooms !== undefined && { label: t.property.baths, value: formatNumber(p.bathrooms, lang) },
    { label: t.property.area, value: `${formatNumber(p.areaSqm, lang)} ${t.property.sqm}` },
  ].filter((s): s is { label: string; value: string } => Boolean(s));

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-sm border border-line">
        <PropertyVisual category={p.category} images={p.images} alt={p.title[lang]} offsetMs={(Number(p.id.slice(-2)) % 7) * 450} />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {/* Dark glass in both themes: it always sits on a photo. */}
          <span className="rounded-xs bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {t.categories[p.category]}
            <span className="text-white/70"> / {isRent ? t.property.forRent : t.property.forSale}</span>
          </span>
          <div className="flex items-center gap-1.5">
            {p.isNew && (
              <span className="rounded-xs bg-brand px-2 py-1 text-xs font-bold text-brand-ink shadow-[0_0_0_1px_rgb(255_255_255/0.35)]">
                {t.property.new}
              </span>
            )}
            {p.isVip && (
              <span className="gold-metal inline-flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-bold shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]">
                <Crown className="size-3.5" aria-hidden />
                {t.property.vip}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onQuickView(p)}
          className="absolute bottom-3 end-3 inline-flex items-center gap-1.5 rounded-xs bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          <Eye className="size-3.5" aria-hidden />
          {t.property.quickView}
          <span className="sr-only">: {p.title[lang]}</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="size-3.5" aria-hidden />
          {p.city[lang]}
        </p>
        <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight">{p.title[lang]}</h3>

        <dl
          className="mt-5 grid border-y border-line"
          style={{ gridTemplateColumns: `repeat(${specs.length}, minmax(0, 1fr))` }}
        >
          {specs.map((s, i) => (
            <div key={s.label} className={cn("py-3", i > 0 && "border-s border-line ps-4")}>
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="tabular mt-0.5 text-sm font-semibold">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="tabular">
            <span className="text-xl font-semibold tracking-tight text-gold-text">{formatPrice(p.price, lang)}</span>
            {isRent && <span className="ms-1 text-sm text-muted">{t.property.perCycle[p.rentCycle]}</span>}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={propertyWhatsappUrl(p)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.property.askWhatsapp}: ${p.title[lang]}`}
              className={cn(buttonStyles.secondary, "size-10 p-0 text-[#1fa855] hover:border-[#25D366]")}
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <button
              type="button"
              onClick={() => onAction(p)}
              className={cn(isRent ? buttonStyles.gold : buttonStyles.secondary, "px-4 py-2")}
            >
              {isRent ? t.property.bookNow : t.property.requestViewing}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
