"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Confirmation } from "@/components/property/BookingModal";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles, Field, inputStyles, isValidLibyanMobile, makeReference } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import { cities } from "@/lib/mock-data";
import type { ServiceCategory, ServiceSector } from "@/lib/types";
import { cn, toDateInput } from "@/lib/utils";

interface ServiceRequestModalProps {
  sector: ServiceSector | null;
  onClose: () => void;
}

export function ServiceRequestModal({ sector, onClose }: ServiceRequestModalProps) {
  const { t } = useLanguage();
  const title = sector
    ? `${sector.mode === "technician" ? t.services.bookTechnician : t.services.requestQuote}: ${t.services.sectors[sector.id].name}`
    : "";

  return (
    <Modal open={sector !== null} onClose={onClose} title={title}>
      {sector && <RequestForm sector={sector} onDone={onClose} />}
    </Modal>
  );
}

function RequestForm({ sector, onDone }: { sector: ServiceSector; onDone: () => void }) {
  const { t, lang } = useLanguage();
  const [category, setCategory] = useState<ServiceCategory>(sector.categories[0]);
  const [city, setCity] = useState<string>(cities[0].en);
  const [date, setDate] = useState(() => toDateInput(new Date()));
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const isTechnician = sector.mode === "technician";

  if (reference) {
    return (
      <Confirmation
        title={isTechnician ? t.services.form.bookedTitle : t.services.form.sentTitle}
        body={interpolate(isTechnician ? t.services.form.bookedBody : t.services.form.sentBody, { ref: reference, phone })}
        onDone={onDone}
      />
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (details.trim().length < 5 || !isValidLibyanMobile(phone)) return setError(t.services.form.error);
    setError(null);
    // TODO: create a ServiceRequest row (status OPEN) via a server action once Supabase is connected.
    setReference(makeReference(isTechnician ? "TC" : "QT"));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {sector.categories.length > 1 && (
        <Field label={t.services.form.service}>
          <select value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)} className={inputStyles}>
            {sector.categories.map((c) => (
              <option key={c} value={c}>
                {t.services.categories[c]}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.services.form.city}>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={inputStyles}>
            {cities.map((c) => (
              <option key={c.en} value={c.en}>
                {c[lang]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.services.form.date}>
          <input
            type="date"
            value={date}
            min={toDateInput(new Date())}
            onChange={(e) => setDate(e.target.value)}
            className={inputStyles}
          />
        </Field>
      </div>
      <Field label={t.services.form.details}>
        <textarea
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={t.services.form.detailsPlaceholder}
          className={cn(inputStyles, "resize-none")}
        />
      </Field>
      <Field label={t.services.form.phone}>
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
      {error && (
        <p role="alert" className="text-sm text-down">
          {error}
        </p>
      )}
      <button type="submit" className={cn(buttonStyles.primary, "w-full py-3")}>
        {isTechnician ? t.services.form.submitTechnician : t.services.form.submitQuote}
      </button>
    </form>
  );
}
