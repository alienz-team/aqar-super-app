"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./config";

let client: SupabaseClient | null = null;

/** Browser client (session in cookies, shared with the server). Null until Supabase is configured. */
export function createClient() {
  const env = supabaseEnv();
  if (!env) return null;
  client ??= createBrowserClient(env.url, env.key);
  return client;
}
