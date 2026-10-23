"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { signIn, signUp } from "@/actions/auth";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { buttonStyles, inputStyles } from "@/components/ui/primitives";
import { interpolate } from "@/dictionaries";
import type { AuthFormState } from "@/lib/auth/schemas";
import { cn } from "@/lib/utils";

const initial: AuthFormState = {};
const fieldInput = cn(inputStyles, "py-3 text-base");

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-muted">
        {label}
        {hint && <span className="text-xs font-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function PasswordInput({ autoComplete }: { autoComplete: "current-password" | "new-password" }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name="password"
        required
        minLength={autoComplete === "new-password" ? 8 : undefined}
        maxLength={72}
        autoComplete={autoComplete}
        className={cn(fieldInput, "pe-11")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={t.auth.showPassword}
        aria-pressed={visible}
        className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted hover:text-ink"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-sm border border-down/30 bg-down/10 p-3 text-sm text-down">
      {message}
    </p>
  );
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-serif text-3xl leading-tight sm:text-4xl rtl:leading-snug">{title}</h1>
      <p className="mt-2 text-sm text-muted">{sub}</p>
    </div>
  );
}

export function LoginForm({ next, linkError }: { next: string; linkError?: "confirm" }) {
  const { t } = useLanguage();
  const [state, action, pending] = useActionState(signIn, initial);
  const error = state.error ? t.auth.errors[state.error] : linkError ? t.auth.errors[linkError] : undefined;

  return (
    <>
      <Heading title={t.auth.loginTitle} sub={t.auth.loginSub} />
      <form action={action} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <Field label={t.auth.email}>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={state.values?.email}
            dir="ltr"
            className={fieldInput}
          />
        </Field>
        <Field label={t.auth.password}>
          <PasswordInput autoComplete="current-password" />
        </Field>
        <FormError message={error} />
        <button type="submit" disabled={pending} className={cn(buttonStyles.gold, "w-full py-3 text-base")}>
          {pending ? t.auth.submittingLogin : t.auth.submitLogin}
        </button>
      </form>
      <p className="mt-7 border-t border-line pt-5 text-center text-sm text-muted">
        {t.auth.noAccount}{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-gold-text underline-offset-4 hover:underline">
          {t.auth.signup}
        </Link>
      </p>
    </>
  );
}

export function SignupForm({ next }: { next: string }) {
  const { t } = useLanguage();
  const [state, action, pending] = useActionState(signUp, initial);

  if (state.checkEmail) {
    return (
      <div role="status" className="text-center">
        <MailCheck className="mx-auto size-12 text-gold-text" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-5 font-serif text-3xl">{t.auth.checkEmailTitle}</h1>
        <p className="mt-3 text-sm text-muted">
          {interpolate(t.auth.checkEmailBody, { email: state.values?.email ?? "" })}
        </p>
        <Link href={`/login?next=${encodeURIComponent(next)}`} className={cn(buttonStyles.secondary, "mt-7")}>
          {t.auth.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Heading title={t.auth.signupTitle} sub={t.auth.signupSub} />
      <form action={action} className="space-y-5">
        <input type="hidden" name="next" value={next} />
        <Field label={t.auth.fullName}>
          <input name="fullName" required minLength={2} maxLength={80} autoComplete="name" defaultValue={state.values?.fullName} className={fieldInput} />
        </Field>
        <Field label={t.auth.email}>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={state.values?.email}
            dir="ltr"
            className={fieldInput}
          />
        </Field>
        <Field label={t.auth.phoneOptional} hint={t.auth.phoneHint}>
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="091 234 5678"
            defaultValue={state.values?.phone}
            dir="ltr"
            className={cn(fieldInput, "tabular")}
          />
        </Field>
        <Field label={t.auth.password} hint={t.auth.passwordHint}>
          <PasswordInput autoComplete="new-password" />
        </Field>
        <FormError message={state.error ? t.auth.errors[state.error] : undefined} />
        <button type="submit" disabled={pending} className={cn(buttonStyles.gold, "w-full py-3 text-base")}>
          {pending ? t.auth.submittingSignup : t.auth.submitSignup}
        </button>
      </form>
      <p className="mt-7 border-t border-line pt-5 text-center text-sm text-muted">
        {t.auth.haveAccount}{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-gold-text underline-offset-4 hover:underline">
          {t.auth.login}
        </Link>
      </p>
    </>
  );
}

export function NotConfiguredNotice() {
  const { t } = useLanguage();
  return (
    <p role="status" className="rounded-sm border border-gold-line p-4 text-sm text-muted">
      {t.auth.errors.notConfigured}
    </p>
  );
}
