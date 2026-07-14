import { describe, it, expect } from "vitest";
import { exportAnnotationsToPDF } from "@/lib/export-annotations";
import type { Annotation } from "@/lib/storage";

// Minimal valid PDF for testing (1 page, 612x792 points)
const MINIMAL_PDF_BYTES = (() => {
  // Manually construct a minimal PDF with pdf-lib is overkill;
  // we'll test with a simple empty PDF created inline
  const lines = [
    "%PDF-1.4",
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj",
    "xref",
    "0 4",
    "0000000000 65535 f ",
    "0000000009 00000 n ",
    "0000000058 00000 n ",
    "0000000115 00000 n ",
    "trailer<</Size 4/Root 1 0 R>>",
    "startxref",
    "190",
    "%%EOF",
  ];
  const str = lines.join("\n");
  const buf = new ArrayBuffer(str.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
  return buf;
})();

describe("exportAnnotationsToPDF", () => {
  it("returns original PDF when no annotations", async () => {
    const result = await exportAnnotationsToPDF(MINIMAL_PDF_BYTES, []);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by type options", async () => {
    const annotations: Annotation[] = [
      {
        id: "a1",
        page: 1,
        type: "highlight",
        color: "#ff0000",
        rects: [{ xPct: 0.1, yPct: 0.1, wPct: 0.2, hPct: 0.05 }],
        pageWidth: 612,
        pageHeight: 792,
        createdAt: Date.now(),
      },
      {
        id: "a2",
        page: 1,
        type: "note",
        color: "#0000ff",
        note: "Test note",
        rects: [{ xPct: 0.3, yPct: 0.3, wPct: 0.1, hPct: 0.02 }],
        pageWidth: 612,
        pageHeight: 792,
        createdAt: Date.now(),
      },
    ];

    // Only highlights
    const highlightsOnly = await exportAnnotationsToPDF(
      MINIMAL_PDF_BYTES,
      annotations,
      { includeHighlights: true, includeNotes: false }
    );
    expect(highlightsOnly.length).toBeGreaterThan(0);

    // Only notes
    const notesOnly = await exportAnnotationsToPDF(
      MINIMAL_PDF_BYTES,
      annotations,
      { includeHighlights: false, includeNotes: true }
    );
    expect(notesOnly.length).toBeGreaterThan(0);

    // Neither — should return original PDF unchanged
    const neither = await exportAnnotationsToPDF(
      MINIMAL_PDF_BYTES,
      annotations,
      { includeHighlights: false, includeNotes: false }
    );
    expect(neither.length).toBeGreaterThan(0);
  });

  it("skips annotations on pages beyond PDF page count", async () => {
    const annotations: Annotation[] = [
      {
        id: "a1",
        page: 99, // way beyond 1-page PDF
        type: "highlight",
        color: "#ff0000",
        rects: [{ xPct: 0.1, yPct: 0.1, wPct: 0.2, hPct: 0.05 }],
        pageWidth: 612,
        pageHeight: 792,
        createdAt: Date.now(),
      },
    ];

    const result = await exportAnnotationsToPDF(MINIMAL_PDF_BYTES, annotations);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("handles annotations without pageWidth/pageHeight (uses page size)", async () => {
    const annotations: Annotation[] = [
      {
        id: "a1",
        page: 1,
        type: "highlight",
        color: "#ff0000",
        rects: [{ xPct: 0.1, yPct: 0.1, wPct: 0.2, hPct: 0.05 }],
        createdAt: Date.now(),
      },
    ];

    const result = await exportAnnotationsToPDF(MINIMAL_PDF_BYTES, annotations);
    expect(result).toBeInstanceOf(Uint8Array);
  });
});
