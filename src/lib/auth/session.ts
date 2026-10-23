import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSessionToken, verifySessionToken } from "./token";

/** Constant-time comparison; hashing first makes both buffers the same length. */
export function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function startSession() {
  const token = await signSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For pages: sends signed-out visitors to the login screen. */
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** For Server Actions, which are reachable by direct POST and must check on their own. */
export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
