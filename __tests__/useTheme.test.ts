import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/hooks/useTheme";
import { useReaderStore } from "@/store/reader-store";

const STORAGE_KEY = "paper-reader-dark-mode";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    useReaderStore.setState({ darkMode: "system" });
    document.documentElement.removeAttribute("data-theme");
  });

  it("returns default theme as system", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.darkMode).toBe("system");
  });

  it("cycles through themes: light -> dark -> system", () => {
    useReaderStore.setState({ darkMode: "light" });
    const { result } = renderHook(() => useTheme());

    act(() => result.current.cycleTheme());
    expect(result.current.darkMode).toBe("dark");

    act(() => result.current.cycleTheme());
    expect(result.current.darkMode).toBe("system");

    act(() => result.current.cycleTheme());
    expect(result.current.darkMode).toBe("light");
  });

  it("persists theme to localStorage via hook", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setDarkMode("dark"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("applies data-theme to html element", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setDarkMode("dark"));
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("resolvedTheme returns light or dark", () => {
    useReaderStore.setState({ darkMode: "light" });
    const { result } = renderHook(() => useTheme());
    expect(["light", "dark"]).toContain(result.current.resolvedTheme);
  });
});
