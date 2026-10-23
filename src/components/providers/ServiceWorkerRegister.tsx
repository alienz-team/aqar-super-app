"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Dev builds change constantly; a caching worker there only causes stale pages.
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
      console.error("Service worker registration failed", err);
    });
  }, []);

  return null;
}
