let CACHE_NAME = "escape-monster-cache-v1";
let urlsToCache = [
  "./",
  "./bg.jpg",
  "./blood1.png",
  "./escape.css",
  "./escape.js",
  "./image2.png",
  "./image3.png",
  "./intropic1.png",
  "./index.html",
  "./intropicmobile.png",
  "./mon .png",
  "./player1.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
