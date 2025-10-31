const CACHE_NAME = 'auralis-cache-v1';

// A list of assets to cache on installation.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/icons/favicon.ico',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Noto+Sans+KR:wght@300;400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
  // Key images, if any, can be added here
  'https://picsum.photos/1920/1080?grayscale&blur=2',
];

// Install event: open a cache and add the assets to it.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Fetch event: serve assets from cache if available.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the resource is in the cache, return it.
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network.
        return fetch(event.request);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
