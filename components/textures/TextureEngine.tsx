"use client";

import { memo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { type TextureId } from "@/store/reader-store";

const FILTERS: Record<string, React.ReactNode> = {
  "classic-matte": (
    <filter id="classic-matte" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="1" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2" result="texture">
        <feDistantLight azimuth="45" elevation="60" />
      </feDiffuseLighting>
    </filter>
  ),
  "whisper-weave": (
    <filter id="whisper-weave" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.35" numOctaves="3" seed="42" result="warp" />
      <feDiffuseLighting in="warp" lightingColor="white" surfaceScale="1.5" result="texture">
        <feDistantLight azimuth="60" elevation="50" />
      </feDiffuseLighting>
    </filter>
  ),
  "sunbaked-parchment": (
    <filter id="sunbaked-parchment" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="6" seed="13" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="#fff5e6" surfaceScale="3.5" result="texture">
        <feDistantLight azimuth="30" elevation="45" />
      </feDiffuseLighting>
    </filter>
  ),
  "saddle-linen": (
    <filter id="saddle-linen" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05 0.55" numOctaves="4" seed="55" result="linen" />
      <feDiffuseLighting in="linen" lightingColor="white" surfaceScale="2.5" result="texture">
        <feDistantLight azimuth="45" elevation="55" />
      </feDiffuseLighting>
    </filter>
  ),
  "painters-press": (
    <filter id="painters-press" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="5" seed="22" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="3" result="texture">
        <feDistantLight azimuth="50" elevation="55" />
      </feDiffuseLighting>
    </filter>
  ),
  "mulberry-veil": (
    <filter id="mulberry-veil" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="88" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="#f8f0f0" surfaceScale="1" result="texture">
        <feDistantLight azimuth="45" elevation="70" />
      </feDiffuseLighting>
    </filter>
  ),
  "vellum-mist": (
    <filter id="vellum-mist" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="44" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1.2" result="texture">
        <feDistantLight azimuth="45" elevation="55" />
      </feDiffuseLighting>
    </filter>
  ),
  "monastic-felt": (
    <filter id="monastic-felt" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="4" seed="77" result="noise" />
      <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2.5" result="texture">
        <feDistantLight azimuth="45" elevation="60" />
      </feDiffuseLighting>
    </filter>
  ),
  "carbon-ledger": (
    <filter id="carbon-ledger" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04 0.008" numOctaves="3" seed="31" result="ruled" />
      <feDiffuseLighting in="ruled" lightingColor="white" surfaceScale="1.8" result="texture">
        <feDistantLight azimuth="45" elevation="65" />
      </feDiffuseLighting>
    </filter>
  ),
};

const TEXTURE_BACKGROUNDS: Record<string, string> = {
  "classic-matte": "linear-gradient(175deg,rgba(247,243,235,0.4) 0%,rgba(240,234,216,0.2) 50%,rgba(236,229,208,0.1) 100%)",
  "whisper-weave": "linear-gradient(170deg,rgba(246,241,230,0.35) 0%,rgba(237,230,213,0.15) 40%,rgba(232,224,204,0.05) 100%)",
  "sunbaked-parchment": "linear-gradient(168deg,rgba(242,232,208,0.5) 0%,rgba(232,217,184,0.3) 35%,rgba(223,201,154,0.2) 70%,rgba(212,188,136,0.08) 100%)",
  "saddle-linen": "linear-gradient(172deg,rgba(237,228,208,0.45) 0%,rgba(224,212,184,0.25) 40%,rgba(213,198,160,0.12) 75%,rgba(200,184,142,0.05) 100%)",
  "painters-press": "linear-gradient(176deg,rgba(245,240,229,0.35) 0%,rgba(236,229,213,0.2) 30%,rgba(229,220,200,0.1) 60%,rgba(221,211,184,0.04) 100%)",
  "mulberry-veil": "linear-gradient(170deg,rgba(240,232,232,0.3) 0%,rgba(232,221,224,0.15) 30%,rgba(223,210,216,0.08) 60%,rgba(216,200,208,0.03) 100%)",
  "vellum-mist": "linear-gradient(175deg,rgba(242,238,234,0.2) 0%,rgba(234,229,223,0.12) 40%,rgba(228,222,214,0.06) 70%,rgba(223,216,207,0.03) 100%)",
  "monastic-felt": "linear-gradient(168deg,rgba(232,224,210,0.5) 0%,rgba(221,212,194,0.35) 35%,rgba(210,200,176,0.2) 65%,rgba(200,188,158,0.08) 100%)",
  "carbon-ledger": "linear-gradient(178deg,rgba(236,238,240,0.35) 0%,rgba(226,229,234,0.2) 35%,rgba(216,220,228,0.1) 65%,rgba(206,212,222,0.04) 100%)",
};

export const textureStyles = Object.fromEntries(
  Object.keys(TEXTURE_BACKGROUNDS).map((id) => [
    id,
    {
      backgroundColor: "#f5f0e8",
      filter: `url(#${id})`,
    },
  ])
) as Record<string, { backgroundColor: string; filter: string }>;

export function TextureSVGFilters() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {Object.entries(FILTERS).map(([key, node]) => (
          <g key={key}>{node}</g>
        ))}
      </defs>
    </svg>
  );
}

interface TextureEngineProps { texture: string; }

const TextureBackground = memo(function TextureBackground({ texture, isDark }: TextureEngineProps & { isDark: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        borderRadius: "inherit",
        zIndex: 2,
        backgroundColor: isDark ? "#1a1610" : "#f5f0e8",
        filter: `url(#${texture})`,
        mixBlendMode: "multiply",
        opacity: isDark ? 0.35 : 1,
        transition: "opacity 0.4s ease, background-color 0.4s ease",
      }}
    />
  );
});

export default function TextureEngine({ texture }: TextureEngineProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <TextureBackground texture={texture} isDark={isDark} />
      {/* Edge light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 3,
          mixBlendMode: "soft-light",
          background: isDark
            ? "linear-gradient(135deg,rgba(255,255,255,0.03) 0%,transparent 40%),linear-gradient(315deg,rgba(255,255,255,0.015) 0%,transparent 30%)"
            : "linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 40%),linear-gradient(315deg,rgba(255,255,255,0.06) 0%,transparent 30%)",
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          zIndex: 4,
          mixBlendMode: "multiply",
          background: isDark
            ? "radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.15) 80%,rgba(0,0,0,0.3) 100%)"
            : "radial-gradient(ellipse at center,transparent 50%,rgba(44,36,22,0.06) 80%,rgba(44,36,22,0.12) 100%)",
        }}
      />
    </>
  );
}
