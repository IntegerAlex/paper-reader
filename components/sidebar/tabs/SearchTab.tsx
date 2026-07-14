"use client";

import { useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import type { SearchTabProps } from "../types";

export default function SearchTab({
  searchResults,
  searchIndex,
  setSearchIndex,
  setCurrentPage,
  scrollToPage,
  onSearch,
  isDark,
}: SearchTabProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    await onSearch(searchInput);
    setSearching(false);
  }, [searchInput, onSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const navigateResult = (direction: "next" | "prev") => {
    if (searchResults.length === 0) return;
    const newIdx =
      direction === "next"
        ? (searchIndex + 1) % searchResults.length
        : (searchIndex - 1 + searchResults.length) % searchResults.length;
    setSearchIndex(newIdx);
    setCurrentPage(searchResults[newIdx].page);
    scrollToPage(searchResults[newIdx].page);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search in document..."
          style={{
            flex: 1,
            padding: "8px 12px",
            fontSize: 13,
            background: isDark ? "rgba(255,255,255,0.05)" : "var(--paper-bg)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            outline: "none",
            color: "var(--text-primary)",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          style={{
            padding: "8px 12px",
            background: "var(--accent)",
            color: "var(--text-on-dark)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            opacity: searching ? 0.5 : 1,
          }}
        >
          {searching ? "..." : "Go"}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {searchIndex + 1} of {searchResults.length} results
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => navigateResult("prev")}
              style={{
                padding: 4,
                borderRadius: 4,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
            </button>
            <button
              onClick={() => navigateResult("next")}
              style={{
                padding: 4,
                borderRadius: 4,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchIndex(i);
                setCurrentPage(result.page);
                scrollToPage(result.page);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
                background:
                  i === searchIndex
                    ? "rgba(139,105,20,0.08)"
                    : "transparent",
                color:
                  i === searchIndex
                    ? "var(--accent)"
                    : "var(--text-secondary)",
              }}
            >
              Page {result.page}
            </button>
          ))}
        </div>
      )}

      {searchResults.length === 0 && searchInput && !searching && (
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          No results found
        </p>
      )}
    </div>
  );
}
