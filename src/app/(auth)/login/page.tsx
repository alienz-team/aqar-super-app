import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm, NotConfiguredNotice } from "@/components/auth/AuthForms";
import { getViewer } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await getViewer()) redirect(next);

  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;
  return <LoginForm next={next} linkError={params.error === "confirm" ? "confirm" : undefined} />;
}
