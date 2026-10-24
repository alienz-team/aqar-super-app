import type { Metadata } from "next";
import Link from "next/link";
import { Building2, HardHat } from "lucide-react";
import { LoadNotice, PageHeader, StatCard } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/primitives";
import { getOverview } from "@/lib/admin/data";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default async function AdminOverviewPage() {
  const state = await getOverview();
  const n = (v: number) => formatNumber(v, "en");

  return (
    <>
      <PageHeader
        title="Overview"
        description="What is live on Aqaar right now."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/properties" className={buttonStyles.secondary}>
              <Building2 className="size-4" aria-hidden />
              Manage properties
            </Link>
            <Link href="/admin/services" className={buttonStyles.secondary}>
              <HardHat className="size-4" aria-hidden />
              Manage services
            </Link>
          </div>
        }
      />

      {state.status !== "ok" ? (
        <LoadNotice state={state} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Properties" value={n(state.data.properties)} detail={`${n(state.data.forRent)} for rent`} />
            <StatCard label="VIP listings" value={n(state.data.vip)} />
            <StatCard label="Services" value={n(state.data.services)} detail={`${n(state.data.activeServices)} visible to clients`} />
            <StatCard label="Open service requests" value={n(state.data.openRequests)} />
          </div>

          <section aria-labelledby="recent-title" className="mt-12">
            <h2 id="recent-title" className="mb-4 font-serif text-2xl">
              Recently added properties
            </h2>
            {state.data.recent.length === 0 ? (
              <p className="rounded-sm border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
                Nothing yet.{" "}
                <Link href="/admin/properties" className="font-medium text-gold-text underline underline-offset-4">
                  Add the first property
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-line rounded-sm border border-line">
                {state.data.recent.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm">
                    <span>
                      <span className="font-medium">{p.title}</span>
                      <span className="block text-xs text-muted">
                        {p.city} · {p.listingType === "RENT" ? "For rent" : "For sale"}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-muted">{dateFormat.format(new Date(p.createdAt))}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}
