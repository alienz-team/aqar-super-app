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

export type ServiceSectorId =
  | "contracting"
  | "design3d"
  | "poolsLandscape"
  | "solarWater"
  | "smartHome"
  | "maintenance";

export interface ServiceSector {
  id: ServiceSectorId;
  categories: ServiceCategory[];
  startingPrice: number;
  providers: number;
  mode: "quote" | "technician";
  /** Unsplash cover photo for the sector card. */
  image: string;
}

export type HeroSlideId = "villa" | "construction" | "interior" | "landscape" | "pools" | "maintenance";

export interface HeroSlide {
  id: HeroSlideId;
  image: string;
}
