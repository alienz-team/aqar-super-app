import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export interface Viewer {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
}

interface ProfileSeed {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
}

/**
 * Creates the Prisma `User` row for a Supabase account if it is missing. New rows are
 * always CLIENT: roles are only ever raised in the database, never from user input.
 */
export async function ensureProfile(seed: ProfileSeed) {
  return prisma.user.upsert({
    where: { id: seed.id },
    create: {
      id: seed.id,
      email: seed.email,
      fullName: seed.fullName?.trim() || null,
      phone: seed.phone?.trim() || null,
      role: "CLIENT",
    },
    update: {},
  });
}

/** The verified signed-in user with their database role, or null. Cached per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  // Always per request: without this, a build with no Supabase keys would prerender
  // auth-gated pages as static "signed out" redirects.
  await connection();
  const supabase = await createClient();
  if (!supabase || !process.env.DATABASE_URL) return null;

  // getClaims verifies the JWT; getSession would trust whatever the cookie says.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub || typeof claims.email !== "string") return null;

  try {
    const meta = (claims.user_metadata ?? {}) as { full_name?: string; phone?: string };
    // Covers accounts whose profile insert failed at sign-up. Metadata only seeds the
    // display name and phone; it is user-editable, so it never decides the role.
    const user = await ensureProfile({ id: claims.sub, email: claims.email, fullName: meta.full_name, phone: meta.phone });
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
  } catch (error) {
    console.error("[auth] could not load profile", error);
    return null;
  }
});

/** For pages that need any signed-in user. */
export async function requireUserPage(next: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

/** For admin pages: signed-out visitors go to /login, signed-in non-admins to their account. */
export async function requireAdminPage() {
  const viewer = await requireUserPage("/admin");
  if (viewer.role !== "ADMIN") redirect("/account?denied=admin");
  return viewer;
}

/** For Server Actions, which can be POSTed to directly and must check on their own. */
export async function assertAdmin() {
  const viewer = await getViewer();
  if (viewer?.role !== "ADMIN") throw new Error("Unauthorized");
  return viewer;
}
