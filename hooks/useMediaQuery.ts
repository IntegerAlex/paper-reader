"use client";

import { useEffect } from "react";
import { useReaderStore } from "@/store/reader-store";

const MOBILE_BREAKPOINT = "(max-width: 640px)";

export function useMediaQuery() {
  const setIsMobile = useReaderStore((s) => s.setIsMobile);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);

    // Consider touch devices with small screens as mobile
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = mq.matches;
    setIsMobile(isSmallScreen || (isTouchDevice && mq.matches));

    const handler = (e: MediaQueryListEvent) => {
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(e.matches || (touch && e.matches));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setIsMobile]);
}
