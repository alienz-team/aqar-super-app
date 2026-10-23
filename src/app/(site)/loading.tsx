/** Route-change placeholder: the logo mark breathing on a faint blueprint grid. */
export default function Loading() {
  return (
    <div role="status" className="relative isolate flex min-h-[60vh] items-center justify-center">
      <div
        aria-hidden
        className="blueprint absolute inset-0 -z-10 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />
      <span aria-hidden className="brand-mark mark-breathe block h-24 w-21 text-gold-text" />
      <span className="sr-only">
        Loading… <span lang="ar">جارٍ التحميل…</span>
      </span>
    </div>
  );
}
