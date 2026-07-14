const STORAGE_PREFIX = "paper-reader:";

const MAX_RECENT_DOCS = 20;

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // Storage blocked — silently ignore
  }
}

export interface RecentDoc {
  id: string;
  name: string;
  size: number;
  lastOpened: number;
  page: number;
  totalPages: number;
}

export function getRecentDocs(): RecentDoc[] {
  return getItem<RecentDoc[]>("recent-docs", []);
}

export function addRecentDoc(doc: RecentDoc): void {
  const docs = getRecentDocs().filter((d) => d.id !== doc.id);
  docs.unshift(doc);
  setItem("recent-docs", docs.slice(0, MAX_RECENT_DOCS));
}

export function removeRecentDoc(id: string): void {
  const docs = getRecentDocs().filter((d) => d.id !== id);
  setItem("recent-docs", docs);
}

export interface Bookmark {
  page: number;
  label: string;
  createdAt: number;
}

export function getBookmarks(docId: string): Bookmark[] {
  return getItem<Bookmark[]>(`bookmarks:${docId}`, []);
}

export function setBookmarks(docId: string, bookmarks: Bookmark[]): void {
  setItem(`bookmarks:${docId}`, bookmarks);
}

/**
 * Normalized annotation rect — positions as percentages (0..1) of the page viewport.
 * This makes annotations resolution-independent and zoom-independent.
 */
export interface NormalizedRect {
  /** Left position as fraction of page width (0..1) */
  xPct: number;
  /** Top position as fraction of page height (0..1) */
  yPct: number;
  /** Width as fraction of page width (0..1) */
  wPct: number;
  /** Height as fraction of page height (0..1) */
  hPct: number;
}

/**
 * Legacy annotation rect — absolute CSS pixels relative to the container.
 * Used only for migration of old annotations.
 */
interface LegacyRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Annotation {
  id: string;
  page: number;
  type: "highlight" | "note";
  color: string;
  text?: string;
  note?: string;
  /** Normalized rects as percentages of page viewport. Primary format. */
  rects?: NormalizedRect[];
  /** Page viewport width at scale=1 (PDF points). Used for coordinate conversion. */
  pageWidth?: number;
  /** Page viewport height at scale=1 (PDF points). Used for coordinate conversion. */
  pageHeight?: number;
  createdAt: number;
}

/**
 * Check if an annotation uses the old legacy pixel-based rect format.
 */
function isLegacyRect(rect: NormalizedRect | LegacyRect): rect is LegacyRect {
  return "x" in rect && "y" in rect && "w" in rect && "h" in rect && !("xPct" in rect);
}

/**
 * Migrate legacy pixel-based rects to normalized percentage rects.
 * Assumes the legacy rects were captured at scale=1.5 (the default) into
 * a container whose dimensions matched the canvas intrinsic size.
 *
 * @param legacyRects - Old pixel-based rects
 * @param legacyContainerWidth - The container width when rects were captured (pixels)
 * @param legacyContainerHeight - The container height when rects were captured (pixels)
 * @returns Normalized percentage rects
 */
function migrateLegacyRects(
  legacyRects: LegacyRect[],
  legacyContainerWidth: number,
  legacyContainerHeight: number
): NormalizedRect[] {
  return legacyRects.map((r) => ({
    xPct: r.x / legacyContainerWidth,
    yPct: r.y / legacyContainerHeight,
    wPct: r.w / legacyContainerWidth,
    hPct: r.h / legacyContainerHeight,
  }));
}

/**
 * Get all annotations for a document, migrating any legacy formats.
 */
export function getAnnotations(docId: string): Annotation[] {
  const raw = getItem<Annotation[] | Array<Annotation & { rects?: Array<NormalizedRect | LegacyRect> }>>(
    `annotations:${docId}`,
    []
  );

  // Migrate legacy rects in-place
  return raw.map((ann) => {
    if (!ann.rects || ann.rects.length === 0) return ann as Annotation;
    if (!isLegacyRect(ann.rects[0])) return ann as Annotation;

    // Legacy format: assume captured at default scale (1.5) into a container
    // whose dimensions matched the canvas viewport at that scale.
    // Without stored pageWidth/pageHeight, we estimate from the rect values.
    // The rects are container-relative pixels. We need to find the container size.
    //
    // Heuristic: the largest x + w or y + h across all rects gives a lower bound.
    // We'll use a reasonable default PDF page size (612x792 = US Letter at 72dpi)
    // scaled by 1.5 (default scale) = 918x1188.
    const DEFAULT_CONTAINER_W = 918;
    const DEFAULT_CONTAINER_H = 1188;

    const migratedRects = migrateLegacyRects(
      ann.rects as LegacyRect[],
      DEFAULT_CONTAINER_W,
      DEFAULT_CONTAINER_H
    );

    return {
      ...ann,
      rects: migratedRects,
      pageWidth: 612,
      pageHeight: 792,
    } as Annotation;
  });
}

export function setAnnotations(docId: string, annotations: Annotation[]): void {
  setItem(`annotations:${docId}`, annotations);
}
