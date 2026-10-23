import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";

/** Public chrome: the admin area under /admin has its own shell. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
