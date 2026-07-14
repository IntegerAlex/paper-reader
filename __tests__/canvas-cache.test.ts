import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCachedCanvas,
  setCachedCanvas,
  clearCanvasCache,
  getCanvasCacheSize,
} from "@/lib/canvas-cache";

// Mock canvas with drawing context
function mockCanvas(w = 100, h = 100): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  // jsdom doesn't support canvas natively; mock getContext
  vi.spyOn(canvas, "getContext").mockReturnValue({
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
  } as any);
  return canvas;
}

describe("canvas-cache", () => {
  beforeEach(() => {
    clearCanvasCache();
  });

  it("returns null for cache miss", () => {
    expect(getCachedCanvas(1, 1.5)).toBeNull();
  });

  it("stores and retrieves a canvas", () => {
    const src = mockCanvas();
    setCachedCanvas(1, 1.5, src);
    const hit = getCachedCanvas(1, 1.5);
    expect(hit).not.toBeNull();
    expect(hit!.width).toBe(100);
    expect(hit!.height).toBe(100);
  });

  it("returns cloned canvas, not the original reference", () => {
    const src = mockCanvas();
    setCachedCanvas(1, 1.0, src);
    const cached = getCachedCanvas(1, 1.0);
    expect(cached).not.toBe(src);
  });

  it("does not duplicate existing keys", () => {
    const src = mockCanvas();
    setCachedCanvas(1, 1.0, src);
    setCachedCanvas(1, 1.0, mockCanvas(200, 200));
    expect(getCanvasCacheSize()).toBe(1);
  });

  it("LRU: promotes accessed item to most recent", () => {
    // Fill cache to max (30)
    for (let i = 1; i <= 30; i++) {
      setCachedCanvas(i, 1.0, mockCanvas());
    }
    expect(getCanvasCacheSize()).toBe(30);

    // Access page 1 (should promote it to end/most-recent)
    getCachedCanvas(1, 1.0);

    // Add page 31 — should evict page 2 (oldest), not page 1
    setCachedCanvas(31, 1.0, mockCanvas());
    expect(getCanvasCacheSize()).toBe(30);
    expect(getCachedCanvas(1, 1.0)).not.toBeNull(); // page 1 survived
    expect(getCachedCanvas(2, 1.0)).toBeNull(); // page 2 evicted
  });

  it("LRU: evicts oldest when at capacity", () => {
    for (let i = 1; i <= 30; i++) {
      setCachedCanvas(i, 1.0, mockCanvas());
    }
    setCachedCanvas(31, 1.0, mockCanvas());
    expect(getCachedCanvas(1, 1.0)).toBeNull();
    expect(getCachedCanvas(31, 1.0)).not.toBeNull();
  });

  it("clearCanvasCache empties everything", () => {
    setCachedCanvas(1, 1.0, mockCanvas());
    setCachedCanvas(2, 1.0, mockCanvas());
    clearCanvasCache();
    expect(getCanvasCacheSize()).toBe(0);
    expect(getCachedCanvas(1, 1.0)).toBeNull();
  });

  it("different scales are separate cache entries", () => {
    setCachedCanvas(1, 1.0, mockCanvas(100, 100));
    setCachedCanvas(1, 2.0, mockCanvas(200, 200));
    expect(getCanvasCacheSize()).toBe(2);
    expect(getCachedCanvas(1, 1.0)!.width).toBe(100);
    expect(getCachedCanvas(1, 2.0)!.width).toBe(200);
  });
});
