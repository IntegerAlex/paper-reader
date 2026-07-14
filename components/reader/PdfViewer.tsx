"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  EventBus,
  PDFViewer,
  PDFLinkService,
  PDFFindController,
  DownloadManager,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
import { useReaderStore } from "@/store/reader-store";
import { useTheme } from "@/hooks/useTheme";
import { textureStyles } from "@/components/textures/TextureEngine";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

interface PdfViewerProps {
  onDocumentLoaded?: () => void;
}

export default function PdfViewer({ onDocumentLoaded }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PDFViewer | null>(null);
  const linkServiceRef = useRef<PDFLinkService | null>(null);
  const eventBusRef = useRef<EventBus | null>(null);
  const findControllerRef = useRef<PDFFindController | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const pdfFile = useReaderStore((s) => s.pdfFile);
  const texture = useReaderStore((s) => s.texture);
  const setCurrentPage = useReaderStore((s) => s.setCurrentPage);
  const setTotalPages = useReaderStore((s) => s.setTotalPages);
  const setToc = useReaderStore((s) => s.setToc);
  const setPdfDoc = useReaderStore((s) => s.setPdfDoc);
  const setLoading = useReaderStore((s) => s.setLoading);
  const setError = useReaderStore((s) => s.setError);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Track viewer readiness to avoid race conditions
  const [viewerReady, setViewerReady] = useState(false);

  // Callback ref — fires when container is in the DOM
  const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
  }, []);

  // Initialize viewer after mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewerRef.current) return;

    const timer = setTimeout(() => {
      if (!container || viewerRef.current) return;

      try {
        const bus = new EventBus();
        eventBusRef.current = bus;

        const linkService = new PDFLinkService({ eventBus: bus });
        linkServiceRef.current = linkService;

        const findController = new PDFFindController({ linkService, eventBus: bus });
        findControllerRef.current = findController;

        const downloadManager = new DownloadManager();

        let viewerDiv = container.firstElementChild as HTMLDivElement;
        if (!viewerDiv || viewerDiv.tagName !== "DIV") {
          viewerDiv = document.createElement("div");
          viewerDiv.className = "pdfViewer";
          container.appendChild(viewerDiv);
        }

        const viewer = new PDFViewer({
          container,
          viewer: viewerDiv,
          eventBus: bus,
          linkService,
          downloadManager,
          findController,
          removePageBorders: true,
          textLayerMode: 1,
          annotationMode: 1,
          annotationEditorMode: 0,
        });

        viewerRef.current = viewer;
        linkService.setViewer(viewer);

        bus.on("pagechanging", (evt: { pageNumber: number }) => {
          setCurrentPage(evt.pageNumber);
        });

        cleanupRef.current = () => {
          viewer.cleanup();
          viewerRef.current = null;
          linkServiceRef.current = null;
          eventBusRef.current = null;
          findControllerRef.current = null;
        };

        setViewerReady(true);
      } catch (err) {
        console.error("[PdfViewer] Failed to initialize:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [setCurrentPage]);

  // Texture styles from SVG filters
  const texStyle = textureStyles[texture] || textureStyles["classic-matte"];

  // Load PDF
  useEffect(() => {
    if (!pdfFile || !viewerReady || !viewerRef.current || !linkServiceRef.current) return;

    const loadPdf = async () => {
      setLoading(true);
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        linkServiceRef.current!.setDocument(pdf, null);
        viewerRef.current!.setDocument(pdf);
        (viewerRef.current as any).currentScaleValue = "page-fit";

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);

        try {
          const outline = await pdf.getOutline();
          if (outline && outline.length > 0) {
            const tocItems = await Promise.all(
              outline.map(async (item: any) => {
                let page = 1;
                if (item.dest) {
                  try {
                    const dest = typeof item.dest === "string"
                      ? await pdf.getDestination(item.dest)
                      : item.dest;
                    if (dest && dest[0]) {
                      const pageIndex = await pdf.getPageIndex(dest[0]);
                      page = pageIndex + 1;
                    }
                  } catch {}
                }
                return { title: item.title || "Untitled", page, level: item.level || 0 };
              })
            );
            setToc(tocItems);
          }
        } catch {}

        onDocumentLoaded?.();
      } catch (err: any) {
        let message = "Failed to load PDF";
        if (err?.message?.includes("password")) message = "This PDF is password-protected.";
        else if (err?.message) message = err.message;
        setError(message);
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfFile, viewerReady]);

  // Expose methods
  useEffect(() => {
    if (!viewerRef.current || !containerRef.current) return;
    (containerRef.current as any).__pdfViewer = viewerRef.current;
    (containerRef.current as any).__goToPage = (page: number) => {
      viewerRef.current?.scrollPageIntoView({ pageNumber: page });
    };
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: isDark ? "#0a0a0a" : "#e8e0d0" }}>
      <div
        ref={containerCallbackRef}
        className="pdf-viewer-container"
        style={{ position: "absolute", inset: 0 }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          ...texStyle,
          mixBlendMode: "multiply",
          opacity: isDark ? 0.55 : 1,
          zIndex: 999999,
        }}
      />
    </div>
  );
}
