import { z } from "zod";

/** Libyan mobile: 10 digits, 091–095 (Libyana / Al Madar / LTT). Spaces are ignored. */
const libyanMobile = z
  .string()
  .transform((v) => v.replace(/\s/g, ""))
  .pipe(z.string().regex(/^09[1-5]\d{7}$/));

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  // Optional: blank is allowed, but anything typed must be a valid Libyan mobile.
  phone: z.union([z.literal(""), libyanMobile]).transform((v) => v || undefined),
  // Supabase hashes with bcrypt, which ignores bytes past 72.
  password: z.string().min(8).max(72),
});

export const signInSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(72),
});

/** Keys into the `auth.errors` dictionary, so both languages share one set of outcomes. */
export type AuthErrorCode =
  | "notConfigured"
  | "invalidName"
  | "invalidEmail"
  | "invalidPhone"
  | "weakPassword"
  | "badCredentials"
  | "emailNotConfirmed"
  | "rateLimited"
  | "generic";

export interface AuthFormState {
  error?: AuthErrorCode;
  /** Sign-up succeeded but the email must be confirmed first. */
  checkEmail?: boolean;
  /** Echoed back so a failed submit does not wipe what was typed (never the password). */
  values?: { fullName?: string; email?: string; phone?: string };
}

/** Only same-site paths: blocks open redirects such as `//evil.example` or `https://…`. */
export function safeNext(value: unknown, fallback = "/account") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : fallback;
}
