import { cn } from "@/lib/utils";

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-4 py-2.5 text-sm font-semibold tracking-wide text-brand-ink transition-opacity hover:opacity-90 disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-sm border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-gold",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-sm px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink",
  /** Brushed gold in both themes: reserved for committing to a booking. */
  gold:
    "gold-metal inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_0_0_1px_rgb(168_132_31/0.6)] transition-[filter] hover:brightness-110 active:brightness-95 disabled:opacity-50",
};

/** Section break drawn like the logo's roofline: two hairlines meeting at a gable. */
export function BlueprintDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-3 text-gold-text", className)}>
      <span className="h-px flex-1 bg-gold-line" />
      <svg viewBox="0 0 28 14" className="h-3.5 w-7" fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M1 13 14 1.5 27 13M7 13V8M21 13V8M14 1.5V13" />
      </svg>
      <span className="h-px flex-1 bg-gold-line" />
    </div>
  );
}

export const inputStyles =
  "w-full rounded-sm border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-gold focus:outline-none";

export function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

/** Radio group styled as a pill switch. */
export function Segmented<T extends string>({ label, value, options, onChange, className }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-sm border border-line bg-bg p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-xs px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-brand text-brand-ink" : "text-muted hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[2rem] sm:leading-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Libyan mobile: 10 digits, 091–095 (Libyana / Al Madar / LTT). */
export function isValidLibyanMobile(phone: string) {
  return /^09[1-5]\d{7}$/.test(phone.replace(/\s/g, ""));
}

export function makeReference(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}
