/* ============================================================
   Service worker: app shell offline
   Ao publicar uma versão nova, mude VERSION.
   ============================================================ */

const VERSION = 'mesa-infinita-v1';
const SHELL = [
  './',
  './index.html',
  './css/base.css',
  './css/app.css',
  './assets/parchment.svg',
  './assets/icon.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await cache.addAll(SHELL);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(VERSION);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(VERSION);
          const offline = new URL('index.html', self.registration.scope).href;
          return (await cache.match(offline)) || Response.error();
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const fresh = await fetch(request);
        if (fresh.ok) cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return Response.error();
      }
    })(),
  );
});
