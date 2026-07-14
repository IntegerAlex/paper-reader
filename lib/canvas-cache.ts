const cache = new Map<string, HTMLCanvasElement>();
const MAX_CACHE_SIZE = 40;

export function getCachedCanvas(pageNum: number, scale: number, dpr?: number): HTMLCanvasElement | null {
  const effectiveDpr = dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  const key = `${pageNum}-${scale}-${effectiveDpr}`;
  const entry = cache.get(key);
  if (!entry) return null;

  // Move to end (most recently used) by deleting and re-inserting
  cache.delete(key);
  cache.set(key, entry);
  return entry;
}

export function setCachedCanvas(pageNum: number, scale: number, source: HTMLCanvasElement, dpr?: number): void {
  const effectiveDpr = dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
  const key = `${pageNum}-${scale}-${effectiveDpr}`;
  if (cache.has(key)) return;

  while (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    } else {
      break;
    }
  }

  const clone = document.createElement("canvas");
  clone.width = source.width;
  clone.height = source.height;
  const ctx = clone.getContext("2d");
  if (ctx) {
    ctx.drawImage(source, 0, 0);
  }
  cache.set(key, clone);
}

export function clearCanvasCache(): void {
  cache.clear();
}

export function getCanvasCacheSize(): number {
  return cache.size;
}


