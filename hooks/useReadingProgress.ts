"use client";

import { useState, useEffect, useRef } from "react";
import { useReaderStore } from "@/store/reader-store";

export function useReadingProgress() {
  const totalPages = useReaderStore((s) => s.totalPages);
  const currentPage = useReaderStore((s) => s.currentPage);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (totalPages <= 0) {
      setProgress(0);
      return;
    }

    const findScrollContainer = (): Element | null => {
      const el = document.querySelector("[data-page]");
      if (!el) return null;
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        if (
          style.overflowY === "auto" ||
          style.overflowY === "scroll"
        ) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return document.documentElement;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const container = findScrollContainer();
        if (!container) return;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;

        if (scrollHeight <= 0) {
          setProgress(totalPages > 0 ? (currentPage / totalPages) * 100 : 0);
          return;
        }

        const scrollProgress = (scrollTop / scrollHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollProgress)));
      });
    };

    const container = findScrollContainer();
    if (!container) {
      setProgress(totalPages > 0 ? (currentPage / totalPages) * 100 : 0);
      return;
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [totalPages, currentPage]);

  return progress;
}
