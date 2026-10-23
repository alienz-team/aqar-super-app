"use client";

import Link from "next/link";
import { CalendarCheck, ShieldAlert, Wrench } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import type { ServiceCategory } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export interface AccountBooking {
  id: string;
  propertyTitle: string;
  city: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export interface AccountRequest {
  id: string;
  category: ServiceCategory;
  city: string;
  createdAt: string;
  status: "OPEN" | "QUOTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

interface AccountViewProps {
  email: string;
  name: string | null;
  bookings: AccountBooking[];
  requests: AccountRequest[];
  denied: boolean;
}

const tone: Record<string, string> = {
  CONFIRMED: "border-up/30 text-up",
  COMPLETED: "border-up/30 text-up",
  CANCELLED: "border-down/30 text-down",
};

export function AccountView({ email, name, bookings, requests, denied }: AccountViewProps) {
  const { t, lang } = useLanguage();
  // Stored dates are calendar days in UTC; formatting in UTC keeps them from shifting.
  const date = new Intl.DateTimeFormat(lang === "ar" ? "ar-LY" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

  const Status = ({ status }: { status: keyof typeof t.account.status }) => (
    <span className={cn("rounded-xs border px-2 py-0.5 text-xs font-medium", tone[status] ?? "border-line text-muted")}>
      {t.account.status[status]}
    </span>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 sm:pt-20">
      <header className="border-b border-line pb-8">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl rtl:leading-snug">{name ?? t.account.title}</h1>
        <p className="mt-3 text-muted">
          {name && <span className="me-2 font-medium text-ink">{t.account.title}.</span>}
          {interpolate(t.account.greeting, { email })}
        </p>
      </header>

      {denied && (
        <p role="status" className="mt-8 flex items-start gap-3 rounded-sm border border-gold-line bg-surface p-4 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gold-text" aria-hidden />
          {t.account.adminDenied}
        </p>
      )}

      <section aria-labelledby="bookings-title" className="mt-12">
        <h2 id="bookings-title" className="mb-5 flex items-center gap-3 font-serif text-2xl">
          <CalendarCheck className="size-5 text-gold-text" aria-hidden />
          {t.account.bookings}
        </h2>
        {bookings.length === 0 ? (
          <Empty text={t.account.noBookings} href="/properties?type=RENT" cta={t.account.browseProperties} />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                <div>
                  <p className="font-medium">{b.propertyTitle}</p>
                  <p className="tabular text-sm text-muted">
                    {b.city} · {date.format(new Date(b.startDate))} – {date.format(new Date(b.endDate))}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular font-semibold text-gold-text">{formatPrice(b.totalPrice, lang)}</span>
                  <Status status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="requests-title" className="mt-12">
        <h2 id="requests-title" className="mb-5 flex items-center gap-3 font-serif text-2xl">
          <Wrench className="size-5 text-gold-text" aria-hidden />
          {t.account.requests}
        </h2>
        {requests.length === 0 ? (
          <Empty text={t.account.noRequests} href="/services" cta={t.account.browseServices} />
        ) : (
          <ul className="divide-y divide-line rounded-sm border border-line">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                <div>
                  <p className="font-medium">{t.services.categories[r.category]}</p>
                  <p className="tabular text-sm text-muted">
                    {r.city} · {date.format(new Date(r.createdAt))}
                  </p>
                </div>
                <Status status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Empty({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-sm border border-dashed border-line px-6 py-10 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link href={href} className={cn(buttonStyles.secondary, "mt-5")}>
        {cta}
      </Link>
    </div>
  );
}
