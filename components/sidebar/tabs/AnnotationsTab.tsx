"use client";

import { StickyNote, Download, FileText } from "lucide-react";
import { exportAnnotationsToPDF } from "@/lib/export-annotations";
import type { AnnotationsTabProps } from "../types";

export default function AnnotationsTab({
  annotations,
  currentPage,
  pdfArrayBuffer,
  setCurrentPage,
  scrollToPage,
  setAnnotations,
  isDark,
}: AnnotationsTabProps) {
  const emptyIconColor = isDark ? "rgba(184,168,138,0.3)" : "rgba(138,125,107,0.3)";
  const emptyTextColor = isDark ? "#b8a88a" : "#8a7d6b";
  const emptySubColor = isDark ? "rgba(184,168,138,0.5)" : "rgba(138,125,107,0.5)";

  const exportJSON = () => {
    const data = JSON.stringify(annotations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!pdfArrayBuffer) return;
    const pdfBytes = await exportAnnotationsToPDF(
      pdfArrayBuffer,
      annotations,
      { includeHighlights: true, includeNotes: true }
    );
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations-export.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (annotations.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <StickyNote
          size={32}
          style={{ margin: "0 auto 12px", color: emptyIconColor }}
        />
        <p style={{ fontSize: 13, color: emptyTextColor, margin: 0 }}>
          No annotations
        </p>
        <p style={{ fontSize: 11, color: emptySubColor, marginTop: 4 }}>
          Select text on the page to highlight or add notes
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <p
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          Export
        </p>
        <button
          onClick={exportPDF}
          disabled={!pdfArrayBuffer}
          aria-label="Export highlights as PDF"
          style={{
            width: "100%",
            padding: "8px 12px",
            background: isDark
              ? "rgba(196,152,26,0.12)"
              : "rgba(139,105,20,0.08)",
            border: `1px solid ${isDark ? "rgba(196,152,26,0.2)" : "rgba(139,105,20,0.15)"}`,
            borderRadius: 8,
            fontSize: 11,
            color: "var(--accent)",
            cursor: pdfArrayBuffer ? "pointer" : "not-allowed",
            opacity: pdfArrayBuffer ? 1 : 0.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "background 0.15s",
            marginBottom: 6,
          }}
        >
          <FileText size={12} />
          Export Highlights (PDF)
        </button>
        <button
          onClick={exportJSON}
          aria-label="Export notes as JSON"
          style={{
            width: "100%",
            padding: "8px 12px",
            background: isDark
              ? "rgba(196,152,26,0.06)"
              : "rgba(139,105,20,0.04)",
            border: `1px solid ${isDark ? "rgba(196,152,26,0.12)" : "rgba(139,105,20,0.08)"}`,
            borderRadius: 8,
            fontSize: 11,
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "background 0.15s",
          }}
        >
          <Download size={12} />
          Export Notes (JSON)
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="list" aria-label="Annotations list">
        {annotations
          .slice()
          .sort((a, b) => a.page - b.page)
          .map((a) => (
            <button
              key={a.id}
              onClick={() => { setCurrentPage(a.page); scrollToPage(a.page); }}
              role="listitem"
              aria-label={`${a.type === "highlight" ? "Highlight" : "Note"} on page ${a.page}${a.text ? `: "${a.text.slice(0, 50)}${a.text.length > 50 ? "..." : ""}"` : ""}`}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 12,
                background:
                  currentPage === a.page
                    ? isDark
                      ? "rgba(196,152,26,0.12)"
                      : "rgba(139,105,20,0.08)"
                    : isDark
                      ? "rgba(196,152,26,0.04)"
                      : "rgba(139,105,20,0.03)",
                borderRadius: 8,
                border: `1px solid ${isDark ? "rgba(196,152,26,0.08)" : "rgba(139,105,20,0.06)"}`,
                cursor: "pointer",
                transition: "background 0.15s",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 600,
                      color: a.color,
                    }}
                  >
                    {a.type === "highlight" ? "Highlight" : "Note"}
                  </span>
                  {a.note && <span style={{ fontSize: 12 }}>&#128221;</span>}
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  p.{a.page}
                </span>
              </div>
              {a.text && (
                <p
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  &ldquo;{a.text}&rdquo;
                </p>
              )}
              {a.note && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {a.note}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAnnotations(annotations.filter((an) => an.id !== a.id));
                }}
                aria-label={`Remove annotation on page ${a.page}`}
                style={{
                  fontSize: 10,
                  color: "var(--note-delete)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginTop: 8,
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--note-delete-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--note-delete)";
                }}
              >
                Remove
              </button>
            </button>
          ))}
      </div>
    </>
  );
}
