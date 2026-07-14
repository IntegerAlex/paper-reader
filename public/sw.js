// Paper Reader — Service Worker
// Handles offline caching for app shell and static assets

const CACHE_NAME = "paper-reader-v1";
const APP_SHELL_CACHE = "paper-reader-shell-v1";

// Assets to pre-cache on install
const PRE_CACHE = [
  "/",
  "/read",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
];

// Install — pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== APP_SHELL_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — stale-while-revalidate for app shell, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET") return;
  if (url.origin !== location.origin) return;

  // PDF worker — cache first (long-lived)
  if (url.pathname.includes("pdf.worker")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Static assets (JS, CSS, images) — stale-while-revalidate
  if (
    url.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff2?)$/)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // HTML navigation — stale-while-revalidate
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(APP_SHELL_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }
});
