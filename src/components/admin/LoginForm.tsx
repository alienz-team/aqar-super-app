"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initial: LoginState = {};

/** Always on the black login screen, so it uses fixed dark colours rather than theme tokens. */
export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-white/70">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          className="w-full rounded-sm border border-white/15 bg-[#141414] px-3 py-2.5 text-white focus:border-[#D4AF37] focus:outline-none"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-[#f87171]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="gold-metal w-full rounded-sm px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
