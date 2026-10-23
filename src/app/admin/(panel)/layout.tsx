import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminPage } from "@/lib/auth/session";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
