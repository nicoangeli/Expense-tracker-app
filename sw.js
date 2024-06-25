// sw.js
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('offline-cache').then(function(cache) {
      // Aggiungi la pagina offline alla cache
      return cache.add('offline.html');
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      // Restituisci la pagina offline dalla cache se la fetch fallisce (utente offline)
      return caches.match('offline.html');
    })
  );
});
