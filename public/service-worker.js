const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/dist/bundle.js',
    '/manifest.webmanifest',
    '/index.js',
    // '/models/transaction.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/chart.js'
  ]


  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  
  self.addEventListener('install', function(evt) {
      evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log("Your files were pre-cached successfully!");
          return cache.addAll(FILES_TO_CACHE);
        })
      );
      self.skipWaiting();
  });
  
  self.addEventListener("activate", function(evt) {
      evt.waitUntil(
        caches.keys().then(keyList => {
          return Promise.all(
            keyList.map(key => {
              if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                console.log("Removing old cache data", key);
                return caches.delete(key);
              }
            })
          );
        })
      );
      self.clients.claim();
      });
  self.addEventListener('fetch', function(evt) {
      // code to handle requests goes here
      if (evt.request.url.includes("/api/")) {
        // make network request and fallback to cache if network request fails (offline)
        evt.respondWith(
          caches.open(DATA_CACHE_NAME).then(cache => {
            return fetch(evt.request)
              .then(response => {
                cache.put(evt.request, response.clone());
                return response;
              })
              .catch(() => caches.match(evt.request));
          })
        );
        return;
      }
      evt.respondWith(
          caches.open(CACHE_NAME).then(cache => {
              return cache.match(evt.request).then(response => {
              return response || fetch(evt.request);
              });
          })
          );
      });
  