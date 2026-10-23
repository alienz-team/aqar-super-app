import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

/**
 * Optimistic gate for /admin: bounces signed-out visitors before any rendering.
 * Pages and Server Actions still verify the session themselves (src/lib/auth/session.ts).
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const valid = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!valid) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
