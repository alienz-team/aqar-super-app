import type { Metadata } from "next";
import { AccountView, type AccountBooking, type AccountRequest } from "@/components/account/AccountView";
import { requireUserPage } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "My bookings & requests", robots: { index: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const viewer = await requireUserPage("/account");
  const denied = (await searchParams).denied === "admin";

  // Scoped to this user's id from the verified session: never from the URL.
  const [bookings, requests] = await Promise.all([
    prisma.booking.findMany({
      where: { clientId: viewer.id },
      orderBy: { startDate: "desc" },
      take: 50,
      include: { property: { select: { title: true, city: true } } },
    }),
    prisma.serviceRequest.findMany({ where: { clientId: viewer.id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const bookingRows: AccountBooking[] = bookings.map((b) => ({
    id: b.id,
    propertyTitle: b.property.title,
    city: b.property.city,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    totalPrice: b.totalPrice.toNumber(),
    status: b.status,
  }));
  const requestRows: AccountRequest[] = requests.map((r) => ({
    id: r.id,
    category: r.serviceCategory,
    city: r.city,
    createdAt: r.createdAt.toISOString(),
    status: r.status,
  }));

  return <AccountView email={viewer.email} name={viewer.fullName} bookings={bookingRows} requests={requestRows} denied={denied} />;
}
