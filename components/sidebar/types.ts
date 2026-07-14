"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";
import type { Annotation, Bookmark } from "@/lib/storage";

// Shared context passed to all tab components
export interface TabContext {
  isDark: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  scrollToPage: (page: number) => void;
}

export interface ThumbnailsTabProps extends TabContext {
  totalPages: number;
  sidebarOpen: boolean;
  sidebarTab: string;
  pdfDoc: PDFDocumentProxy | null;
  getThumbnail: (page: number, width: number) => Promise<string | null>;
}

export interface BookmarksTabProps extends TabContext {
  bookmarks: Bookmark[];
}

export interface TOCTabProps extends TabContext {
  toc: { title: string; page: number; level: number }[];
}

export interface SearchTabProps extends TabContext {
  searchResults: { page: number; index: number }[];
  searchIndex: number;
  setSearchIndex: (index: number) => void;
  onSearch: (query: string) => Promise<void>;
}

export interface AnnotationsTabProps extends TabContext {
  annotations: Annotation[];
  pdfArrayBuffer: ArrayBuffer | null;
  setAnnotations: (annotations: Annotation[]) => void;
}
