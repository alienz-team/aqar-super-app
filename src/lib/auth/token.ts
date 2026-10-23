import { jwtVerify, SignJWT } from "jose";

/** Kept free of next/headers so proxy.ts can import it too. */
export const SESSION_COOKIE = "aqar_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

const MIN_SECRET_LENGTH = 32;

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) return null;
  return new TextEncoder().encode(secret);
}

export function isAuthConfigured() {
  return secretKey() !== null && Boolean(process.env.ADMIN_PASSWORD);
}

export async function signSessionToken() {
  const key = secretKey();
  if (!key) throw new Error("SESSION_SECRET is missing or shorter than 32 characters.");
  return new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

/** True only for an unexpired token signed with our secret that carries the admin role. */
export async function verifySessionToken(token: string | undefined) {
  const key = secretKey();
  if (!token || !key) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.role === "ADMIN";
  } catch {
    return false;
  }
}
