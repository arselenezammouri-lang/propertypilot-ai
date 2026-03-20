/**
 * PropertyPilot — SW bypass (v5 network-only).
 * Replaces legacy workers that returned invalid Responses / offline shells.
 * Always forwards to the network; clears caches on activate; no offline fallback.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (self.caches && self.caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('/sw.js')) {
    return;
  }
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => Response.error())
  );
});
