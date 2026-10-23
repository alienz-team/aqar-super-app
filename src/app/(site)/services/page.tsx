import type { Metadata } from "next";
import { ServicesView } from "@/components/services/ServicesView";
import { serviceSectors } from "@/lib/mock-data";
import type { ServiceSectorId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services",
  description: "Contracting, 3D design, pools, solar, smart home and maintenance from vetted providers.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { sector } = await searchParams;
  const initialSector = serviceSectors.find((s) => s.id === sector)?.id as ServiceSectorId | undefined;
  return <ServicesView initialSector={initialSector} />;
}
