import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./config";

/**
 * Refreshes the auth session on every matched request and returns the response carrying
 * the updated cookies, plus whether a verified user is signed in. Called from src/proxy.ts.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = supabaseEnv();
  if (!env) return { response, userId: null };

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Cache headers stop a CDN from serving one visitor's refreshed cookies to another.
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Nothing may run between creating the client and this call, or sessions can be dropped.
  // getClaims verifies the JWT signature; getSession would trust the cookie blindly.
  const { data } = await supabase.auth.getClaims();
  return { response, userId: (data?.claims?.sub as string | undefined) ?? null };
}

/**
 * A redirect that keeps the refreshed auth cookies and cache headers from `from`;
 * a fresh response would otherwise drop them and sign the visitor out.
 */
export function redirectWithSession(from: NextResponse, url: URL) {
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}
