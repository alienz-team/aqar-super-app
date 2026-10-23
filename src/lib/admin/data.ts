import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/auth/session";

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export type Loaded<T> = { status: "ok"; data: T } | { status: "no-db" } | { status: "error"; message: string };

/** Runs an admin-only read, turning a missing or unreachable database into a renderable state. */
async function load<T>(query: () => Promise<T>): Promise<Loaded<T>> {
  await requireAdminPage();
  if (!isDatabaseConfigured()) return { status: "no-db" };
  try {
    return { status: "ok", data: await query() };
  } catch (error) {
    console.error("[admin] database read failed", error);
    return {
      status: "error",
      message: "The database could not be reached, or its tables are missing. Run `npm run db:push`, then reload.",
    };
  }
}

export interface AdminProperty {
  id: string;
  title: string;
  city: string;
  category: string;
  listingType: string;
  rentCycle: string;
  price: number;
  areaSqm: number;
  isVip: boolean;
  imageCount: number;
  createdAt: string;
}

export function listProperties() {
  return load(async () => {
    const rows = await prisma.property.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return rows.map<AdminProperty>((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      category: p.category,
      listingType: p.listingType,
      rentCycle: p.rentCycle,
      price: p.price.toNumber(),
      areaSqm: p.areaSqm,
      isVip: p.isVip,
      imageCount: p.images.length,
      createdAt: p.createdAt.toISOString(),
    }));
  });
}

export interface AdminService {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  startingPrice: number;
  bookingMode: string;
  isActive: boolean;
  createdAt: string;
}

export function listServices() {
  return load(async () => {
    const rows = await prisma.service.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return rows.map<AdminService>((s) => ({
      id: s.id,
      nameEn: s.nameEn,
      nameAr: s.nameAr,
      category: s.category,
      startingPrice: s.startingPrice.toNumber(),
      bookingMode: s.bookingMode,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
    }));
  });
}

export function getOverview() {
  return load(async () => {
    const [properties, forRent, vip, services, activeServices, openRequests, recent] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { listingType: "RENT" } }),
      prisma.property.count({ where: { isVip: true } }),
      prisma.service.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.serviceRequest.count({ where: { status: "OPEN" } }),
      prisma.property.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, city: true, listingType: true, createdAt: true },
      }),
    ]);
    return {
      properties,
      forRent,
      vip,
      services,
      activeServices,
      openRequests,
      recent: recent.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    };
  });
}
