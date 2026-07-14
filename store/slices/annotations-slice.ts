import type { StateCreator } from "zustand";
import type { ReaderState } from "../reader-store";
import type { Annotation } from "@/lib/storage";

export interface AnnotationsSlice {
  bookmarks: { page: number; label: string; createdAt: number }[];
  annotations: Annotation[];
  toc: { title: string; page: number; level: number }[];

  setBookmarks: (b: ReaderState["bookmarks"]) => void;
  setAnnotations: (a: ReaderState["annotations"]) => void;
  setToc: (t: ReaderState["toc"]) => void;
  toggleBookmark: (page: number) => void;
  addAnnotation: (a: ReaderState["annotations"][0]) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<ReaderState["annotations"][0]>) => void;
}

export const createAnnotationsSlice: StateCreator<ReaderState, [], [], AnnotationsSlice> = (set, get) => ({
  bookmarks: [],
  annotations: [],
  toc: [],

  setBookmarks: (b) => set({ bookmarks: b }),
  setAnnotations: (a) => set({ annotations: a }),
  setToc: (t) => set({ toc: t }),

  toggleBookmark: (page) => {
    const { bookmarks } = get();
    const existing = bookmarks.find((b) => b.page === page);
    if (existing) {
      set({ bookmarks: bookmarks.filter((b) => b.page !== page) });
    } else {
      set({
        bookmarks: [
          ...bookmarks,
          { page, label: `Page ${page}`, createdAt: Date.now() },
        ],
      });
    }
  },

  addAnnotation: (a) => set({ annotations: [...get().annotations, a] }),

  removeAnnotation: (id) =>
    set({ annotations: get().annotations.filter((a) => a.id !== id) }),

  updateAnnotation: (id, updates) =>
    set({
      annotations: get().annotations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }),
});
