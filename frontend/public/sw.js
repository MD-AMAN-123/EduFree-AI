// EduFree.AI Service Worker - Offline-First Learning & Assessment Engine
const CACHE_NAME = 'edufree-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/data/i18n.js',
  '/src/data/teluguContent.js',
  '/src/data/assessmentRules.js',
  '/src/data/recommendations.js',
  '/src/storage/db.js',
  '/src/storage/syncQueue.js',
  '/src/storage/exportImport.js',
  '/src/utils/speechAudio.js',
  '/src/utils/helpers.js',
  '/public/manifest.webmanifest',
  '/public/favicon.svg',
  '/public/icons/icon-192.svg',
  '/public/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Best effort pre-caching
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('Non-fatal pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stale-while-revalidate for local origin assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            // Network failed, return cached if exists, else fallback
            if (cachedResponse) return cachedResponse;
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/');
            }
            throw error;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
