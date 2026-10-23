import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const SESSION_ENDED = "Your admin session has ended. Reload the page and sign in again; your entries were not saved.";

export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="mt-1.5 block text-xs text-down">
      {message}
    </span>
  );
}

/** Label + control + inline error. The label wraps the control, so no id wiring is needed. */
export function FormField({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      {children}
      <ErrorText message={error} />
    </label>
  );
}

export function FormRootError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-sm border border-down/30 bg-down/5 p-3 text-sm text-down">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
