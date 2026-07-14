"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Search, List, Image, StickyNote, X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Palette, Focus, Maximize, Minimize, Sun, Moon, Monitor, BookOpen } from "lucide-react";
import { useReaderStore, type InkMode } from "@/store/reader-store";
import { usePDF } from "@/hooks/usePDF";
import { useTheme } from "@/hooks/useTheme";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useToast } from "@/components/Toast";
import { textures } from "@/components/textures/textures";
import ThumbnailsTab from "../sidebar/tabs/ThumbnailsTab";
import BookmarksTab from "../sidebar/tabs/BookmarksTab";
import TOCTab from "../sidebar/tabs/TOCTab";
import SearchTab from "../sidebar/tabs/SearchTab";
import AnnotationsTab from "../sidebar/tabs/AnnotationsTab";

type Tab = "thumbnails" | "bookmarks" | "toc" | "search" | "annotations";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "thumbnails", label: "Pages", icon: <Image size={16} /> },
  { id: "bookmarks", label: "Bookmarks", icon: <Bookmark size={16} /> },
  { id: "toc", label: "Contents", icon: <List size={16} /> },
  { id: "search", label: "Search", icon: <Search size={16} /> },
  { id: "annotations", label: "Notes", icon: <StickyNote size={16} /> },
];

function scrollToPage(pageNum: number) {
  const el = document.querySelector(`[data-page="${pageNum}"]`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useIsMobile() {
  return useReaderStore((s) => s.isMobile);
}

export default function Sidebar() {
  const s = useReaderStore();
  const { getThumbnail, searchInPDF } = usePDF();
  const { resolvedTheme, cycleTheme, darkMode } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const ctx = { isDark, currentPage: s.currentPage, setCurrentPage: s.setCurrentPage, scrollToPage };

  const handleFullscreen = () => {
    if (document.fullscreenElement) { document.exitFullscreen(); s.setFullscreen(false); }
    else { document.documentElement.requestFullscreen(); s.setFullscreen(true); }
  };

  const inkModes: { id: InkMode; label: string; icon: React.ReactNode }[] = [
    { id: "default", label: "Default", icon: <BookOpen size={14} /> },
    { id: "sepia", label: "Sepia", icon: <Sun size={14} /> },
    { id: "warm", label: "Warm", icon: <Sun size={14} /> },
    { id: "dark", label: "Dark Ink", icon: <Moon size={14} /> },
  ];

  const handleClose = () => s.setSidebarOpen(false);
  const { containerRef, handleKeyDown } = useFocusTrap<HTMLElement>(
    s.sidebarOpen && isMobile,
    handleClose
  );

  const handleSearch = async (query: string) => {
    const r = await searchInPDF(query);
    s.setSearchResults(r);
    s.setSearchIndex(0);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const page = (e as CustomEvent).detail?.page;
      if (typeof page === "number") s.toggleBookmark(page);
    };
    window.addEventListener("toggle-bookmark", handler);
    return () => window.removeEventListener("toggle-bookmark", handler);
  }, [s.toggleBookmark]);

  return (
    <AnimatePresence>
      {s.sidebarOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="fixed inset-0 z-[39]"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            />
          )}

          <motion.aside
            ref={isMobile ? containerRef : undefined}
            onKeyDown={isMobile ? handleKeyDown : undefined}
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="sidebar-panel fixed left-0 top-0 bottom-0 z-40 flex flex-col"
            style={{ width: isMobile ? "min(85vw, 300px)" : 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation sidebar"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex gap-1" role="tablist" aria-label="Sidebar tabs">
                {TABS.map((t) => {
                  const active = s.sidebarTab === t.id;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active}
                      aria-controls={`tabpanel-${t.id}`}
                      onClick={() => s.setSidebarTab(t.id)}
                      className="flex flex-col items-center gap-0.5 px-1 pt-1.5 pb-1 rounded-lg border-none cursor-pointer transition-colors duration-150"
                      style={{
                        background: active ? "rgba(139,105,20,0.1)" : "transparent",
                        color: active ? "var(--accent)" : "var(--text-muted)",
                      }}
                      title={t.label}
                    >
                      {t.icon}
                      <span className="text-[9px] leading-tight" style={{ fontWeight: active ? 600 : 400 }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleClose}
                aria-label="Close sidebar"
                className="p-1.5 rounded-lg border-none bg-transparent cursor-pointer"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>
            </div>

            {isMobile && (
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center justify-center gap-1 mb-2.5" role="group" aria-label="Page navigation">
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => { const p = Math.max(1, s.currentPage - 1); s.setCurrentPage(p); scrollToPage(p); }}
                    disabled={s.currentPage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <input
                    type="number"
                    value={s.currentPage}
                    onChange={(e) => { const v = parseInt(e.target.value); if (v >= 1 && v <= s.totalPages) { s.setCurrentPage(v); scrollToPage(v); } }}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    aria-label="Current page number"
                    className="w-10 text-center text-xs font-medium bg-transparent border-none outline-none"
                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
                  />
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>/ {s.totalPages}</span>
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => { const p = Math.min(s.totalPages, s.currentPage + 1); s.setCurrentPage(p); scrollToPage(p); }}
                    disabled={s.currentPage >= s.totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1 mb-2.5" role="group" aria-label="Zoom controls">
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => s.setScale(s.scale - 0.25)}
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="text-[11px] min-w-8 text-center" style={{ color: "var(--text-muted)" }}>{Math.round(s.scale * 100)}%</span>
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => s.setScale(s.scale + 0.25)}
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <div className="w-px h-5 mx-1" style={{ background: "var(--border-subtle)" }} />
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => { cycleTheme(); const next = darkMode === "light" ? "dark" : darkMode === "dark" ? "system" : "light"; toast(`Theme: ${next}`, "info"); }}
                    aria-label="Toggle theme"
                  >
                    {darkMode === "light" && <Sun size={14} />}
                    {darkMode === "dark" && <Moon size={14} />}
                    {darkMode === "system" && <Monitor size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1" role="group" aria-label="Appearance controls">
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => {
                      const ids = textures.filter(t => t.status !== "coming").map(t => t.id);
                      const idx = ids.indexOf(s.texture);
                      const next = ids[(idx + 1) % ids.length];
                      s.setTexture(next);
                      toast(`Texture: ${textures.find(t => t.id === next)?.name}`, "info");
                    }}
                    aria-label="Cycle texture"
                  >
                    <Palette size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={() => {
                      const modes: InkMode[] = ["default", "sepia", "warm", "dark"];
                      const idx = modes.indexOf(s.inkMode);
                      s.setInkMode(modes[(idx + 1) % modes.length]);
                    }}
                    aria-label="Cycle ink mode"
                  >
                    {inkModes.find(m => m.id === s.inkMode)?.icon}
                  </button>
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{
                      background: s.focusMode ? "rgba(139,105,20,0.12)" : "transparent",
                      color: s.focusMode ? "var(--accent)" : "var(--text-secondary)",
                    }}
                    onClick={() => s.setFocusMode(!s.focusMode)}
                    aria-label="Toggle focus mode"
                  >
                    <Focus size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center w-[30px] h-[30px] rounded-[7px] border-none cursor-pointer transition-colors duration-150"
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                    onClick={handleFullscreen}
                    aria-label="Toggle fullscreen"
                  >
                    {s.fullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {s.sidebarTab === "thumbnails" && (
                <div id="tabpanel-thumbnails" role="tabpanel" aria-label="Page thumbnails">
                  <ThumbnailsTab {...ctx} totalPages={s.totalPages} sidebarOpen={s.sidebarOpen} sidebarTab={s.sidebarTab} pdfDoc={s.pdfDoc} getThumbnail={getThumbnail} />
                </div>
              )}
              {s.sidebarTab === "bookmarks" && (
                <div id="tabpanel-bookmarks" role="tabpanel" aria-label="Bookmarks">
                  <BookmarksTab {...ctx} bookmarks={s.bookmarks} />
                </div>
              )}
              {s.sidebarTab === "toc" && (
                <div id="tabpanel-toc" role="tabpanel" aria-label="Table of contents">
                  <TOCTab {...ctx} toc={s.toc} />
                </div>
              )}
              {s.sidebarTab === "search" && (
                <div id="tabpanel-search" role="tabpanel" aria-label="Search document">
                  <SearchTab {...ctx} searchResults={s.searchResults} searchIndex={s.searchIndex} setSearchIndex={s.setSearchIndex} onSearch={handleSearch} />
                </div>
              )}
              {s.sidebarTab === "annotations" && (
                <div id="tabpanel-annotations" role="tabpanel" aria-label="Annotations">
                  <AnnotationsTab {...ctx} annotations={s.annotations} pdfArrayBuffer={s.pdfArrayBuffer} setAnnotations={s.setAnnotations} />
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
