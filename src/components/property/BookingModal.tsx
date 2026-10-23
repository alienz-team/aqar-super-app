"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { BrandTile } from "@/components/layout/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles, Field, inputStyles, isValidLibyanMobile, makeReference } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import type { PropertyListing, RentCycle } from "@/lib/types";
import { cn, formatNumber, formatPrice, toDateInput } from "@/lib/utils";

const DAY_MS = 86_400_000;

/** Parses yyyy-mm-dd as a UTC calendar day so DST and time zones never skew the count. */
function parseDay(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? Date.UTC(y, m - 1, d) : NaN;
}

function addToDate(base: Date, cycle: RentCycle) {
  const next = new Date(base);
  if (cycle === "MONTHLY") next.setMonth(next.getMonth() + 1);
  else if (cycle === "YEARLY") next.setFullYear(next.getFullYear() + 1);
  else next.setDate(next.getDate() + 1);
  return next;
}

/** Billable units for the stay: days, started months (30 d) or started years (365 d). */
export function billableUnits(start: string, end: string, cycle: RentCycle) {
  const days = Math.round((parseDay(end) - parseDay(start)) / DAY_MS);
  if (!Number.isFinite(days) || days <= 0) return 0;
  if (cycle === "MONTHLY") return Math.ceil(days / 30);
  if (cycle === "YEARLY") return Math.ceil(days / 365);
  return days;
}

interface BookingModalProps {
  property: PropertyListing | null;
  onClose: () => void;
}

export function BookingModal({ property, onClose }: BookingModalProps) {
  const { t, lang } = useLanguage();
  const isRent = property?.listingType === "RENT";
  const title = property
    ? isRent
      ? interpolate(t.booking.title, { name: property.title[lang] })
      : t.booking.viewingTitle
    : "";

  return (
    <Modal open={property !== null} onClose={onClose} title={title}>
      {property && (isRent ? <RentalForm property={property} onDone={onClose} /> : <ViewingForm onDone={onClose} />)}
    </Modal>
  );
}

function RentalForm({ property, onDone }: { property: PropertyListing; onDone: () => void }) {
  const { t, lang } = useLanguage();
  const today = new Date();
  const [start, setStart] = useState(() => toDateInput(today));
  const [end, setEnd] = useState(() => toDateInput(addToDate(today, property.rentCycle)));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const units = billableUnits(start, end, property.rentCycle);
  const total = units * property.price;

  if (reference) {
    return (
      <Confirmation
        title={t.booking.confirmedTitle}
        body={interpolate(t.booking.confirmedBody, { ref: reference, phone })}
        onDone={onDone}
      />
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (units <= 0) return setError(t.booking.errorRange);
    if (!name.trim() || !isValidLibyanMobile(phone)) return setError(t.booking.errorRequired);
    setError(null);
    // TODO: persist as a PENDING Booking via a server action once Supabase is connected.
    setReference(makeReference("BK"));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.booking.start}>
          <input
            type="date"
            required
            value={start}
            min={toDateInput(today)}
            onChange={(e) => setStart(e.target.value)}
            className={inputStyles}
          />
        </Field>
        <Field label={t.booking.end}>
          <input
            type="date"
            required
            value={end}
            min={start}
            onChange={(e) => setEnd(e.target.value)}
            className={inputStyles}
          />
        </Field>
      </div>

      <dl className="tabular space-y-2 rounded-xl border border-line bg-bg p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t.booking.rate}</dt>
          <dd>
            {formatPrice(property.price, lang)} {t.property.perCycle[property.rentCycle]}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{t.booking.units[property.rentCycle]}</dt>
          <dd>{units > 0 ? formatNumber(units, lang) : "—"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-2 text-base font-semibold">
          <dt>{t.booking.total}</dt>
          <dd className="text-gold-text">{formatPrice(total, lang)}</dd>
        </div>
      </dl>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.booking.fullName}>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputStyles} />
        </Field>
        <Field label={t.booking.phone}>
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="09XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputStyles}
          />
        </Field>
      </div>

      {error && (
        <p role="alert" className="text-sm text-down">
          {error}
        </p>
      )}

      <button type="submit" className={cn(buttonStyles.gold, "w-full py-3")}>
        {t.booking.confirm}
      </button>
    </form>
  );
}

function ViewingForm({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const [date, setDate] = useState(() => toDateInput(new Date()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  if (reference) {
    return (
      <Confirmation
        title={t.booking.viewingConfirmedTitle}
        body={interpolate(t.booking.viewingConfirmedBody, { ref: reference, phone })}
        onDone={onDone}
      />
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !isValidLibyanMobile(phone)) return setError(t.booking.errorRequired);
    setError(null);
    setReference(makeReference("VW"));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label={t.booking.viewingDate}>
        <input
          type="date"
          value={date}
          min={toDateInput(new Date())}
          onChange={(e) => setDate(e.target.value)}
          className={inputStyles}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t.booking.fullName}>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputStyles} />
        </Field>
        <Field label={t.booking.phone}>
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="09XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputStyles}
          />
        </Field>
      </div>
      {error && (
        <p role="alert" className="text-sm text-down">
          {error}
        </p>
      )}
      <button type="submit" className={cn(buttonStyles.primary, "w-full py-3")}>
        {t.booking.viewingConfirm}
      </button>
    </form>
  );
}

export function Confirmation({ title, body, onDone }: { title: string; body: string; onDone: () => void }) {
  const { t } = useLanguage();
  return (
    <div role="status" className="relative isolate text-center">
      {/* Blueprint grid fading out from behind the seal. */}
      <div
        aria-hidden
        className="blueprint absolute inset-x-0 -top-4 -z-10 h-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <span className="relative mx-auto inline-flex">
        <BrandTile className="size-16" />
        <CircleCheck
          className="absolute -bottom-1.5 -end-1.5 size-6 rounded-full bg-surface text-up"
          strokeWidth={2.25}
          aria-hidden
        />
      </span>
      <p className="mt-4 text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
      <button type="button" onClick={onDone} className={cn(buttonStyles.primary, "mt-6 w-full")}>
        {t.booking.done}
      </button>
    </div>
  );
}
