"use client";

import { useCallback } from "react";
import { pdfjsLib } from "@/lib/pdf-worker";
import { useReaderStore } from "@/store/reader-store";
import { searchInWorker } from "@/lib/search-worker";

export function usePDF() {
  const {
    setPdfDoc,
    setTotalPages,
    setToc,
    setCurrentPage,
    setPdfName,
    setPdfUrl,
    setPdfFile,
    setPdfArrayBuffer,
    setLoading,
    setError,
  } = useReaderStore();

  const loadPDF = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setPdfName(file.name);
        setPdfFile(file);
        setPdfArrayBuffer(arrayBuffer);

        const url = URL.createObjectURL(file);
        setPdfUrl(url);

        try {
          const outline = await pdf.getOutline();
          if (outline && outline.length > 0) {
            const tocItems = await Promise.all(
              outline.map(async (item: any) => {
                let page = 1;
                if (item.dest) {
                  try {
                    const dest =
                      typeof item.dest === "string"
                        ? await pdf.getDestination(item.dest)
                        : item.dest;
                    if (dest && dest[0]) {
                      const pageIndex = await pdf.getPageIndex(dest[0]);
                      page = pageIndex + 1;
                    }
                  } catch {
                    // fallback
                  }
                }
                return {
                  title: item.title || "Untitled",
                  page,
                  level: item.level || 0,
                };
              })
            );
            setToc(tocItems);
          }
        } catch {
          // No outline available
        }

        setCurrentPage(1);
        setLoading(false);
        return pdf;
      } catch (err: any) {
        let message = "Failed to load PDF";
        if (err?.name === "PasswordException" || err?.message?.includes("password")) {
          message = "This PDF is password-protected. Please provide an unlocked version.";
        } else if (err?.message?.includes("Invalid") || err?.message?.includes("corrupt")) {
          message = "This file appears to be corrupted or not a valid PDF.";
        } else if (err?.message?.includes("worker") || err?.name === "UnknownError") {
          message = "PDF rendering engine crashed. Please reload the page.";
        } else if (err?.message) {
          message = err.message;
        }
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [setTotalPages, setToc, setCurrentPage, setPdfName, setPdfUrl, setPdfFile, setPdfArrayBuffer, setPdfDoc, setLoading, setError]
  );

  const renderPage = useCallback(
    async (pageNum: number, canvas: HTMLCanvasElement, scale: number) => {
      const doc = useReaderStore.getState().pdfDoc;
      if (!doc) {
        console.warn("No PDF document loaded");
        return;
      }

      try {
        const page = await doc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;
      } catch (err) {
        console.error(`Failed to render page ${pageNum}:`, err);
      }
    },
    []
  );

  const getThumbnail = useCallback(
    async (pageNum: number, width: number): Promise<string | null> => {
      const doc = useReaderStore.getState().pdfDoc;
      if (!doc) return null;

      try {
        const page = await doc.getPage(pageNum);
        const defaultViewport = page.getViewport({ scale: 1 });
        const scale = width / defaultViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        return canvas.toDataURL("image/jpeg", 0.6);
      } catch {
        return null;
      }
    },
    []
  );

  const getTextContent = useCallback(
    async (pageNum: number) => {
      const doc = useReaderStore.getState().pdfDoc;
      if (!doc) return null;
      try {
        const page = await doc.getPage(pageNum);
        return await page.getTextContent();
      } catch {
        return null;
      }
    },
    []
  );

  const searchInPDF = useCallback(
    async (query: string) => {
      const doc = useReaderStore.getState().pdfDoc;
      const pdfData = useReaderStore.getState().pdfArrayBuffer;
      if (!doc || !pdfData || !query.trim()) return [];

      const pages = Array.from({ length: doc.numPages }, (_, i) => i + 1);
      return searchInWorker(query, pdfData, pages);
    },
    []
  );

  return {
    loading: useReaderStore((s) => s.loading),
    error: useReaderStore((s) => s.error),
    loadPDF,
    renderPage,
    getThumbnail,
    getTextContent,
    searchInPDF,
  };
}
