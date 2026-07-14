"use client";

import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const Reader = dynamic(() => import("@/components/reader/Reader"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#3d2b1f" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-700/30 border-t-amber-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-amber-100/40" style={{ fontFamily: "var(--font-serif)" }}>
          Loading Paper Reader...
        </p>
      </div>
    </div>
  ),
});

export default function ReadPage() {
  return (
    <ErrorBoundary
      fallbackTitle="PDF Viewer Error"
      fallbackMessage="The PDF viewer encountered an unexpected error. Your document is safe — try reloading."
    >
      <Reader />
    </ErrorBoundary>
  );
}
