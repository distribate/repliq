/// <reference lib="webworker" />
export type { };

import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST)

const log = (...args: any[]) => console.log('[SW]', ...args)

const ctx = self as unknown as ServiceWorkerGlobalScope;

const IS_SERVICE_WORKER = typeof ctx !== 'undefined' && 'ServiceWorkerGlobalScope' in self;

const CACHE_NAME = 'cache-v1';
const RUNTIME_CACHE_NAME = 'runtime-v1';

const WL_URLS = [
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/site.webmanifest'
];

const BL_HOSTS = ["localhost", "127.0.0.1"]

const BL_ASSETS = [
  "/assets/chunks/",
  "/assets/entries/",
  "/assets/static/"
]

const BL_PROTOCOLS = ["ws:", "wss:"]

async function broadcast(type: string, payload?: any) {
  try {
    const allClients = await ctx.clients.matchAll({ includeUncontrolled: true });

    for (const client of allClients) {
      client.postMessage({ type, payload });
    }
  } catch (e) {
    log('SW', 'broadcast error', e);
  }
}

async function networkFirst(request: Request, cacheName = RUNTIME_CACHE_NAME, timeoutMs = 7000): Promise<Response> {
  const cache = await caches.open(cacheName);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(request, { signal: controller.signal });

    clearTimeout(id);

    if (response && response.ok) {
      const url = new URL(request.url);

      if (!BL_ASSETS.some(p => url.pathname.startsWith(p))) {
        cache.put(request, response.clone()).catch(() => {/* ignore put errors */ });
      }

      return response;
    }

    throw new Error('Network response not ok');
  } catch {
    clearTimeout(id);

    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

async function cacheFirst(request: Request, cacheName = CACHE_NAME): Promise<Response> {
  const cache = await caches.open(cacheName);

  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const resp = await fetch(request);

    if (resp && resp.ok) {
      const url = new URL(request.url);
      
      if (!BL_ASSETS.some(p => url.pathname.startsWith(p))) {
        cache.put(request, resp.clone()).catch(() => {/* ignore */ });
      }
    }
    return resp;
  } catch {
    const fallback = await cache.match(request);
    if (fallback) return fallback;

    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}

ctx.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const host = ctx.location.hostname;

    if (BL_HOSTS.includes(host)) {
      log('SW', 'skipping pre-cache in dev host:', host);
      return;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(WL_URLS);
      await ctx.skipWaiting();

      log('SW', 'install: precache done');
    } catch (e) {
      log('SW', 'install error', e);
    }
  })());
});

ctx.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();

      await Promise.all(
        keys.map(k => (k !== CACHE_NAME && k !== RUNTIME_CACHE_NAME) ? caches.delete(k) : Promise.resolve())
      );

      await ctx.clients.claim();

      log('SW', 'activate: caches cleaned and clients claimed');
    } catch (e) {
      log('SW', 'activate error', e);
    }
  })());
});

ctx.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  const accept = req.headers.get('accept') || '';

  if (accept.includes('text/event-stream') || BL_PROTOCOLS.includes(url.protocol)) {
    return;
  }

  if (req.headers.has('range')) {
    event.respondWith(fetch(req));
    return;
  }

  if (BL_ASSETS.some(p => url.pathname.startsWith(p))) {
    event.respondWith((async () => {
      try {
        const resp = await fetch(req, { cache: 'no-store' });

        return resp;
      } catch (e) {
        log('SW', 'asset fetch failed (no-cache)', e);
        return new Response('', { status: 504, statusText: 'Gateway Timeout' });
      }
    })());
    
    return;
  }

  if (WL_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith((async () => {
      try {
        return networkFirst(req, RUNTIME_CACHE_NAME, 7000);
      } catch (e) {
        log('SW', 'navigation network-first failed', e);

        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) return cachedIndex;

        return new Response('', { status: 504, statusText: 'Gateway Timeout' });
      }
    })());

    return;
  }

  event.respondWith((async () => {
    try {
      const resp = await fetch(req);

      if (req.method === 'GET' && resp && resp.ok) {
        const cache = await caches.open(RUNTIME_CACHE_NAME);
        cache.put(req, resp.clone()).catch(() => {/* ignore */ });
      }

      return resp;
    } catch (e) {
      log('SW', 'default fetch failed, trying cache', e);
      
      const cached = await caches.match(req);
      if (cached) return cached;

      return new Response('', { status: 504, statusText: 'Gateway Timeout' });
    }
  })());
});

ctx.addEventListener('message', (event) => {
  const data = event.data || {};
  if (!data || typeof data.type !== 'string') return;

  switch (data.type) {
    case 'SKIP_WAITING':
      (event as any).waitUntil((async () => {
        try {
          await ctx.skipWaiting();
          log('SW', 'skipWaiting requested');
        } catch (e) {
          log('SW', 'skipWaiting error', e);
        }
      })());
      break;

    case 'PRECACHE_URLS':
      (event as any).waitUntil((async () => {
        try {
          const urls: string[] = Array.isArray(data.payload) ? data.payload : [];
          const cache = await caches.open(CACHE_NAME);

          await cache.addAll(urls);
          await broadcast('PRECACHE_DONE', { urls });
          log('SW', 'PRECACHE_URLS done', urls);
        } catch (e) {
          log('SW', 'PRECACHE_URLS error', e);
        }
      })());
      break;

    case 'CLEAR_CACHE':
      (event as any).waitUntil((async () => {
        try {
          const ok = await caches.delete(CACHE_NAME);
          await broadcast('CACHE_CLEARED', { ok });
          log('SW', 'CLEAR_CACHE', ok);
        } catch (e) {
          log('SW', 'CLEAR_CACHE error', e);
        }
      })());
      break;

    default:
      log('SW', 'unknown message', data);
      break;
  }
});