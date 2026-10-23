"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Overrides the default width, e.g. "max-w-2xl" for long forms. */
  className?: string;
}

/** Native <dialog>: focus trapping, Esc to close and inert background come for free. */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { t } = useLanguage();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-md border border-gold-line border-t-2 border-t-gold bg-surface p-0 text-ink shadow-2xl",
        className,
      )}
    >
      {open && (
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-semibold leading-snug">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.actions.close}
              className="-m-1 rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
