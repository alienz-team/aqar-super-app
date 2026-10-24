import type {
  ListingType,
  MaterialType,
  PropertyCategory,
  RentCycle,
  ServiceCategory,
} from "@prisma/client";

export type { ListingType, MaterialType, PropertyCategory, RentCycle, ServiceCategory };

export type Localized = { en: string; ar: string };

/** UI shape of a Prisma `Property` row (price as number instead of Decimal). */
export interface PropertyListing {
  id: string;
  title: Localized;
  description: Localized;
  price: number;
  areaSqm: number;
  city: Localized;
  images: string[];
  isVip: boolean;
  /** Recently listed: shows the "New" badge. */
  isNew?: boolean;
  listingType: ListingType;
  rentCycle: RentCycle;
  category: PropertyCategory;
  bedrooms?: number;
  bathrooms?: number;
}

export interface MaterialQuote {
  materialType: MaterialType;
  nameEn: string;
  nameAr: string;
  unit: Localized;
  unitPrice: number;
  previousPrice: number;
  updatedAt: string;
}

/** Aqaar's six signature services, in display order. */
export type ServiceSectorId = "marketing" | "contracting" | "interior" | "pools" | "security" | "smartHome";

export interface ServiceSector {
  id: ServiceSectorId;
  /** Request-form options; empty for marketing, which sends people to the listings instead. */
  categories: ServiceCategory[];
  /** quote: opens the request form; browse: links to the property listings. */
  mode: "quote" | "browse";
  /** Unsplash photos the sector card and chapter cycle through (3-4, no people). */
  images: string[];
}

export type HeroSlideId = "villa" | "pools" | "landscape" | "interior" | "architecture" | "resort" | "facade";

export interface HeroSlide {
  id: HeroSlideId;
  image: string;
}
