import { AuthShell } from "@/components/auth/AuthShell";

/** Sign-in and sign-up sit outside the public chrome: one photograph, one glass card. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
