import type { ListingType, PropertyCategory, PropertyListing, RentCycle } from "./types";

export const CATEGORIES: PropertyCategory[] = ["APARTMENT", "VILLA", "LAND", "COMMERCIAL", "ISTIRAHA", "CHALET", "EVENT_HALL"];
export const RENT_CYCLES: Exclude<RentCycle, "NONE">[] = ["DAILY", "MONTHLY", "YEARLY"];

export interface PropertyFilters {
  type: ListingType | "ALL";
  category: PropertyCategory | "ALL";
  cycle: Exclude<RentCycle, "NONE"> | "ALL";
  city: string | "ALL";
}

export const defaultFilters: PropertyFilters = { type: "ALL", category: "ALL", cycle: "ALL", city: "ALL" };

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Whitelists query params so arbitrary input can never reach the filter state. */
export function parseFilters(params: RawParams): PropertyFilters {
  const type = first(params.type);
  const category = first(params.category);
  const cycle = first(params.cycle);
  const city = first(params.city);
  return {
    type: type === "SALE" || type === "RENT" ? type : "ALL",
    category: CATEGORIES.includes(category as PropertyCategory) ? (category as PropertyCategory) : "ALL",
    cycle: RENT_CYCLES.includes(cycle as Exclude<RentCycle, "NONE">) ? (cycle as Exclude<RentCycle, "NONE">) : "ALL",
    city: city && /^[A-Za-z ]{2,40}$/.test(city) ? city : "ALL",
  };
}

export function toQueryString(filters: PropertyFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value !== "ALL") params.set(key, value);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function applyFilters(items: PropertyListing[], f: PropertyFilters) {
  return items.filter(
    (p) =>
      (f.type === "ALL" || p.listingType === f.type) &&
      (f.category === "ALL" || p.category === f.category) &&
      (f.cycle === "ALL" || p.rentCycle === f.cycle) &&
      (f.city === "ALL" || p.city.en === f.city),
  );
}
