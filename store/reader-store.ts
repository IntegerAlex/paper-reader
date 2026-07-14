import { create } from "zustand";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { Annotation } from "@/lib/storage";
import { createPdfSlice, type PdfSlice } from "./slices/pdf-slice";
import { createUiSlice, type UiSlice } from "./slices/ui-slice";
import { createAnnotationsSlice, type AnnotationsSlice } from "./slices/annotations-slice";
import { createSearchSlice, type SearchSlice } from "./slices/search-slice";

export type TextureId =
  | "classic-matte"
  | "whisper-weave"
  | "sunbaked-parchment"
  | "saddle-linen"
  | "painters-press"
  | "mulberry-veil"
  | "vellum-mist"
  | "monastic-felt"
  | "carbon-ledger";

export type InkMode = "default" | "sepia" | "warm" | "dark";

export type ReaderState = PdfSlice & UiSlice & AnnotationsSlice & SearchSlice;

export const useReaderStore = create<ReaderState>()((...a) => ({
  ...createPdfSlice(...a),
  ...createUiSlice(...a),
  ...createAnnotationsSlice(...a),
  ...createSearchSlice(...a),
}));
