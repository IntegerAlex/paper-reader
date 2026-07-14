"use client";

import { useEffect } from "react";
import { useReaderStore } from "@/store/reader-store";

function scrollToPage(pageNum: number) {
  const el = document.querySelector(`[data-page="${pageNum}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function useKeyboard() {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    setScale,
    scale,
    setFocusMode,
    focusMode,
    setSidebarOpen,
    sidebarOpen,
    toggleBookmark,
    setInkMode,
    inkMode,
    setFullscreen,
  } = useReaderStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowLeft":
        case "k":
          e.preventDefault();
          if (currentPage > 1) {
            const p = currentPage - 1;
            setCurrentPage(p);
            scrollToPage(p);
          }
          break;
        case "ArrowRight":
        case "j":
          e.preventDefault();
          if (currentPage < totalPages) {
            const p = currentPage + 1;
            setCurrentPage(p);
            scrollToPage(p);
          }
          break;
        case " ":
          if (e.target === document.body) e.preventDefault();
          break;
        case "ArrowDown":
          e.preventDefault();
          window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
          break;
        case "ArrowUp":
          e.preventDefault();
          window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
          break;
        case "+":
        case "=":
          e.preventDefault();
          setScale(scale + 0.25);
          break;
        case "-":
          e.preventDefault();
          setScale(scale - 0.25);
          break;
        case "0":
          e.preventDefault();
          setScale(1.5);
          break;
        case "b":
        case "B":
          e.preventDefault();
          toggleBookmark(currentPage);
          break;
        case "s":
        case "S": {
          e.preventDefault();
          const modes: Array<"default" | "sepia" | "warm" | "dark"> = ["default", "sepia", "warm", "dark"];
          const idx = modes.indexOf(inkMode);
          setInkMode(modes[(idx + 1) % modes.length]);
          break;
        }
        case "d":
        case "D":
          e.preventDefault();
          setFocusMode(!focusMode);
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setFullscreen(false);
          } else {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
          }
          break;
        case "t":
        case "T":
          e.preventDefault();
          setSidebarOpen(!sidebarOpen);
          break;
        case "Escape":
          if (sidebarOpen) setSidebarOpen(false);
          if (focusMode) setFocusMode(false);
          break;
        case "Home":
          e.preventDefault();
          setCurrentPage(1);
          scrollToPage(1);
          break;
        case "End":
          e.preventDefault();
          setCurrentPage(totalPages);
          scrollToPage(totalPages);
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    currentPage,
    totalPages,
    setCurrentPage,
    setScale,
    scale,
    setFocusMode,
    focusMode,
    setSidebarOpen,
    sidebarOpen,
    toggleBookmark,
    setInkMode,
    inkMode,
    setFullscreen,
  ]);
}
