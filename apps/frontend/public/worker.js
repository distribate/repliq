const CACHE_NAME = 'repliq-cache-v1';

const URLS_TO_CACHE = [
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/site.webmanifest'
];

self.addEventListener('install', event => {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    console.log('Service Worker: skipping cache in dev');
    event.waitUntil(Promise.resolve());
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error('SW install cache error:', err);
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
      .catch(err => {
        console.error('SW activate error:', err);
      })
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (
    req.headers.get('accept') === 'text/event-stream' ||
    url.protocol === 'ws:' || url.protocol === 'wss:'
  ) {
    return;
  }

  if (
    url.pathname.startsWith('/assets/chunks/') ||
    url.pathname.startsWith('/assets/entries/') ||
    url.pathname.startsWith('/assets/static/')
  ) {
    event.respondWith(
      fetch(req).catch(err => {
        console.error('SW fetch error for assets:', err);
        return new Response('', { status: 504, statusText: 'Gateway Timeout' });
      })
    );

    return;
  }

  if (URLS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(req).catch(err => {
          console.error('SW fetch error for cached url:', err);
          return new Response('', { status: 504, statusText: 'Gateway Timeout' });
        });
      }).catch(err => {
        console.error('SW cache match error:', err);
        return fetch(req);
      })
    );

    return;
  }

  event.respondWith(
    fetch(req).catch(err => {
      console.error('SW fetch error for other requests:', err);
      return new Response('', { status: 504, statusText: 'Gateway Timeout' });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});