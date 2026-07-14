"use client";

import { useEffect, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import type { ThumbnailsTabProps } from "../types";

export default function ThumbnailsTab({
  currentPage,
  totalPages,
  sidebarOpen,
  sidebarTab,
  pdfDoc,
  setCurrentPage,
  scrollToPage,
  getThumbnail,
}: ThumbnailsTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const thumbnailQueries = useQueries({
    queries: allPages.map((pageNum) => ({
      queryKey: ["thumbnail", pageNum, 160],
      queryFn: () => getThumbnail(pageNum, 160),
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      enabled: sidebarTab === "thumbnails" && sidebarOpen && !!pdfDoc,
    })),
  });

  const thumbnailMap = new Map<number, string | null>();
  allPages.forEach((pageNum, i) => {
    const q = thumbnailQueries[i];
    if (q?.data) thumbnailMap.set(pageNum, q.data as string);
  });

  useEffect(() => {
    if (sidebarTab !== "thumbnails" || !containerRef.current) return;
    const active = containerRef.current.querySelector(".thumbnail-item.active");
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentPage, sidebarTab]);

  const handleClick = (pageNum: number) => {
    setCurrentPage(pageNum);
    scrollToPage(pageNum);
  };

  return (
    <div
      ref={containerRef}
      style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}
    >
      {allPages.map((pageNum) => {
        const thumb = thumbnailMap.get(pageNum);
        const isLoading =
          thumbnailQueries[allPages.indexOf(pageNum)]?.isLoading;
        return (
          <button
            key={pageNum}
            onClick={() => handleClick(pageNum)}
            className={`thumbnail-item ${currentPage === pageNum ? "active" : ""}`}
            style={{
              width: "100%",
              border: currentPage === pageNum ? "2px solid var(--accent)" : "2px solid transparent",
              padding: 0,
              cursor: "pointer",
              borderRadius: 6,
              overflow: "hidden",
              transition: "border-color 0.15s",
            }}
          >
            <div
              style={{
                aspectRatio: "3/4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "var(--paper-bg-light)",
              }}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={`Page ${pageNum}`}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  loading="lazy"
                />
              ) : isLoading ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--paper-bg) 25%, var(--paper-bg-light) 50%, var(--paper-bg) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    opacity: 0.5,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "var(--paper-bg)",
                    opacity: 0.5,
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                textAlign: "center",
                padding: "4px 0",
                color: currentPage === pageNum ? "var(--accent)" : "var(--text-muted)",
                fontWeight: currentPage === pageNum ? 600 : 500,
              }}
            >
              {pageNum}
            </div>
          </button>
        );
      })}
    </div>
  );
}
