import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getBookmarks,
  setBookmarks,
  getAnnotations,
  setAnnotations,
  getRecentDocs,
  addRecentDoc,
  removeRecentDoc,
} from "@/lib/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("bookmarks", () => {
    it("returns empty array when no bookmarks exist", () => {
      expect(getBookmarks("test.pdf")).toEqual([]);
    });

    it("stores and retrieves bookmarks", () => {
      const bookmarks = [
        { page: 1, label: "Page 1", createdAt: 1000 },
        { page: 5, label: "Page 5", createdAt: 2000 },
      ];
      setBookmarks("test.pdf", bookmarks);
      expect(getBookmarks("test.pdf")).toEqual(bookmarks);
    });

    it("isolates bookmarks by pdf name", () => {
      setBookmarks("a.pdf", [{ page: 1, label: "A", createdAt: 1000 }]);
      setBookmarks("b.pdf", [{ page: 2, label: "B", createdAt: 2000 }]);
      expect(getBookmarks("a.pdf")).toHaveLength(1);
      expect(getBookmarks("b.pdf")).toHaveLength(1);
      expect(getBookmarks("a.pdf")[0].page).toBe(1);
    });
  });

  describe("annotations", () => {
    it("returns empty array when no annotations exist", () => {
      expect(getAnnotations("test.pdf")).toEqual([]);
    });

    it("stores and retrieves annotations", () => {
      const annotations = [
        {
          id: "ann-1",
          page: 1,
          type: "highlight" as const,
          color: "#c4981a",
          text: "hello",
          rects: [{ xPct: 0.1, yPct: 0.2, wPct: 0.3, hPct: 0.05 }],
          pageWidth: 612,
          pageHeight: 792,
          createdAt: 1000,
        },
      ];
      setAnnotations("test.pdf", annotations);
      expect(getAnnotations("test.pdf")).toEqual(annotations);
    });
  });

  describe("recent docs", () => {
    it("returns empty array when no recent docs", () => {
      expect(getRecentDocs()).toEqual([]);
    });

    it("adds a recent doc", () => {
      addRecentDoc({
        id: "test.pdf",
        name: "test.pdf",
        size: 1024,
        lastOpened: Date.now(),
        page: 1,
        totalPages: 10,
      });
      expect(getRecentDocs()).toHaveLength(1);
      expect(getRecentDocs()[0].name).toBe("test.pdf");
    });

    it("limits to 20 recent docs", () => {
      for (let i = 0; i < 25; i++) {
        addRecentDoc({
          id: `doc-${i}.pdf`,
          name: `doc-${i}.pdf`,
          size: 1024,
          lastOpened: Date.now() + i,
          page: 1,
          totalPages: 10,
        });
      }
      expect(getRecentDocs()).toHaveLength(20);
    });

    it("removes a recent doc", () => {
      addRecentDoc({
        id: "test.pdf",
        name: "test.pdf",
        size: 1024,
        lastOpened: Date.now(),
        page: 1,
        totalPages: 10,
      });
      removeRecentDoc("test.pdf");
      expect(getRecentDocs()).toHaveLength(0);
    });

    it("moves updated doc to top", () => {
      addRecentDoc({ id: "a.pdf", name: "a.pdf", size: 0, lastOpened: 1, page: 1, totalPages: 10 });
      addRecentDoc({ id: "b.pdf", name: "b.pdf", size: 0, lastOpened: 2, page: 1, totalPages: 10 });
      addRecentDoc({ id: "a.pdf", name: "a.pdf", size: 0, lastOpened: 3, page: 5, totalPages: 10 });
      const docs = getRecentDocs();
      expect(docs[0].id).toBe("a.pdf");
      expect(docs[0].page).toBe(5);
      expect(docs).toHaveLength(2);
    });
  });
});
