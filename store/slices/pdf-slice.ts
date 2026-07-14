import type { StateCreator } from "zustand";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { ReaderState } from "../reader-store";

export interface PdfSlice {
  pdfDoc: PDFDocumentProxy | null;
  pdfFile: File | null;
  pdfArrayBuffer: ArrayBuffer | null;
  pdfUrl: string | null;
  pdfName: string;
  totalPages: number;
  currentPage: number;
  scale: number;
  loading: boolean;
  error: string | null;

  setPdfDoc: (doc: PDFDocumentProxy | null) => void;
  setPdfFile: (file: File | null) => void;
  setPdfArrayBuffer: (buf: ArrayBuffer | null) => void;
  setPdfUrl: (url: string | null) => void;
  setPdfName: (name: string) => void;
  setTotalPages: (n: number) => void;
  setCurrentPage: (n: number) => void;
  setScale: (s: number) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
}

export const createPdfSlice: StateCreator<ReaderState, [], [], PdfSlice> = (set, get) => ({
  pdfDoc: null,
  pdfFile: null,
  pdfArrayBuffer: null,
  pdfUrl: null,
  pdfName: "",
  totalPages: 0,
  currentPage: 1,
  scale: 1.5,
  loading: false,
  error: null,

  setPdfDoc: (doc) => set({ pdfDoc: doc }),
  setPdfFile: (file) => set({ pdfFile: file }),
  setPdfArrayBuffer: (buf) => set({ pdfArrayBuffer: buf }),
  setPdfUrl: (url) => set({ pdfUrl: url }),
  setPdfName: (name) => set({ pdfName: name }),
  setTotalPages: (n) => set({ totalPages: n }),
  setCurrentPage: (n) => {
    const { totalPages } = get();
    set({ currentPage: Math.max(1, Math.min(totalPages || 1, n)) });
  },
  setScale: (s) => set({ scale: Math.max(0.5, Math.min(4, s)) }),
  setLoading: (l) => set({ loading: l }),
  setError: (e) => set({ error: e }),
});
