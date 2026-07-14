"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Layers, Feather, Eye, Sparkles, Download } from "lucide-react";
import { textures } from "@/components/textures/textures";
import { type TextureId } from "@/store/reader-store";
import { textureStyles, TextureSVGFilters } from "@/components/textures/TextureEngine";
import { useTheme } from "@/hooks/useTheme";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const serif = { fontFamily: "var(--font-serif)" };

export default function Landing() {
  const [hoveredTexture, setHoveredTexture] = useState<TextureId>("classic-matte");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { isInstallable, promptInstall } = useInstallPrompt();

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper-bg)", color: "var(--text-primary)" }}>
      <TextureSVGFilters />
      {/* ─── HERO ─── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--paper-bg-gradient)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "100px 32px 100px 32px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 64,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left */}
          <motion.div
            style={{ flex: "1 1 0%", minWidth: 0 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <BookOpen size={18} color="var(--accent)" />
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.03em" }}>
                Paper Reader
              </span>
            </div>

            <h1 style={{ ...serif, fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 300, lineHeight: 1.08, marginBottom: 28 }}>
              Reading <em style={{ fontStyle: "italic" }}>feels</em>
              <br />
              like paper.
            </h1>

            <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 440, marginBottom: 36, lineHeight: 1.7 }}>
              A premium PDF reader that transforms digital documents into beautifully
              textured paper. Nine artisan surfaces designed for extended reading.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/read"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  background: "var(--text-primary)",
                  color: "var(--paper-bg)",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                Start Reading <ArrowRight size={16} />
              </Link>
              <a
                href="#textures"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "border-color 0.15s ease",
                }}
              >
                Explore Textures
              </a>
              {isInstallable && (
                <button
                  onClick={promptInstall}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 28px",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    background: "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDark ? "rgba(196,152,26,0.1)" : "rgba(139,105,20,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <Download size={16} /> Install App
                </button>
              )}
            </div>
          </motion.div>

          {/* Right — paper preview */}
          <motion.div
            style={{ flex: "1 1 0%", minWidth: 0, display: "flex", justifyContent: "center" }}
            initial={{ opacity: 0, rotate: -6, y: 20 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div>
              <div
                className="hero-paper"
                style={{ width: 280, borderRadius: 2, position: "relative", ...textureStyles[hoveredTexture] }}
              >
                <div style={{ aspectRatio: "3/4", position: "relative", overflow: "hidden", borderRadius: 2 }}>
                  <div className="paper-edge-light" />
                  <div className="paper-vignette" />
                  <div style={{ position: "relative", zIndex: 10, padding: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ height: 14, background: "var(--border-subtle)", borderRadius: 3, width: "70%" }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "85%" }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "75%" }} />
                    <div style={{ height: 24 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "80%" }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "90%" }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3 }} />
                    <div style={{ height: 24 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3 }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "70%" }} />
                    <div style={{ height: 8, background: "var(--border-subtle)", borderRadius: 3, width: "60%" }} />
                  </div>
                </div>
              </div>
              <motion.div
                key={hoveredTexture}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", marginTop: 24 }}
              >
                <div style={{ ...serif, fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
                  {textures.find((t) => t.id === hoveredTexture)?.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, opacity: 0.5 }}>
                  {textures.find((t) => t.id === hoveredTexture)?.preview}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SCIENCE ─── */}
      <section style={{ padding: "96px 32px", background: "var(--paper-bg)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ ...serif, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 300, marginBottom: 16 }}>
              The science of comfortable reading
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto", lineHeight: 1.65, opacity: 0.65 }}>
              Paper textures aren&apos;t just aesthetic — they reduce eye strain,
              minimize glare, and create a more natural reading cadence.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
            {[
              { icon: <Layers size={22} />, title: "Reduced Glare", desc: "Procedural textures scatter harsh screen reflections, mimicking how real paper diffuses light." },
              { icon: <Feather size={22} />, title: "Warm Tones", desc: "Each texture carries a unique warm palette that reduces blue light exposure during long sessions." },
              { icon: <Eye size={22} />, title: "Visual Depth", desc: "Layered grain and subtle shadows create depth perception that eases focus transitions between pages." },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 16px" }}>
                <div style={{ width: 48, height: 48, margin: "0 auto 20px", borderRadius: 14, background: isDark ? "rgba(196,152,26,0.12)" : "rgba(139,105,20,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  {item.icon}
                </div>
                <h3 style={{ ...serif, fontSize: 18, fontWeight: 500, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, opacity: 0.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEXTURE GALLERY ─── */}
      <section id="textures" style={{ padding: "96px 32px", background: "var(--paper-bg-alt)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              <Sparkles size={14} color="var(--accent)" />
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: 600 }}>
                Paper Surfaces
              </span>
            </div>
            <h2 style={{ ...serif, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 300, marginBottom: 16 }}>
              Nine artisan textures
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.65, opacity: 0.65 }}>
              Each surface is procedurally generated using layered SVG noise,
              gradients, and blend modes — no images, no network requests.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {textures.map((tex) => (
              <div
                key={tex.id}
                className="texture-card"
                onMouseEnter={() => setHoveredTexture(tex.id)}
                style={{ cursor: "default" }}
              >
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", background: "var(--paper-bg)" }}>
                  <div style={{ aspectRatio: "16/10", position: "relative", ...textureStyles[tex.id] }}>
                    <div className="paper-edge-light" />
                    <div className="paper-vignette" />
                    <div style={{ position: "relative", zIndex: 10, padding: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ height: 10, background: "var(--border-subtle)", borderRadius: 2, width: "60%" }} />
                      <div style={{ height: 5, background: "var(--border-subtle)", borderRadius: 2 }} />
                      <div style={{ height: 5, background: "var(--border-subtle)", borderRadius: 2, width: "80%" }} />
                      <div style={{ height: 5, background: "var(--border-subtle)", borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <h3 style={{ ...serif, fontSize: 15, fontWeight: 500 }}>{tex.name}</h3>
                      <span
                        className={`status-chip ${tex.status === "available" ? "status-available" : tex.status === "new" ? "status-new" : "status-coming"}`}
                      >
                        {tex.status === "available" ? "Available" : tex.status === "new" ? "New" : "Soon"}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", opacity: 0.6 }}>
                      {tex.description}
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.03em", opacity: 0.45 }}>
                        {tex.preview}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESIGN PRINCIPLES ─── */}
      <section style={{ padding: "96px 32px", background: "var(--paper-bg)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...serif, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 300, textAlign: "center", marginBottom: 56 }}>
            Design principles
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {[
              { title: "Procedural, not photographic", desc: "Every texture is generated from SVG turbulence filters, layered gradients, and blend modes. Zero network requests, zero image assets, infinite scalability." },
              { title: "Physical depth cues", desc: "Soft shadows, edge lighting, and vignettes simulate how light interacts with real paper — creating the perception of depth on a flat screen." },
              { title: "Calm, not clever", desc: "No animations compete for attention. Transitions are smooth and predictable. The interface disappears so the text can breathe." },
              { title: "Responsive texture", desc: "Textures adapt to the underlying PDF page. The multiply blend mode lets the white page absorb the warm grain naturally." },
            ].map((item, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 12, border: "1px solid var(--border-subtle)", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(250,247,240,0.5)" }}>
                <h3 style={{ ...serif, fontSize: 16, fontWeight: 500, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, opacity: 0.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ padding: "96px 32px", background: "var(--text-primary)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ ...serif, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 300, color: "var(--paper-bg)", marginBottom: 20 }}>
            Ready to read differently?
          </h2>
          <p style={{ fontSize: 15, color: "var(--paper-bg)", marginBottom: 36, lineHeight: 1.65, opacity: 0.5 }}>
            Open a PDF and experience the difference. No accounts, no cloud,
            no tracking — just you and the page.
          </p>
          <Link
            href="/read"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "var(--accent)",
              color: "var(--text-on-dark)",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            Open Paper Reader <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "24px 32px", background: "var(--text-primary)", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.5 }}>Paper Reader</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.4 }}>
            Procedural textures. No tracking. Open source.
          </p>
        </div>
      </footer>
    </div>
  );
}
