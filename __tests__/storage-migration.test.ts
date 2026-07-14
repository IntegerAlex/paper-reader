import { describe, it, expect, beforeEach } from "vitest";
import {
  getAnnotations,
  setAnnotations,
  getBookmarks,
  setBookmarks,
  removeItem,
} from "@/lib/storage";
import type { Annotation, Bookmark } from "@/lib/storage";

// Helper to clear all paper-reader localStorage keys
function clearAll() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("paper-reader:"));
  keys.forEach((k) => localStorage.removeItem(k));
}

describe("storage - annotation migration", () => {
  beforeEach(() => {
    clearAll();
  });

  it("migrates legacy pixel rects to normalized percentages", () => {
    // Simulate old storage with pixel-based rects
    const legacyAnnotations = [
      {
        id: "legacy-1",
        page: 1,
        type: "highlight" as const,
        color: "#ff0000",
        text: "old annotation",
        rects: [{ x: 50, y: 100, w: 200, h: 30 }],
        createdAt: 1000,
      },
    ];

    // Directly set in localStorage (bypassing setAnnotations which normalizes)
    localStorage.setItem(
      "paper-reader:annotations:test.pdf",
      JSON.stringify(legacyAnnotations)
    );

    const result = getAnnotations("test.pdf");
    expect(result).toHaveLength(1);
    expect(result[0].rects[0]).toHaveProperty("xPct");
    expect(result[0].rects[0]).toHaveProperty("yPct");
    expect(result[0].rects[0]).toHaveProperty("wPct");
    expect(result[0].rects[0]).toHaveProperty("hPct");
    expect(result[0].rects[0]).not.toHaveProperty("x");
    expect(result[0].rects[0]).not.toHaveProperty("y");
  });

  it("migrated rects have reasonable values for US Letter at 1.5x", () => {
    // Container: 918x1188 (612*1.5 x 792*1.5)
    // rect: { x: 50, y: 100, w: 200, h: 30 }
    // Expected: xPct=50/918≈0.0545, yPct=100/1188≈0.0842
    const legacyAnnotations = [
      {
        id: "legacy-1",
        page: 1,
        type: "highlight" as const,
        color: "#ff0000",
        rects: [{ x: 50, y: 100, w: 200, h: 30 }],
        createdAt: 1000,
      },
    ];

    localStorage.setItem(
      "paper-reader:annotations:test.pdf",
      JSON.stringify(legacyAnnotations)
    );

    const result = getAnnotations("test.pdf");
    const rect = result[0].rects[0];
    expect(rect.xPct).toBeCloseTo(50 / 918, 4);
    expect(rect.yPct).toBeCloseTo(100 / 1188, 4);
    expect(rect.wPct).toBeCloseTo(200 / 918, 4);
    expect(rect.hPct).toBeCloseTo(30 / 1188, 4);
  });

  it("already-normalized rects are not double-migrated", () => {
    const modernAnnotations: Annotation[] = [
      {
        id: "modern-1",
        page: 1,
        type: "highlight",
        color: "#ff0000",
        rects: [{ xPct: 0.1, yPct: 0.2, wPct: 0.3, hPct: 0.05 }],
        pageWidth: 612,
        pageHeight: 792,
        createdAt: 1000,
      },
    ];

    setAnnotations("test.pdf", modernAnnotations);
    const result = getAnnotations("test.pdf");

    expect(result[0].rects[0]).toEqual({
      xPct: 0.1,
      yPct: 0.2,
      wPct: 0.3,
      hPct: 0.05,
    });
    expect(result[0].pageWidth).toBe(612);
    expect(result[0].pageHeight).toBe(792);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem("paper-reader:annotations:bad.pdf", "NOT_JSON!!!{");
    const result = getAnnotations("bad.pdf");
    expect(result).toEqual([]);
  });

  it("handles empty string in localStorage", () => {
    localStorage.setItem("paper-reader:annotations:empty.pdf", "");
    const result = getAnnotations("empty.pdf");
    expect(result).toEqual([]);
  });
});

describe("storage - bookmark isolation", () => {
  beforeEach(() => {
    clearAll();
  });

  it("bookmarks are isolated by pdf name", () => {
    const b1: Bookmark = { page: 1, label: "PDF A", createdAt: 1000 };
    const b2: Bookmark = { page: 5, label: "PDF B", createdAt: 2000 };
    setBookmarks("a.pdf", [b1]);
    setBookmarks("b.pdf", [b2]);
    expect(getBookmarks("a.pdf")).toEqual([b1]);
    expect(getBookmarks("b.pdf")).toEqual([b2]);
  });

  it("annotations are isolated by pdf name", () => {
    const a1: Annotation = {
      id: "a1",
      page: 1,
      type: "highlight",
      color: "#ff0000",
      rects: [{ xPct: 0.1, yPct: 0.1, wPct: 0.2, hPct: 0.05 }],
      createdAt: 1000,
    };
    const a2: Annotation = {
      id: "a2",
      page: 2,
      type: "note",
      color: "#0000ff",
      note: "hello",
      createdAt: 2000,
    };
    setAnnotations("a.pdf", [a1]);
    setAnnotations("b.pdf", [a2]);
    expect(getAnnotations("a.pdf")).toEqual([a1]);
    expect(getAnnotations("b.pdf")).toEqual([a2]);
  });
});
