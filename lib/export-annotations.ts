import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Annotation, NormalizedRect } from "@/lib/storage";

const SUMMARY_PAGE_MARGIN = 50;
const SUMMARY_TITLE_SIZE = 18;
const SUMMARY_SUBTITLE_SIZE = 14;
const SUMMARY_PAGE_NUM_SIZE = 10;
const SUMMARY_TEXT_SIZE = 9;
const SUMMARY_LINE_HEIGHT = 16;
const SUMMARY_NOTE_LINE_HEIGHT = 20;
const SUMMARY_Y_THRESHOLD = 80;
const NOTE_MARKER_SIZE = 10;
const NOTE_TEXT_SIZE = 8;
const NOTE_TEXT_MAX_LENGTH = 50;
const QUOTE_TEXT_MAX_LENGTH = 60;
const NOTE_DISPLAY_MAX_LENGTH = 80;

function normalizedToPDFPoints(
  rect: NormalizedRect,
  pageWidth: number,
  pageHeight: number
): { x: number; y: number; w: number; h: number } {
  return {
    x: rect.xPct * pageWidth,
    y: rect.yPct * pageHeight,
    w: rect.wPct * pageWidth,
    h: rect.hPct * pageHeight,
  };
}

export async function exportAnnotationsToPDF(
  originalPdfBytes: ArrayBuffer,
  annotations: Annotation[],
  options?: { includeNotes?: boolean; includeHighlights?: boolean }
): Promise<Uint8Array> {
  const includeNotes = options?.includeNotes ?? true;
  const includeHighlights = options?.includeHighlights ?? true;

  const filtered = annotations.filter((a) => {
    if (a.type === "highlight" && !includeHighlights) return false;
    if (a.type === "note" && !includeNotes) return false;
    return true;
  });

  if (filtered.length === 0) {
    const doc = await PDFDocument.load(originalPdfBytes);
    return doc.save();
  }

  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageCount = pdfDoc.getPageCount();

  for (const ann of filtered) {
    if (ann.page < 1 || ann.page > pageCount) continue;

    const page = pdfDoc.getPage(ann.page - 1);
    const { width, height } = page.getSize();

    const annPageWidth = ann.pageWidth ?? width;
    const annPageHeight = ann.pageHeight ?? height;

    if (ann.type === "highlight" && ann.rects) {
      const color = hexToRgb(ann.color);
      for (const rect of ann.rects) {
        const pdfRect = normalizedToPDFPoints(rect, annPageWidth, annPageHeight);
        const scaleX = width / annPageWidth;
        const scaleY = height / annPageHeight;
        const x = pdfRect.x * scaleX;
        const pdfY = (pdfRect.y + pdfRect.h) * scaleY;
        const w = pdfRect.w * scaleX;
        const h = pdfRect.h * scaleY;

        page.drawRectangle({
          x,
          y: height - pdfY - h,
          width: w,
          height: h,
          color: rgb(color.r, color.g, color.b),
          opacity: 0.3,
        });
      }
    }

    if (ann.type === "note" || (ann.type === "highlight" && ann.note)) {
      const firstRect = ann.rects?.[0];
      if (firstRect) {
        const pdfRect = normalizedToPDFPoints(firstRect, annPageWidth, annPageHeight);
        const scaleX = width / annPageWidth;
        const scaleY = height / annPageHeight;
        const x = pdfRect.x * scaleX;
        const pdfY = (pdfRect.y + pdfRect.h) * scaleY;
        const w = pdfRect.w * scaleX;

        const noteX = Math.min(x + w + 4, width - 100);
        const noteY = height - pdfY - 4;

        page.drawSquare({
          x: noteX,
          y: noteY,
          size: NOTE_MARKER_SIZE,
          color: rgb(0.55, 0.41, 0.08),
          opacity: 0.8,
        });

        if (ann.note) {
          const displayText = ann.note.substring(0, NOTE_TEXT_MAX_LENGTH);
          page.drawText(displayText, {
            x: noteX + 14,
            y: noteY + 2,
            size: NOTE_TEXT_SIZE,
            font,
            color: rgb(0.35, 0.28, 0.12),
          });
        }
      }
    }
  }

  const notesOnly = filtered.filter((a) => a.note);
  if (notesOnly.length > 0) {
    const summaryWidth = 612;
    const summaryHeight = 792;
    let summaryPage = pdfDoc.addPage([summaryWidth, summaryHeight]);
    let y = summaryHeight - SUMMARY_PAGE_MARGIN;

    summaryPage.drawText("Annotations Summary", {
      x: SUMMARY_PAGE_MARGIN,
      y,
      size: SUMMARY_TITLE_SIZE,
      font: fontBold,
      color: rgb(0.17, 0.14, 0.09),
    });
    y -= 30;

    for (const ann of notesOnly) {
      if (y < SUMMARY_Y_THRESHOLD) {
        summaryPage = pdfDoc.addPage([summaryWidth, summaryHeight]);
        y = summaryHeight - SUMMARY_PAGE_MARGIN;

        summaryPage.drawText("Annotations Summary (cont.)", {
          x: SUMMARY_PAGE_MARGIN,
          y,
          size: SUMMARY_SUBTITLE_SIZE,
          font: fontBold,
          color: rgb(0.17, 0.14, 0.09),
        });
        y -= 24;
      }

      const color = hexToRgb(ann.color);

      summaryPage.drawText(`Page ${ann.page}`, {
        x: SUMMARY_PAGE_MARGIN,
        y,
        size: SUMMARY_PAGE_NUM_SIZE,
        font: fontBold,
        color: rgb(color.r, color.g, color.b),
      });
      y -= SUMMARY_LINE_HEIGHT;

      if (ann.text) {
        const quoteText =
          ann.text.length > QUOTE_TEXT_MAX_LENGTH
            ? `"${ann.text.substring(0, QUOTE_TEXT_MAX_LENGTH)}..."`
            : `"${ann.text}"`;
        summaryPage.drawText(quoteText, {
          x: SUMMARY_PAGE_MARGIN + 10,
          y,
          size: SUMMARY_TEXT_SIZE,
          font,
          color: rgb(0.45, 0.38, 0.25),
        });
        y -= 14;
      }

      if (ann.note) {
        const noteText =
          ann.note.length > NOTE_DISPLAY_MAX_LENGTH
            ? ann.note.substring(0, NOTE_DISPLAY_MAX_LENGTH) + "..."
            : ann.note;
        summaryPage.drawText(noteText, {
          x: SUMMARY_PAGE_MARGIN + 10,
          y,
          size: SUMMARY_TEXT_SIZE,
          font,
          color: rgb(0.17, 0.14, 0.09),
        });
        y -= SUMMARY_NOTE_LINE_HEIGHT;
      }
    }
  }

  return pdfDoc.save();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.55, g: 0.41, b: 0.08 };
}
