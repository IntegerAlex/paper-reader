"use client";

import { useEffect } from "react";

/**
 * Registers the service worker for PWA offline support.
 * Only runs in production and in browsers that support service workers.
 */
export default function SWRegistration() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  }, []);

  return null;
}
