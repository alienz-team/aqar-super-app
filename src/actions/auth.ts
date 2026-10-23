"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { ensureProfile, getViewer } from "@/lib/auth/session";
import { safeNext, signInSchema, signUpSchema, type AuthErrorCode, type AuthFormState } from "@/lib/auth/schemas";
import { createClient } from "@/lib/supabase/server";

/** Where confirmation emails send people back to. Must be in Supabase's Redirect URLs allow list. */
async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function authError(message: string | undefined, code: string | undefined): AuthErrorCode {
  if (code === "email_not_confirmed") return "emailNotConfirmed";
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit") return "rateLimited";
  if (code === "weak_password") return "weakPassword";
  if (code === "invalid_credentials" || message?.includes("Invalid login credentials")) return "badCredentials";
  return "generic";
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const values = { fullName: raw.fullName, email: raw.email, phone: raw.phone };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const error: AuthErrorCode =
      field === "fullName" ? "invalidName" : field === "email" ? "invalidEmail" : field === "phone" ? "invalidPhone" : "weakPassword";
    return { error, values };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "notConfigured", values };

  const { fullName, email, phone, password } = parsed.data;
  const next = safeNext(formData.get("next"));
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Display details only: user_metadata is user-editable, so it never grants anything.
      data: { full_name: fullName, phone },
      emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: authError(error.message, error.code), values };

  // An existing email comes back as a placeholder user with no identities; treat it like a
  // normal sign-up so the form never reveals which addresses are registered.
  const isNewAccount = Boolean(data.user && (data.user.identities?.length ?? 0) > 0);
  if (data.user && isNewAccount) {
    try {
      await ensureProfile({ id: data.user.id, email, fullName, phone });
    } catch (profileError) {
      // Not fatal: getViewer() creates the row on the first signed-in request.
      console.error("[auth] profile insert after sign-up failed", profileError);
    }
  }

  // Email confirmation on (Supabase's default): no session until the link is clicked.
  if (!data.session) return { checkEmail: true, values: { email } };
  redirect(next);
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const raw = { email: String(formData.get("email") ?? "").trim().toLowerCase(), password: String(formData.get("password") ?? "") };
  const values = { email: raw.email };
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) return { error: "badCredentials", values };

  const supabase = await createClient();
  if (!supabase) return { error: "notConfigured", values };

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: authError(error.message, error.code), values };

  try {
    const meta = (data.user.user_metadata ?? {}) as { full_name?: string; phone?: string };
    await ensureProfile({ id: data.user.id, email: data.user.email ?? parsed.data.email, fullName: meta.full_name, phone: meta.phone });
  } catch (profileError) {
    console.error("[auth] profile upsert after sign-in failed", profileError);
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/");
}

export interface NavViewer {
  name: string;
  email: string;
  role: Role;
}

/** What the navbar shows. Called from the client so public pages stay statically rendered. */
export async function getNavViewer(): Promise<NavViewer | null> {
  const viewer = await getViewer();
  if (!viewer) return null;
  return { name: viewer.fullName || viewer.email.split("@")[0], email: viewer.email, role: viewer.role };
}
