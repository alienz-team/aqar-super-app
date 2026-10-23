import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * TEMPORARY one-off: creates the first admin in Supabase Auth and the Prisma `User` table.
 * Delete this folder once the admin exists.
 *
 * Locked down because it holds the service-role key, which bypasses all database security:
 * - development only (`npm run dev`): 404 in any production build, so deploying it is inert;
 * - only answers requests made from this machine;
 * - credentials come from .env (git-ignored), never from this file or the URL.
 */
export const dynamic = "force-dynamic";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  // nextUrl.hostname is always "localhost" under `next dev`; the Host header is what the browser used.
  // A convenience check, not a security boundary (the header is client-set): the real protection is
  // dev-only + this route never returning anything secret.
  const host = (request.headers.get("host") ?? "").replace(/:\d+$/, "");
  if (!LOCAL_HOSTS.has(host)) {
    return NextResponse.json({ ok: false, error: "Open this from the machine running the dev server (http://localhost:3000)." }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SETUP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SETUP_ADMIN_PASSWORD;
  const fullName = process.env.SETUP_ADMIN_NAME?.trim() || "Admin";
  if (!url || !serviceKey || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SETUP_ADMIN_EMAIL and SETUP_ADMIN_PASSWORD in .env." },
      { status: 500 },
    );
  }

  // Server-side admin client: no session storage, no token refresh.
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  let user: User | null = null;
  let created = false;
  const result = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (result.data.user) {
    user = result.data.user;
    created = true;
  } else if (result.error?.code === "email_exists" || result.error?.status === 422) {
    // Re-running after a partial failure: reuse the existing account, leave its password alone.
    user = await findUserByEmail(admin.auth.admin, email);
  }
  if (!user) {
    return NextResponse.json({ ok: false, step: "supabase-auth", error: result.error?.message ?? "User not found" }, { status: 500 });
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: { id: user.id, email, fullName, role: "ADMIN" },
    });
  } catch (error) {
    console.error("[setup-admin] prisma upsert failed", error);
    return NextResponse.json(
      {
        ok: false,
        step: "database",
        authUser: created ? "created" : "already existed",
        error: "The Supabase account is ready, but the database write failed. Fix DATABASE_URL, run `npx prisma db push`, then open this URL again.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `${email} is an ADMIN. Log in at /login, then delete src/app/api/setup-admin.`,
    authUser: created ? "created" : "already existed",
    userId: user.id,
  });
}

async function findUserByEmail(adminApi: SupabaseClient["auth"]["admin"], email: string) {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await adminApi.listUsers({ page, perPage: 200 });
    if (error) return null;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
  return null;
}
