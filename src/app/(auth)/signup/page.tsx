import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NotConfiguredNotice, SignupForm } from "@/components/auth/AuthForms";
import { getViewer } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const next = safeNext((await searchParams).next);
  if (await getViewer()) redirect(next);

  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;
  return <SignupForm next={next} />;
}
