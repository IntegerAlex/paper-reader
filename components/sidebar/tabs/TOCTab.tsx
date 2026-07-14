"use client";

import { List, ChevronRight } from "lucide-react";
import type { TOCTabProps } from "../types";

export default function TOCTab({
  toc,
  currentPage,
  setCurrentPage,
  scrollToPage,
  isDark,
}: TOCTabProps) {
  const emptyIconColor = isDark ? "rgba(184,168,138,0.3)" : "rgba(138,125,107,0.3)";
  const emptyTextColor = isDark ? "#b8a88a" : "#8a7d6b";
  const emptySubColor = isDark ? "rgba(184,168,138,0.5)" : "rgba(138,125,107,0.5)";

  if (toc.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <List
          size={32}
          style={{ margin: "0 auto 12px", color: emptyIconColor }}
        />
        <p style={{ fontSize: 13, color: emptyTextColor, margin: 0 }}>
          No table of contents
        </p>
        <p style={{ fontSize: 11, color: emptySubColor, marginTop: 4 }}>
          This PDF doesn&apos;t have a table of contents
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {toc.map((item, i) => (
        <button
          key={i}
          onClick={() => { setCurrentPage(item.page); scrollToPage(item.page); }}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "8px 12px",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s",
            background:
              currentPage === item.page
                ? "rgba(139,105,20,0.08)"
                : "transparent",
            color: "var(--text-primary)",
            paddingLeft: `${12 + item.level * 16}px`,
          }}
        >
          <ChevronRight
            size={12}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 13,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {item.title}
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            {item.page}
          </span>
        </button>
      ))}
    </div>
  );
}
