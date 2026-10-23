import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | AQAR Admin" },
  robots: { index: false, follow: false },
};

/** The console is English and left-to-right whatever language the public site is set to. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" dir="ltr" className="min-h-dvh bg-bg">
      {children}
    </div>
  );
}
