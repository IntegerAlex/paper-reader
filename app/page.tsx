"use client";

import dynamic from "next/dynamic";

const Landing = dynamic(() => import("@/components/landing/Landing"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5f0e8" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-700/20 border-t-amber-700/60 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-ink-muted/50" style={{ fontFamily: "var(--font-serif)" }}>
          Paper Reader
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Landing />;
}
