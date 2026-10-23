import type { NextRequest } from "next/server";
import { redirectWithSession, updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 renamed middleware.ts to proxy.ts. This refreshes the Supabase session on
 * every page request and turns signed-out visitors away from /admin and /account.
 * It is an optimistic gate: the pages and Server Actions check the user (and the ADMIN
 * role, read from the database) themselves.
 */
export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const needsUser = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/account";
  if (needsUser && !userId) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + search);
    return redirectWithSession(response, login);
  }
  return response;
}

export const config = {
  // Every route except static assets, images, the service worker and the manifest.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
