import type { StateCreator } from "zustand";
import type { ReaderState, TextureId, InkMode } from "../reader-store";

export interface UiSlice {
  texture: TextureId;
  sidebarOpen: boolean;
  sidebarTab: "thumbnails" | "bookmarks" | "toc" | "search" | "annotations";
  focusMode: boolean;
  fullscreen: boolean;
  inkMode: InkMode;
  darkMode: "light" | "dark" | "system";
  isMobile: boolean;

  setTexture: (t: TextureId) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarTab: (tab: ReaderState["sidebarTab"]) => void;
  setFocusMode: (f: boolean) => void;
  setFullscreen: (f: boolean) => void;
  setInkMode: (m: InkMode) => void;
  setDarkMode: (m: "light" | "dark" | "system") => void;
  setIsMobile: (m: boolean) => void;
}

export const createUiSlice: StateCreator<ReaderState, [], [], UiSlice> = (set) => ({
  texture: "classic-matte",
  sidebarOpen: false,
  sidebarTab: "thumbnails",
  focusMode: false,
  fullscreen: false,
  inkMode: "default",
  darkMode: "system",
  isMobile: false,

  setTexture: (t) => set({ texture: t }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarTab: (tab) => set({ sidebarTab: tab, sidebarOpen: true }),
  setFocusMode: (f) => set({ focusMode: f }),
  setFullscreen: (f) => set({ fullscreen: f }),
  setInkMode: (m) => set({ inkMode: m }),
  setDarkMode: (m) => set({ darkMode: m }),
  setIsMobile: (m) => set({ isMobile: m }),
});
