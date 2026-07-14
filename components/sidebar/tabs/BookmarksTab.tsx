"use client";

import { Bookmark, BookmarkCheck, Plus, Trash2 } from "lucide-react";
import type { BookmarksTabProps } from "../types";

export default function BookmarksTab({
  bookmarks,
  currentPage,
  setCurrentPage,
  scrollToPage,
  isDark,
}: BookmarksTabProps) {
  const emptyIconColor = isDark ? "rgba(184,168,138,0.3)" : "rgba(138,125,107,0.3)";
  const emptyTextColor = isDark ? "#b8a88a" : "#8a7d6b";
  const emptySubColor = isDark ? "rgba(184,168,138,0.5)" : "rgba(138,125,107,0.5)";

  const isCurrentPageBookmarked = bookmarks.some((b) => b.page === currentPage);

  return (
    <div style={{ padding: 12 }}>
      <button
        onClick={() => {
          const existing = bookmarks.find((b) => b.page === currentPage);
          if (existing) {
            // Remove bookmark - dispatch event
            window.dispatchEvent(
              new CustomEvent("toggle-bookmark", { detail: { page: currentPage } })
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("toggle-bookmark", { detail: { page: currentPage } })
            );
          }
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 12,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          border: `1px solid ${isCurrentPageBookmarked ? "var(--accent)" : "var(--border-subtle)"}`,
          cursor: "pointer",
          transition: "all 0.15s",
          background: isCurrentPageBookmarked
            ? "rgba(139,105,20,0.1)"
            : "transparent",
          color: isCurrentPageBookmarked ? "var(--accent)" : "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {isCurrentPageBookmarked ? (
          <>
            <BookmarkCheck size={14} />
            Remove Bookmark (p.{currentPage})
          </>
        ) : (
          <>
            <Plus size={14} />
            Bookmark Page {currentPage}
          </>
        )}
      </button>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "36px 0" }}>
          <Bookmark
            size={32}
            style={{ margin: "0 auto 12px", color: emptyIconColor }}
          />
          <p style={{ fontSize: 13, color: emptyTextColor, margin: 0 }}>
            No bookmarks yet
          </p>
          <p style={{ fontSize: 11, color: emptySubColor, marginTop: 4 }}>
            Click the button above to bookmark the current page
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {bookmarks
            .slice()
            .sort((a, b) => a.page - b.page)
            .map((b) => (
              <button
                key={b.page}
                onClick={() => {
                  setCurrentPage(b.page);
                  scrollToPage(b.page);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background:
                    currentPage === b.page
                      ? "rgba(139,105,20,0.08)"
                      : "transparent",
                  color: "var(--text-primary)",
                }}
              >
                <BookmarkCheck
                  size={14}
                  style={{ color: "var(--accent)", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{b.label}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    Page {b.page}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(
                      new CustomEvent("toggle-bookmark", { detail: { page: b.page } })
                    );
                  }}
                  style={{
                    padding: 4,
                    borderRadius: 4,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--note-delete)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  title="Remove bookmark"
                >
                  <Trash2 size={12} />
                </button>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
