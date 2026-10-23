"use client";

import { useState } from "react";
import { HardHat, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { buttonStyles } from "@/components/ui/primitives";
import en from "@/dictionaries/en.json";
import type { AdminService } from "@/lib/admin/data";
import type { ServiceCategory } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { DataTable, type Column } from "./DataTable";
import { ServiceForm } from "./ServiceForm";
import { PageHeader, StatusPill } from "./ui";

const columns: Column<AdminService>[] = [
  {
    key: "name",
    header: "Service",
    sortValue: (s) => s.nameEn,
    render: (s) => (
      <div>
        <p className="font-medium">{s.nameEn}</p>
        <p lang="ar" dir="rtl" className="text-start text-xs text-muted">
          {s.nameAr}
        </p>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortValue: (s) => s.category,
    hideBelow: "md",
    render: (s) => en.services.categories[s.category as ServiceCategory] ?? s.category,
  },
  {
    key: "mode",
    header: "Booking",
    sortValue: (s) => s.bookingMode,
    hideBelow: "sm",
    render: (s) => (s.bookingMode === "TECHNICIAN" ? "Technician" : "Quote"),
  },
  {
    key: "status",
    header: "Status",
    sortValue: (s) => (s.isActive ? 0 : 1),
    render: (s) => <StatusPill tone={s.isActive ? "up" : "muted"}>{s.isActive ? "Visible" : "Hidden"}</StatusPill>,
  },
  {
    key: "price",
    header: "From",
    sortValue: (s) => s.startingPrice,
    align: "end",
    render: (s) => <span className="tabular font-semibold">{formatPrice(s.startingPrice, "en")}</span>,
  },
];

export function ServicesManager({ rows }: { rows: AdminService[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Services"
        description="Construction, energy and maintenance services clients can request or book."
        action={
          <button type="button" onClick={() => setOpen(true)} className={buttonStyles.primary}>
            <Plus className="size-4" aria-hidden />
            Add new service
          </button>
        }
      />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(s) => s.id}
        searchText={(s) => `${s.nameEn} ${s.nameAr} ${s.category}`}
        searchLabel="Search by name or category"
        empty={
          <div className="rounded-sm border border-dashed border-line px-6 py-16 text-center">
            <HardHat className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 font-semibold">No services yet</p>
            <p className="mt-1.5 text-sm text-muted">Add a service to start taking requests for it.</p>
            <button type="button" onClick={() => setOpen(true)} className={`${buttonStyles.primary} mt-6`}>
              Add new service
            </button>
          </div>
        }
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add new service" className="max-w-2xl">
        <ServiceForm onSaved={() => setOpen(false)} />
      </Modal>
    </>
  );
}
