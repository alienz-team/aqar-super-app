"use client";

import { useState } from "react";
import type { PropertyListing } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookingModal } from "./BookingModal";
import { PropertyCard } from "./PropertyCard";
import { QuickViewModal } from "./QuickViewModal";

export function PropertyGrid({ items, className }: { items: PropertyListing[]; className?: string }) {
  const [selected, setSelected] = useState<PropertyListing | null>(null);
  const [preview, setPreview] = useState<PropertyListing | null>(null);

  return (
    <>
      <div className={cn("grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} onAction={setSelected} onQuickView={setPreview} />
        ))}
      </div>
      <QuickViewModal
        property={preview}
        onClose={() => setPreview(null)}
        // One dialog at a time: the quick view hands over to the booking form.
        onAction={(p) => {
          setPreview(null);
          setSelected(p);
        }}
      />
      <BookingModal property={selected} onClose={() => setSelected(null)} />
    </>
  );
}
