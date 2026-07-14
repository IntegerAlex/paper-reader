"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  PanelLeftOpen,
  PanelLeftClose,
  Sun,
  Moon,
  BookOpen,
  Focus,
  Palette,
  Monitor,
  X,
  Printer,
} from "lucide-react";
import { useReaderStore, type InkMode } from "@/store/reader-store";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/components/Toast";
import { textures } from "@/components/textures/textures";
import { textureStyles } from "@/components/textures/TextureEngine";

function scrollToPage(pageNum: number) {
  const el = document.querySelector(`[data-page="${pageNum}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Toolbar() {
  const {
    currentPage, totalPages, setCurrentPage,
    scale, setScale,
    focusMode, setFocusMode,
    sidebarOpen, setSidebarOpen,
    fullscreen, setFullscreen,
    inkMode, setInkMode,
    texture, setTexture,
    pdfName,
    setPdfDoc, setPdfUrl, setPdfFile, setPdfName, setTotalPages, setPdfArrayBuffer,
  } = useReaderStore();

  const { darkMode, cycleTheme } = useTheme();
  const { toast } = useToast();
  const [showTexturePicker, setShowTexturePicker] = useState(false);
  const [showInkPicker, setShowInkPicker] = useState(false);
  const [visible, setVisible] = useState(true);
  const [editingZoom, setEditingZoom] = useState(false);
  const [zoomInput, setZoomInput] = useState("");
  const isMobile = useReaderStore((s) => s.isMobile);

  const isDark = darkMode === "dark" || (darkMode === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (!focusMode) { setVisible(true); return; }
    let t: NodeJS.Timeout;
    const h = (e: MouseEvent) => {
      const near = e.clientY < 80;
      setVisible(near);
      clearTimeout(t);
      if (near) t = setTimeout(() => setVisible(false), 3000);
    };
    window.addEventListener("mousemove", h);
    return () => { window.removeEventListener("mousemove", h); clearTimeout(t); };
  }, [focusMode]);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) { document.exitFullscreen(); setFullscreen(false); }
    else { document.documentElement.requestFullscreen(); setFullscreen(true); }
  }, [setFullscreen]);

  const handleClose = useCallback(() => {
    setPdfDoc(null);
    setPdfUrl(null);
    setPdfFile(null);
    setPdfName("");
    setTotalPages(0);
    setPdfArrayBuffer(null);
    setCurrentPage(1);
  }, [setPdfDoc, setPdfUrl, setPdfFile, setPdfName, setTotalPages, setPdfArrayBuffer, setCurrentPage]);

  const handleFitToWidth = useCallback(() => {
    const pageEl = document.querySelector("[data-page]");
    if (!pageEl) return;
    const container = pageEl.closest(".fixed");
    if (!container) return;
    const pageInner = pageEl.querySelector("div[style*='position: relative']") as HTMLElement;
    if (!pageInner) return;
    const containerWidth = container.clientWidth - 48;
    const pageWidth = pageInner.offsetWidth;
    if (pageWidth > 0) {
      const newScale = (containerWidth / pageWidth) * scale;
      setScale(newScale);
    }
  }, [scale, setScale]);

  const handleFitToPage = useCallback(() => {
    const pageEl = document.querySelector("[data-page]");
    if (!pageEl) return;
    const pageInner = pageEl.querySelector("div[style*='position: relative']") as HTMLElement;
    if (!pageInner) return;
    const availH = window.innerHeight - 120;
    const pageH = pageInner.offsetHeight;
    if (pageH > 0) {
      const newScale = (availH / pageH) * scale;
      setScale(newScale);
    }
  }, [scale, setScale]);

  const handleZoomSubmit = useCallback(() => {
    const v = parseInt(zoomInput, 10);
    if (!isNaN(v) && v >= 50 && v <= 400) {
      setScale(v / 100);
    }
    setEditingZoom(false);
  }, [zoomInput, setScale]);

  const inkModes: { id: InkMode; label: string; icon: React.ReactNode }[] = [
    { id: "default", label: "Default", icon: <BookOpen size={16} /> },
    { id: "sepia", label: "Sepia", icon: <Sun size={16} /> },
    { id: "warm", label: "Warm", icon: <Sun size={16} /> },
    { id: "dark", label: "Dark Ink", icon: <Moon size={16} /> },
  ];

  const toolbarBg = isDark ? "rgba(20,16,10,0.92)" : "rgba(245,240,232,0.88)";
  const toolbarBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.3)";
  const textColor = isDark ? "#b8a88a" : "#5a4d3a";
  const mutedColor = isDark ? "#7a6d5a" : "#8a7d6b";

  const scrubberStyle = `
    input[type="range"].page-scrubber {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 3px;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      background: transparent;
    }
    input[type="range"].page-scrubber::-webkit-slider-runnable-track {
      height: 3px;
      border-radius: 2px;
      background: ${mutedColor};
      opacity: 0.3;
    }
    input[type="range"].page-scrubber::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid ${toolbarBg};
      margin-top: -5.5px;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.1s ease;
    }
    input[type="range"].page-scrubber::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
    input[type="range"].page-scrubber::-moz-range-track {
      height: 3px;
      border-radius: 2px;
      background: ${mutedColor};
      opacity: 0.3;
    }
    input[type="range"].page-scrubber::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent);
      border: 2px solid ${toolbarBg};
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
  `;

  if (isMobile) {
    return (
      <>
        <style>{scrubberStyle}</style>
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-3 left-3 z-50"
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Open controls"
                className="w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer"
                style={{
                  border: `1px solid ${toolbarBorder}`,
                  background: toolbarBg,
                  backdropFilter: "blur(20px)",
                  boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(44,36,22,0.1)",
                }}
              >
                {sidebarOpen ? <X size={18} color={textColor} /> : <PanelLeftOpen size={18} color={textColor} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <style>{scrubberStyle}</style>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-1 px-3 py-2 rounded-2xl"
              style={{
                background: toolbarBg,
                backdropFilter: "blur(20px) saturate(1.2)",
                WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                border: `1px solid ${toolbarBorder}`,
                boxShadow: isDark
                  ? "0 4px 24px rgba(0,0,0,0.3)"
                  : "0 4px 24px rgba(44,36,22,0.08), 0 1px 2px rgba(44,36,22,0.04)",
              }}
            >
              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={handleClose}
                title="Close PDF"
                aria-label="Close PDF"
              >
                <X size={18} />
              </button>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Toggle sidebar (T)"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              </button>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => { const p = Math.max(1, currentPage - 1); setCurrentPage(p); scrollToPage(p); }}
                disabled={currentPage <= 1}
                title="Previous page"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1 && v <= totalPages) { setCurrentPage(v); scrollToPage(v); } }}
                onKeyDown={(e) => { if (e.key === "Enter") { const v = parseInt((e.target as HTMLInputElement).value); if (v >= 1 && v <= totalPages) { setCurrentPage(v); scrollToPage(v); } (e.target as HTMLInputElement).blur(); } }}
                aria-label="Current page number"
                className="w-11 text-center text-[13px] font-medium bg-transparent border-none outline-none"
                style={{ color: textColor, fontFamily: "var(--font-sans)" }}
              />
              <span className="text-xs" style={{ color: mutedColor }}>/</span>
              <span className="text-xs" style={{ color: mutedColor }}>{totalPages}</span>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => { const p = Math.min(totalPages, currentPage + 1); setCurrentPage(p); scrollToPage(p); }}
                disabled={currentPage >= totalPages}
                title="Next page"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <div className="flex items-center gap-1.5 mx-1">
                <input
                  type="range"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (v >= 1 && v <= totalPages) {
                      setCurrentPage(v);
                      scrollToPage(v);
                    }
                  }}
                  className="page-scrubber w-24"
                  aria-label="Page scrubber"
                  title={`Page ${currentPage} of ${totalPages}`}
                />
              </div>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => setScale(scale - 0.25)}
                title="Zoom out (-)"
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>

              {editingZoom ? (
                <input
                  type="number"
                  autoFocus
                  value={zoomInput}
                  onChange={(e) => setZoomInput(e.target.value)}
                  onBlur={handleZoomSubmit}
                  onKeyDown={(e) => { if (e.key === "Enter") handleZoomSubmit(); if (e.key === "Escape") setEditingZoom(false); }}
                  className="w-12 text-center text-[13px] font-medium bg-transparent border-none outline-none"
                  style={{ color: textColor, fontFamily: "var(--font-sans)" }}
                  min={50}
                  max={400}
                  aria-label="Zoom percentage"
                />
              ) : (
                <button
                  className="text-xs font-medium min-w-[44px] text-center bg-transparent border-none cursor-pointer px-1 py-0.5 rounded transition-colors duration-150"
                  style={{ color: textColor, fontFamily: "var(--font-sans)" }}
                  onClick={() => { setEditingZoom(true); setZoomInput(String(Math.round(scale * 100))); }}
                  title="Click to enter zoom level"
                >
                  {Math.round(scale * 100)}%
                </button>
              )}
              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => setScale(scale + 0.25)}
                title="Zoom in (+)"
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <div className="relative">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                  style={{ background: "transparent", color: textColor }}
                  onClick={() => { setShowTexturePicker(!showTexturePicker); setShowInkPicker(false); }}
                  title="Paper texture"
                >
                  <Palette size={18} />
                </button>
                {showTexturePicker && (
                  <div
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded-[14px] p-3 z-[60]"
                    role="menu"
                    aria-label="Paper texture options"
                    style={{
                      width: 256,
                      background: toolbarBg,
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${toolbarBorder}`,
                      boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(44,36,22,0.12)",
                    }}
                  >
                    <div className="text-[11px] font-medium mb-2" style={{ color: mutedColor }}>
                      Texture
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {textures.filter((t) => t.status !== "coming").map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setTexture(t.id); setShowTexturePicker(false); toast(`Texture: ${t.name}`, "success"); }}
                          className="p-2 rounded-lg text-center cursor-pointer"
                          role="menuitem"
                          aria-label={`${t.name} texture`}
                          aria-selected={texture === t.id}
                          style={{
                            border: texture === t.id ? "2px solid var(--accent)" : "2px solid transparent",
                            background: texture === t.id ? "rgba(139,105,20,0.1)" : "transparent",
                          }}
                        >
                          <div className="w-full h-7 rounded mb-1" style={{ ...textureStyles[t.id] }} />
                          <div className="text-[9px]" style={{ color: textColor }}>{t.name.split(" ")[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                  style={{ background: "transparent", color: textColor }}
                  onClick={() => { setShowInkPicker(!showInkPicker); setShowTexturePicker(false); }}
                  title="Ink mode (S)"
                >
                  {inkModes.find((m) => m.id === inkMode)?.icon && (
                    <span style={{ color: textColor }}>{inkModes.find((m) => m.id === inkMode)!.icon}</span>
                  )}
                </button>
                {showInkPicker && (
                  <div
                    className="absolute top-full mt-2 right-0 rounded-[10px] p-1.5 min-w-[120px] z-[60]"
                    role="menu"
                    aria-label="Ink mode options"
                    style={{
                      background: toolbarBg,
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${toolbarBorder}`,
                      boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(44,36,22,0.12)",
                    }}
                  >
                    {inkModes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setInkMode(m.id); setShowInkPicker(false); }}
                        className="flex items-center gap-2 w-full px-2.5 py-[7px] border-none rounded-[7px] cursor-pointer text-xs font-medium text-left"
                        role="menuitem"
                        aria-label={`${m.label} ink mode`}
                        aria-selected={inkMode === m.id}
                        style={{
                          background: inkMode === m.id ? "rgba(139,105,20,0.12)" : "transparent",
                          color: inkMode === m.id ? "var(--accent)" : textColor,
                        }}
                      >
                        <span style={{ color: inkMode === m.id ? "var(--accent)" : textColor }}>{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{
                  background: focusMode ? "rgba(139,105,20,0.15)" : "transparent",
                  color: focusMode ? "var(--accent)" : textColor,
                }}
                onClick={() => setFocusMode(!focusMode)}
                title="Focus mode (D)"
              >
                <Focus size={18} />
              </button>

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={handleFullscreen}
                title="Fullscreen (F)"
              >
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => window.print()}
                title="Print (Ctrl+P)"
                aria-label="Print document"
              >
                <Printer size={18} />
              </button>

              <div className="w-px h-6 mx-1" style={{ background: "var(--border-subtle)" }} />

              <button
                className="flex items-center justify-center w-9 h-9 rounded-[10px] border-none cursor-pointer transition-colors duration-150"
                style={{ background: "transparent", color: textColor }}
                onClick={() => cycleTheme()}
                title={`Theme: ${darkMode}`}
                aria-label="Toggle theme"
              >
                {darkMode === "light" && <Sun size={18} />}
                {darkMode === "dark" && <Moon size={18} />}
                {darkMode === "system" && <Monitor size={18} />}
              </button>
            </div>

            {pdfName && (
              <div className="text-center mt-2">
                <span className="text-[11px] font-medium tracking-wider" style={{ color: isDark ? "rgba(184,168,138,0.5)" : "rgba(138,125,107,0.6)" }}>
                  {pdfName}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
