import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

// Precache i file statici
precacheAndRoute(self.__WB_MANIFEST);

// Cache-first strategy per i file statici
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new CacheFirst()
);

// Network-first strategy per i dati Firebase
registerRoute(
  ({ url }) => url.origin === 'https://firestore.googleapis.com',
  new NetworkFirst()
);