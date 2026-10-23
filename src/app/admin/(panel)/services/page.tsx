import type { Metadata } from "next";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { LoadNotice } from "@/components/admin/ui";
import { listServices } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const state = await listServices();
  return (
    <>
      {state.status !== "ok" && <LoadNotice state={state} className="mb-8" />}
      <ServicesManager rows={state.status === "ok" ? state.data : []} />
    </>
  );
}
