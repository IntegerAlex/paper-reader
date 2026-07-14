import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useReaderStore } from "@/store/reader-store";

describe("useReadingProgress", () => {
  beforeEach(() => {
    useReaderStore.setState({ currentPage: 1, totalPages: 100 });
  });

  it("returns 0 when totalPages is 0", () => {
    useReaderStore.setState({ currentPage: 1, totalPages: 0 });
    const { result } = renderHook(() => useReadingProgress());
    expect(result.current).toBe(0);
  });

  it("calculates progress correctly", () => {
    useReaderStore.setState({ currentPage: 50, totalPages: 100 });
    const { result } = renderHook(() => useReadingProgress());
    expect(result.current).toBe(50);
  });

  it("returns 100 on last page", () => {
    useReaderStore.setState({ currentPage: 100, totalPages: 100 });
    const { result } = renderHook(() => useReadingProgress());
    expect(result.current).toBe(100);
  });

  it("returns ~1 on first page", () => {
    useReaderStore.setState({ currentPage: 1, totalPages: 100 });
    const { result } = renderHook(() => useReadingProgress());
    expect(result.current).toBe(1);
  });
});
