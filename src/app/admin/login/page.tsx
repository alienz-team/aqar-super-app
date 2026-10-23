import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandTile } from "@/components/layout/Logo";
import { isAdmin } from "@/lib/auth/session";
import { isAuthConfigured } from "@/lib/auth/token";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <BrandTile className="size-14" priority />
          <h1 className="mt-5 font-serif text-3xl">AQAR Admin</h1>
          <p className="mt-2 text-sm text-white/60">Sign in to manage listings and services.</p>
        </div>
        {isAuthConfigured() ? (
          <LoginForm />
        ) : (
          <p role="status" className="rounded-sm border border-[#D4AF37]/40 p-4 text-sm text-white/80">
            Admin sign-in is not set up yet. Add <code className="font-mono text-[#D4AF37]">ADMIN_PASSWORD</code> and a 32+ character{" "}
            <code className="font-mono text-[#D4AF37]">SESSION_SECRET</code> to <code className="font-mono">.env</code>, then restart the server.
          </p>
        )}
      </div>
    </div>
  );
}
