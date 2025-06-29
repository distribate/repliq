const CACHE_NAME = 'pwa-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const { request } = event;

  if (
    request.headers.get('accept') === 'text/event-stream' || // SSE
    request.url.startsWith('ws://') || request.url.startsWith('wss://') // WS
  ) {
    return; 
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            if (
              request.url.match(/\.(js|css|png|jpg|svg|woff2?|ttf|eot|ico)$/)
            ) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});