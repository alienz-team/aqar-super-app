import { z } from "zod";
import { cities } from "@/lib/mock-data";
import { CATEGORIES, RENT_CYCLES } from "@/lib/property-filters";
import type { PropertyCategory, RentCycle, ServiceCategory } from "@/lib/types";

// Shared by the React Hook Form resolver (browser) and the Server Actions (re-validated on the server).

export const CITY_NAMES = cities.map((c) => c.en) as [string, ...string[]];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "CONSTRUCTION_SKELETON",
  "CONSTRUCTION_FINISHING",
  "DESIGN_3D",
  "SWIMMING_POOL_LANDSCAPE",
  "SOLAR_ENERGY_WATER",
  "SMART_HOME_SECURITY",
  "MAINTENANCE_PLUMBING",
  "MAINTENANCE_ELECTRICAL",
  "MAINTENANCE_AC",
  "MAINTENANCE_POOL",
];

export const MAX_IMAGES = 8;

const money = (label: string) =>
  z
    .number({ error: `Enter the ${label}` })
    .positive(`The ${label} must be more than 0`)
    .max(1_000_000_000, `The ${label} looks too large`);

export const propertySchema = z
  .object({
    title: z.string().trim().min(3, "Use at least 3 characters").max(120, "Keep it under 120 characters"),
    description: z.string().trim().min(10, "Use at least 10 characters").max(2000, "Keep it under 2,000 characters"),
    listingType: z.enum(["SALE", "RENT"]),
    rentCycle: z.enum(["NONE", ...RENT_CYCLES] as [RentCycle, ...RentCycle[]]),
    category: z.enum(CATEGORIES as [PropertyCategory, ...PropertyCategory[]], { error: "Pick a type" }),
    city: z.enum(CITY_NAMES, { error: "Pick a city" }),
    price: money("price"),
    areaSqm: z.number({ error: "Enter the area" }).positive("The area must be more than 0").max(10_000_000),
    isVip: z.boolean(),
    images: z
      .array(z.url({ protocol: /^https$/, error: "Use a full https:// image link" }))
      .max(MAX_IMAGES, `Up to ${MAX_IMAGES} images`),
  })
  .superRefine((v, ctx) => {
    if (v.listingType === "RENT" && v.rentCycle === "NONE") {
      ctx.addIssue({ code: "custom", path: ["rentCycle"], message: "Pick how often rent is paid" });
    }
  })
  // A sale never carries a rent period, whatever the form sent.
  .transform((v) => (v.listingType === "SALE" ? { ...v, rentCycle: "NONE" as const } : v));

export type PropertyInput = z.input<typeof propertySchema>;

export const serviceSchema = z.object({
  nameEn: z.string().trim().min(2, "Use at least 2 characters").max(80, "Keep it under 80 characters"),
  nameAr: z.string().trim().min(2, "Use at least 2 characters").max(80, "Keep it under 80 characters"),
  description: z.string().trim().min(10, "Use at least 10 characters").max(1000, "Keep it under 1,000 characters"),
  category: z.enum(SERVICE_CATEGORIES as [ServiceCategory, ...ServiceCategory[]], { error: "Pick a category" }),
  startingPrice: money("starting price"),
  bookingMode: z.enum(["QUOTE", "TECHNICIAN"]),
  isActive: z.boolean(),
});

export type ServiceInput = z.input<typeof serviceSchema>;

export type ActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
