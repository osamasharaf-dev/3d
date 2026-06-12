const CACHE_VERSION = 'v2';
const STATIC_CACHE  = `static-${CACHE_VERSION}`;
const IMAGE_CACHE   = `images-${CACHE_VERSION}`;
const FONT_CACHE    = `fonts-${CACHE_VERSION}`;

const STATIC_EXTENSIONS = ['.js', '.css', '.woff', '.woff2', '.otf', '.ttf'];
const IMAGE_EXTENSIONS  = ['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.avif'];
const PRECACHE_URLS = [
  '/',
  '/my-photo.avif',
  '/my-photo.webp',
  '/favicon.svg',
  '/fonts/poppins-400.woff2',
  '/fonts/poppins-600.woff2',
  '/fonts/poppins-700.woff2',
];

/* ── Install: precache critical shell assets ──────────────── */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' })))
        .catch(() => {})
    )
  );
});

/* ── Activate: delete old caches ──────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, IMAGE_CACHE, FONT_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch ─────────────────────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (request.url.includes('/api/')) return;

  const ext = url.pathname.substring(url.pathname.lastIndexOf('.')).toLowerCase();

  if (url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request, FONT_CACHE, { maxAge: 365 * 24 * 60 * 60 }));
    return;
  }

  if (IMAGE_EXTENSIONS.includes(ext)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, { maxAge: 30 * 24 * 60 * 60 }));
    return;
  }

  if (STATIC_EXTENSIONS.includes(ext) && (url.pathname.includes('/assets/') || url.pathname.includes('node_modules'))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, { maxAge: 365 * 24 * 60 * 60 }));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }
});

/* ── Strategies ────────────────────────────────────────────── */

async function cacheFirst(request, cacheName, { maxAge } = {}) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (!maxAge || !dateHeader) return cached;
    const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
    if (age < maxAge) return cached;
  }

  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    return cached || new Response('', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match('/') || new Response('', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((fresh) => { if (fresh.ok) cache.put(request, fresh.clone()); return fresh; })
    .catch(() => null);

  return cached || fetchPromise;
}
