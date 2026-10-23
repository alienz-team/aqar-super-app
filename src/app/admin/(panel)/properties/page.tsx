import type { Metadata } from "next";
import { PropertiesManager } from "@/components/admin/PropertiesManager";
import { LoadNotice } from "@/components/admin/ui";
import { listProperties } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Properties" };

export default async function AdminPropertiesPage() {
  const state = await listProperties();
  return (
    <>
      {state.status !== "ok" && <LoadNotice state={state} className="mb-8" />}
      <PropertiesManager rows={state.status === "ok" ? state.data : []} />
    </>
  );
}
