import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

// Base URL aplikasi kamu (sesuaikan kalau perlu)
const baseURL = '/BerbagiCeritaku/';

// Event push notification
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.options.body,
    icon:  `${baseURL}images/icon.png`,
    badge: `${baseURL}images/icon.png`,
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Event klik notifikasi
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const urlToOpen = event.notification.data || 'https://xraxs.github.io/BerbagiCeritaku/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Precache assets (generated oleh webpack)
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache halaman navigasi dengan NetworkFirst
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 3,
  })
);

// Cache CSS, JS, dan gambar lokal dengan CacheFirst
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination) && request.url.startsWith(self.location.origin),
  new CacheFirst({
    cacheName: 'assets-cache',
  })
);

// Cache gambar eksternal (API story) dengan CacheFirst
registerRoute(
  ({ url }) =>
    url.origin === 'https://story-api.dicoding.dev' &&
    url.pathname.startsWith('/images/stories/'),
  new CacheFirst({
    cacheName: 'external-image-cache',
  })
);

// Fallback gambar lokal jika gambar eksternal tidak tersedia saat offline
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => {
          return caches.match(`${baseURL}images/placeholder.png`);
        });
      })
    );
  }
});
