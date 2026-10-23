import type { Metadata } from "next";
import { CircleCheck, CircleDashed, LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/primitives";
import { isDatabaseConfigured } from "@/lib/admin/data";
import { requireAdminPage } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/token";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdminPage();

  // Only whether each value is set: secrets never leave the server.
  const checks = [
    { label: "Database connection", detail: "DATABASE_URL and DIRECT_URL", ok: isDatabaseConfigured() && Boolean(process.env.DIRECT_URL) },
    { label: "Admin sign-in", detail: "ADMIN_PASSWORD and a 32+ character SESSION_SECRET", ok: isAuthConfigured() },
    {
      label: "Supabase client",
      detail: "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  ];

  return (
    <>
      <PageHeader title="Settings" description="Configuration status for this deployment." />

      <section aria-labelledby="env-title">
        <h2 id="env-title" className="mb-4 font-serif text-2xl">
          Environment
        </h2>
        <ul className="divide-y divide-line rounded-sm border border-line">
          {checks.map((c) => (
            <li key={c.label} className="flex items-start gap-3 px-4 py-4 text-sm">
              {c.ok ? (
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-up" aria-hidden />
              ) : (
                <CircleDashed className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
              )}
              <span>
                <span className="font-medium">{c.label}</span>
                <span className="ms-2 text-xs text-muted">{c.ok ? "Configured" : "Not set"}</span>
                <span className="block text-xs text-muted">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Locally these live in <code className="font-mono">.env</code>. On Vercel, add them under Project Settings → Environment Variables, then redeploy.
        </p>
      </section>

      <section aria-labelledby="session-title" className="mt-12">
        <h2 id="session-title" className="mb-4 font-serif text-2xl">
          Session
        </h2>
        <p className="mb-4 text-sm text-muted">Admin sessions last 8 hours. Changing SESSION_SECRET signs everyone out.</p>
        <form action={logout}>
          <button type="submit" className={buttonStyles.secondary}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </form>
      </section>
    </>
  );
}
