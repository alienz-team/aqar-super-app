"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/admin/data";
import { propertySchema, serviceSchema, type ActionResult } from "@/lib/admin/schemas";
import { assertAdmin, endSession, isAdmin, passwordMatches, startSession } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/token";
import { prisma } from "@/lib/prisma";

const NO_DB: ActionResult = {
  ok: false,
  error: "No database is connected. Add DATABASE_URL to .env, run `npm run db:push`, then try again.",
};

function invalid(error: z.ZodError): ActionResult {
  return { ok: false, error: "Some fields need fixing.", fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]> };
}

// Every action re-checks the session: Server Actions can be POSTed to directly.

export async function createProperty(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = propertySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (!isDatabaseConfigured()) return NO_DB;

  const v = parsed.data;
  try {
    await prisma.property.create({
      data: {
        title: v.title,
        description: v.description,
        listingType: v.listingType,
        rentCycle: v.rentCycle,
        category: v.category,
        city: v.city,
        price: v.price,
        areaSqm: v.areaSqm,
        isVip: v.isVip,
        images: v.images,
      },
    });
  } catch (error) {
    console.error("[admin] createProperty failed", error);
    return { ok: false, error: "The property could not be saved. Check the database connection and try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function createService(input: unknown): Promise<ActionResult> {
  await assertAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (!isDatabaseConfigured()) return NO_DB;

  const v = parsed.data;
  try {
    await prisma.service.create({
      data: {
        nameEn: v.nameEn,
        nameAr: v.nameAr,
        description: v.description,
        category: v.category,
        startingPrice: v.startingPrice,
        bookingMode: v.bookingMode,
        isActive: v.isActive,
      },
    });
  } catch (error) {
    console.error("[admin] createService failed", error);
    return { ok: false, error: "The service could not be saved. Check the database connection and try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/services");
  return { ok: true };
}

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "Admin sign-in is not set up. Add ADMIN_PASSWORD and a 32+ character SESSION_SECRET to .env." };
  }
  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    // Slows password guessing; a shared rate limiter belongs here once there is a store for it.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password is not correct." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  if (await isAdmin()) await endSession();
  redirect("/admin/login");
}
