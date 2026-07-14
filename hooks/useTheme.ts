"use client";

import { useEffect, useCallback } from "react";
import { useReaderStore } from "@/store/reader-store";

const STORAGE_KEY = "paper-reader-dark-mode";

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getResolvedTheme(mode: "light" | "dark" | "system"): "light" | "dark" {
  if (mode === "system") return getSystemPreference();
  return mode;
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function useTheme() {
  const darkMode = useReaderStore((s) => s.darkMode);
  const setDarkMode = useReaderStore((s) => s.setDarkMode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | "system" | null;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setDarkMode(stored);
      applyTheme(getResolvedTheme(stored));
    } else {
      applyTheme(getResolvedTheme("system"));
    }
  }, [setDarkMode]);

  useEffect(() => {
    applyTheme(getResolvedTheme(darkMode));
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    if (darkMode !== "system") return;
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(getResolvedTheme("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [darkMode]);

  const cycleTheme = useCallback(() => {
    const modes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];
    const idx = modes.indexOf(darkMode);
    setDarkMode(modes[(idx + 1) % modes.length]);
  }, [darkMode, setDarkMode]);

  return { darkMode, setDarkMode, cycleTheme, resolvedTheme: getResolvedTheme(darkMode) };
}
