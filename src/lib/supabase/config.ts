/**
 * Public Supabase settings. The publishable key is the current name; the legacy anon key
 * is accepted so older .env files keep working. Both are safe to ship to the browser.
 */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured() {
  return supabaseEnv() !== null;
}
