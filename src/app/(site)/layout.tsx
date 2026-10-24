import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Navbar } from "@/components/layout/Navbar";

/** Public chrome: the admin area under /admin has its own shell. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pb-40 md:pb-0">{children}</main>
      <Footer />
      {/* One fixed dock on mobile: quick actions stacked over the tab bar, so neither covers the other. */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-50 md:hidden">
        <MobileActionBar />
        <MobileNav />
      </div>
      <FloatingActions />
    </>
  );
}
