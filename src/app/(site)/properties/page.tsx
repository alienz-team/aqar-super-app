import type { Metadata } from "next";
import { PropertiesView } from "@/components/property/PropertiesView";
import { parseFilters } from "@/lib/property-filters";

export const metadata: Metadata = {
  title: "Properties",
  description: "Villas, apartments, land, istirahat, chalets and event halls for sale or rent.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  return <PropertiesView initialFilters={filters} />;
}
