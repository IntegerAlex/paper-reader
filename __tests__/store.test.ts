import { describe, it, expect, beforeEach } from "vitest";
import { useReaderStore } from "@/store/reader-store";

describe("reader-store", () => {
  beforeEach(() => {
    useReaderStore.setState({
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
      texture: "classic-matte",
      sidebarOpen: false,
      sidebarTab: "thumbnails",
      focusMode: false,
      fullscreen: false,
      inkMode: "default",
      darkMode: "system",
      bookmarks: [],
      annotations: [],
      searchResults: [],
      searchIndex: 0,
      toc: [],
    });
  });

  describe("setCurrentPage", () => {
    it("sets page within bounds", () => {
      useReaderStore.getState().setTotalPages(10);
      useReaderStore.getState().setCurrentPage(5);
      expect(useReaderStore.getState().currentPage).toBe(5);
    });

    it("clamps to minimum of 1", () => {
      useReaderStore.getState().setTotalPages(10);
      useReaderStore.getState().setCurrentPage(0);
      expect(useReaderStore.getState().currentPage).toBe(1);
    });

    it("clamps to maximum totalPages", () => {
      useReaderStore.getState().setTotalPages(10);
      useReaderStore.getState().setCurrentPage(15);
      expect(useReaderStore.getState().currentPage).toBe(10);
    });

    it("clamps to 1 when totalPages is 0", () => {
      useReaderStore.getState().setCurrentPage(5);
      expect(useReaderStore.getState().currentPage).toBe(1);
    });
  });

  describe("setScale", () => {
    it("clamps to minimum 0.5", () => {
      useReaderStore.getState().setScale(0.1);
      expect(useReaderStore.getState().scale).toBe(0.5);
    });

    it("clamps to maximum 4", () => {
      useReaderStore.getState().setScale(10);
      expect(useReaderStore.getState().scale).toBe(4);
    });

    it("allows valid scale", () => {
      useReaderStore.getState().setScale(2.5);
      expect(useReaderStore.getState().scale).toBe(2.5);
    });
  });

  describe("toggleBookmark", () => {
    it("adds a bookmark", () => {
      useReaderStore.getState().toggleBookmark(1);
      expect(useReaderStore.getState().bookmarks).toHaveLength(1);
      expect(useReaderStore.getState().bookmarks[0].page).toBe(1);
    });

    it("removes an existing bookmark", () => {
      useReaderStore.getState().toggleBookmark(1);
      useReaderStore.getState().toggleBookmark(1);
      expect(useReaderStore.getState().bookmarks).toHaveLength(0);
    });

    it("handles multiple bookmarks", () => {
      useReaderStore.getState().toggleBookmark(1);
      useReaderStore.getState().toggleBookmark(3);
      useReaderStore.getState().toggleBookmark(5);
      expect(useReaderStore.getState().bookmarks).toHaveLength(3);
    });
  });

  describe("annotations", () => {
    const highlight = {
      id: "test-1",
      page: 1,
      type: "highlight" as const,
      color: "#c4981a",
      text: "test",
      rects: [{ xPct: 0.1, yPct: 0.2, wPct: 0.3, hPct: 0.05 }],
      pageWidth: 612,
      pageHeight: 792,
      createdAt: Date.now(),
    };

    it("adds an annotation with normalized rects", () => {
      useReaderStore.getState().addAnnotation(highlight);
      const anns = useReaderStore.getState().annotations;
      expect(anns).toHaveLength(1);
      expect(anns[0].rects[0]).toHaveProperty("xPct", 0.1);
      expect(anns[0].pageWidth).toBe(612);
    });

    it("removes an annotation", () => {
      useReaderStore.getState().addAnnotation(highlight);
      useReaderStore.getState().removeAnnotation("test-1");
      expect(useReaderStore.getState().annotations).toHaveLength(0);
    });

    it("updates an annotation", () => {
      useReaderStore.getState().addAnnotation(highlight);
      useReaderStore.getState().updateAnnotation("test-1", { note: "my note" });
      expect(useReaderStore.getState().annotations[0].note).toBe("my note");
    });

    it("setAnnotations replaces all annotations", () => {
      useReaderStore.getState().addAnnotation(highlight);
      const newAnns = [
        { ...highlight, id: "new-1", rects: [{ xPct: 0.5, yPct: 0.5, wPct: 0.1, hPct: 0.01 }] },
      ];
      useReaderStore.getState().setAnnotations(newAnns);
      expect(useReaderStore.getState().annotations).toHaveLength(1);
      expect(useReaderStore.getState().annotations[0].id).toBe("new-1");
    });
  });

  describe("setSidebarTab", () => {
    it("auto-opens sidebar when setting a tab", () => {
      useReaderStore.getState().setSidebarOpen(false);
      useReaderStore.getState().setSidebarTab("bookmarks");
      expect(useReaderStore.getState().sidebarOpen).toBe(true);
      expect(useReaderStore.getState().sidebarTab).toBe("bookmarks");
    });
  });
});
