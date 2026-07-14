"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, Trash2, BookOpen, HelpCircle } from "lucide-react";
import { useReaderStore } from "@/store/reader-store";
import { usePDF } from "@/hooks/usePDF";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import PdfViewer from "./PdfViewer";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import { TextureSVGFilters, textureStyles } from "@/components/textures/TextureEngine";
import {
  getBookmarks,
  setBookmarks as saveBookmarks,
  getAnnotations,
  setAnnotations as saveAnnotations,
  getRecentDocs,
  addRecentDoc,
  removeRecentDoc,
  type RecentDoc,
} from "@/lib/storage";

const RECENT_DOC_DEBOUNCE_MS = 2000;

const SHORTCUTS = [
  { keys: "\u2190 \u2192", desc: "Prev/Next page" },
  { keys: "+ \u2212", desc: "Zoom in/out" },
  { keys: "0", desc: "Reset zoom" },
  { keys: "F", desc: "Fullscreen" },
  { keys: "T", desc: "Sidebar" },
  { keys: "B", desc: "Bookmark" },
  { keys: "D", desc: "Focus mode" },
  { keys: "S", desc: "Ink mode" },
  { keys: "Esc", desc: "Close" },
];

export default function Reader() {
  const pdfDoc = useReaderStore((s) => s.pdfDoc);
  const currentPage = useReaderStore((s) => s.currentPage);
  const totalPages = useReaderStore((s) => s.totalPages);
  const texture = useReaderStore((s) => s.texture);
  const focusMode = useReaderStore((s) => s.focusMode);
  const sidebarOpen = useReaderStore((s) => s.sidebarOpen);
  const pdfName = useReaderStore((s) => s.pdfName);
  const bookmarks = useReaderStore((s) => s.bookmarks);
  const annotations = useReaderStore((s) => s.annotations);
  const setBookmarks = useReaderStore((s) => s.setBookmarks);
  const setAnnotations = useReaderStore((s) => s.setAnnotations);

  const { loadPDF, error: pdfError } = usePDF();
  useKeyboard();
  const progress = useReadingProgress();
  const [dragOver, setDragOver] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDoc[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const recentDocTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setRecentDocs(getRecentDocs()); }, []);

  useEffect(() => {
    if (pdfName) { setBookmarks(getBookmarks(pdfName)); setAnnotations(getAnnotations(pdfName)); }
  }, [pdfName]);

  useEffect(() => { if (pdfName) saveBookmarks(pdfName, bookmarks); }, [bookmarks, pdfName]);
  useEffect(() => { if (pdfName) saveAnnotations(pdfName, annotations); }, [annotations, pdfName]);

  useEffect(() => {
    if (!pdfName || totalPages <= 0) return;

    if (recentDocTimerRef.current) {
      clearTimeout(recentDocTimerRef.current);
    }

    recentDocTimerRef.current = setTimeout(() => {
      addRecentDoc({ id: pdfName, name: pdfName, size: 0, lastOpened: Date.now(), page: currentPage, totalPages });
      setRecentDocs(getRecentDocs());
    }, RECENT_DOC_DEBOUNCE_MS);

    return () => {
      if (recentDocTimerRef.current) {
        clearTimeout(recentDocTimerRef.current);
      }
    };
  }, [currentPage, pdfName, totalPages]);

  const handleFileLoad = useCallback(async (file: File) => {
    await loadPDF(file);
    setRecentDocs(getRecentDocs());
  }, [loadPDF]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") handleFileLoad(file);
  }, [handleFileLoad]);

  const isMobile = useReaderStore((s) => s.isMobile);

  if (!pdfDoc) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className="min-h-screen flex flex-col items-center justify-center relative p-10 5"
        role="main"
        aria-label="PDF upload area"
        style={{ background: "var(--desk-gradient)" }}
      >
        <div className="text-center mb-12">
          <div className="w-40 h-52 mx-auto mb-7 relative">
            <div
              className="absolute inset-0 rounded-[3px] -rotate-[4deg]"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.3)", background: "var(--paper-bg)", ...textureStyles[texture] }}
            />
            <div
              className="absolute inset-1.5 rounded-[3px] rotate-[1deg] flex items-center justify-center"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", background: "var(--paper-bg-light)", ...textureStyles[texture] }}
            >
              <span className="font-serif text-2xl" style={{ color: "var(--text-muted)", opacity: 0.3 }}>PDF</span>
            </div>
          </div>
          <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-cream-dark)" }}>Paper Reader</h1>
          <p className="text-sm max-w-80 leading-relaxed mb-7" style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}>
            Drop a PDF here or click to open.
          </p>
          <label className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] text-sm font-medium cursor-pointer" style={{ background: "rgba(139,105,20,0.9)", color: "var(--paper-bg)" }} aria-label="Choose PDF file">
            <BookOpen size={16} /> Choose PDF
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileLoad(f); }} aria-label="Upload PDF file" />
          </label>
          {pdfError && (
            <div className="mt-4 px-4 py-2.5 rounded-lg text-[13px] max-w-90" style={{ background: "rgba(180,60,40,0.12)", border: "1px solid rgba(180,60,40,0.25)", color: "#c07060" }}>
              {pdfError}
            </div>
          )}
        </div>

        {recentDocs.length > 0 && (
          <div className="w-full max-w-110">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} color="var(--color-cream-dark)" style={{ opacity: 0.3 }} />
              <span className="text-[12px] font-medium" style={{ color: "var(--color-cream-dark)", opacity: 0.3 }}>Recent</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {recentDocs.slice(0, 5).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px]" style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.06)" }}>
                  <FileText size={16} color="var(--color-cream-dark)" style={{ opacity: 0.3 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate" style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}>{doc.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--color-cream-dark)", opacity: 0.25 }}>Page {doc.page} of {doc.totalPages}</div>
                  </div>
                  <button onClick={() => { removeRecentDoc(doc.id); setRecentDocs(getRecentDocs()); }} className="p-1 bg-transparent border-none cursor-pointer" style={{ color: "var(--color-cream-dark)", opacity: 0.2 }} aria-label={`Remove ${doc.name} from recent documents`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {dragOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-[100]" style={{ background: "rgba(139,105,20,0.15)" }} role="alert" aria-label="Drop PDF file here">
              <div className="border-[3px] border-dashed rounded-[20px] px-20 py-[60px] text-center" style={{ borderColor: "rgba(196,152,26,0.6)" }}>
                <BookOpen size={40} color="var(--accent-light)" className="mb-3" />
                <div className="font-serif text-[22px]" style={{ color: "var(--accent-light)" }}>Drop PDF here</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className="min-h-screen relative"
      role="main"
      aria-label="PDF reader"
      style={{ background: "var(--desk-gradient)" }}
    >
      <TextureSVGFilters />

      <div
        className="fixed top-0 left-0 h-0.5 z-[100]"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${Math.round(progress)}%`}
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
          transition: "width 0.15s linear",
        }}
      />

      <Toolbar />
      <Sidebar />

      <div style={{ marginLeft: !isMobile && sidebarOpen ? 300 : 0, transition: "margin-left 0.3s ease" }}>
        <PdfViewer />
      </div>

      <div className={`fixed left-1/2 -translate-x-1/2 z-30 ${isMobile ? "bottom-2.5" : "bottom-4"}`}>
        <div
          className="glass-toolbar rounded-full flex items-center"
          role="status"
          aria-label={`Page ${currentPage} of ${totalPages}`}
          style={{
            padding: isMobile ? "5px 12px" : "6px 16px",
            gap: isMobile ? 8 : 12,
            fontSize: isMobile ? 10 : 11,
            color: "var(--color-ink-muted)",
            transition: "opacity 0.25s",
            opacity: focusMode ? 0.3 : 1,
          }}
        >
          <span>\u2190 \u2192</span>
          <span style={{ color: "var(--border-subtle)" }}>|</span>
          <span>{currentPage} / {totalPages}</span>
          {bookmarks.some((b) => b.page === currentPage) && <span style={{ color: "var(--accent)", fontSize: isMobile ? 9 : 10 }}>\u2605</span>}

          {!isMobile && (
            <>
              <span style={{ color: "var(--border-subtle)" }}>|</span>
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="flex items-center gap-1 bg-transparent border-none cursor-pointer transition-opacity duration-150"
                style={{ color: "var(--color-ink-muted)", padding: "2px 4px", borderRadius: 4 }}
                title="Keyboard shortcuts"
                aria-label="Keyboard shortcuts"
              >
                <HelpCircle size={12} />
              </button>
            </>
          )}
        </div>

        <AnimatePresence>
          {showShortcuts && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl p-3 z-[70]"
              style={{
                background: "var(--popover-bg, rgba(20,16,10,0.95))",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--popover-border, rgba(255,255,255,0.08))",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                minWidth: 200,
              }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
                Keyboard Shortcuts
              </div>
              <div className="flex flex-col gap-1">
                {SHORTCUTS.map(({ keys, desc }) => (
                  <div key={desc} className="flex items-center justify-between gap-4 text-[11px]">
                    <span style={{ color: "var(--color-ink-muted, #8a7d6b)" }}>{desc}</span>
                    <kbd
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--color-ink-muted, #8a7d6b)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
