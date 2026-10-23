import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { ensureProfile } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for links in Supabase emails (sign-up confirmation, email change).
 * The email template must link here with the token hash; see the README notes in .env.example.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const next = safeNext(params.get("next"));

  const supabase = await createClient();
  if (supabase && tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      if (data.user?.email) {
        const meta = (data.user.user_metadata ?? {}) as { full_name?: string; phone?: string };
        await ensureProfile({ id: data.user.id, email: data.user.email, fullName: meta.full_name, phone: meta.phone }).catch((e) =>
          console.error("[auth] profile upsert after confirm failed", e),
        );
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirm", request.url));
}
