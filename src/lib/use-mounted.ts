"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** False during SSR and hydration, true afterwards: gate browser-only output (time zones, theme). */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
