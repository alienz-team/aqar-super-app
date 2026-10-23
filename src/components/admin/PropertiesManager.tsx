"use client";

import { useState } from "react";
import { Building2, Crown, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles } from "@/components/ui/primitives";
import en from "@/dictionaries/en.json";
import type { AdminProperty } from "@/lib/admin/data";
import type { PropertyCategory, RentCycle } from "@/lib/types";
import { formatNumber, formatPrice } from "@/lib/utils";
import { DataTable, type Column } from "./DataTable";
import { PropertyForm } from "./PropertyForm";
import { PageHeader, StatusPill } from "./ui";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const columns: Column<AdminProperty>[] = [
  {
    key: "title",
    header: "Property",
    sortValue: (p) => p.title,
    render: (p) => (
      <div>
        <p className="font-medium">{p.title}</p>
        <p className="text-xs text-muted">
          {p.city} · {p.imageCount} {p.imageCount === 1 ? "image" : "images"}
        </p>
      </div>
    ),
  },
  {
    key: "category",
    header: "Type",
    sortValue: (p) => p.category,
    hideBelow: "md",
    render: (p) => en.categories[p.category as PropertyCategory] ?? p.category,
  },
  {
    key: "listing",
    header: "Listing",
    sortValue: (p) => p.listingType,
    render: (p) => (
      <div className="flex flex-wrap items-center gap-1.5">
        <StatusPill tone={p.listingType === "RENT" ? "up" : "muted"}>
          {p.listingType === "RENT" ? `Rent ${en.property.perCycle[p.rentCycle as RentCycle]}` : "Sale"}
        </StatusPill>
        {p.isVip && (
          <StatusPill tone="gold">
            <Crown className="me-1 size-3" aria-hidden />
            VIP
          </StatusPill>
        )}
      </div>
    ),
  },
  {
    key: "area",
    header: "Area",
    sortValue: (p) => p.areaSqm,
    align: "end",
    hideBelow: "lg",
    render: (p) => <span className="tabular">{formatNumber(p.areaSqm, "en")} m²</span>,
  },
  {
    key: "price",
    header: "Price",
    sortValue: (p) => p.price,
    align: "end",
    render: (p) => <span className="tabular font-semibold">{formatPrice(p.price, "en")}</span>,
  },
  {
    key: "created",
    header: "Added",
    sortValue: (p) => p.createdAt,
    align: "end",
    hideBelow: "sm",
    render: (p) => <span className="tabular text-muted">{dateFormat.format(new Date(p.createdAt))}</span>,
  },
];

export function PropertiesManager({ rows }: { rows: AdminProperty[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Properties"
        description="Every listing in the database, newest first. Add one and it is saved straight away."
        action={
          <button type="button" onClick={() => setOpen(true)} className={buttonStyles.primary}>
            <Plus className="size-4" aria-hidden />
            Add new property
          </button>
        }
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(p) => p.id}
        searchText={(p) => `${p.title} ${p.city} ${p.category}`}
        searchLabel="Search by title, city or type"
        empty={
          <div className="rounded-sm border border-dashed border-line px-6 py-16 text-center">
            <Building2 className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 font-semibold">No properties yet</p>
            <p className="mt-1.5 text-sm text-muted">Add the first listing to see it here.</p>
            <button type="button" onClick={() => setOpen(true)} className={`${buttonStyles.primary} mt-6`}>
              Add new property
            </button>
          </div>
        }
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add new property" className="max-w-2xl">
        <PropertyForm onSaved={() => setOpen(false)} />
      </Modal>
    </>
  );
}
