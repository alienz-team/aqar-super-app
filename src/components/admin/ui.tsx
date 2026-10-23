import { AlertTriangle, DatabaseZap } from "lucide-react";
import type { Loaded } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-sm border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="tabular mt-2 font-serif text-4xl">{value}</p>
      {detail && <p className="mt-2 text-xs text-muted">{detail}</p>}
    </div>
  );
}

/** Explains why data is missing and what to do, for the no-db and error states of a `Loaded` read. */
export function LoadNotice({ state, className }: { state: Exclude<Loaded<unknown>, { status: "ok" }>; className?: string }) {
  const noDb = state.status === "no-db";
  const Icon = noDb ? DatabaseZap : AlertTriangle;
  return (
    <div role="status" className={cn("flex gap-4 rounded-sm border border-gold-line bg-surface p-5", className)}>
      <Icon className="mt-0.5 size-5 shrink-0 text-gold-text" aria-hidden />
      <div className="text-sm">
        <p className="font-semibold">{noDb ? "No database connected yet" : "Could not load data"}</p>
        <p className="mt-1 text-muted">
          {noDb ? (
            <>
              Add <code className="font-mono text-ink">DATABASE_URL</code> and <code className="font-mono text-ink">DIRECT_URL</code> to{" "}
              <code className="font-mono text-ink">.env</code>, run <code className="font-mono text-ink">npm run db:push</code>, then
              restart the server. You can still open the forms; saving will work once the database is connected.
            </>
          ) : (
            state.message
          )}
        </p>
      </div>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "gold" | "up" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs border px-2 py-0.5 text-xs font-medium",
        tone === "gold" && "border-gold-line text-gold-text",
        tone === "up" && "border-up/30 text-up",
        tone === "muted" && "border-line text-muted",
      )}
    >
      {children}
    </span>
  );
}
