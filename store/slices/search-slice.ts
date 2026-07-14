import type { StateCreator } from "zustand";
import type { ReaderState } from "../reader-store";

export interface SearchSlice {
  searchResults: { page: number; index: number }[];
  searchIndex: number;

  setSearchResults: (r: { page: number; index: number }[]) => void;
  setSearchIndex: (i: number) => void;
}

export const createSearchSlice: StateCreator<ReaderState, [], [], SearchSlice> = (set) => ({
  searchResults: [],
  searchIndex: 0,

  setSearchResults: (r) => set({ searchResults: r }),
  setSearchIndex: (i) => set({ searchIndex: i }),
});
