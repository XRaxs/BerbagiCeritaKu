const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',  // Halaman utama
  '/src/index.html',  // Halaman utama (index.html berada di dalam folder src)
  '/src/styles/style.css',  // Gaya utama
  '/src/styles/transition.css',  // Gaya transisi
  '/src/index.js',  // Script utama
  '/src/router.js',  // File router untuk aplikasi
  '/public/images/icon.png',  // Ikon aplikasi
  '/public/images/marker-icon.png',  // Ikon badge untuk pemberitahuan
  '/public/manifest.json',  // Manifest aplikasi
  '/public/service-worker.js',  // Service worker itu sendiri
  "/BerbagiCeritaku/",
  "/BerbagiCeritaku/index.html",
  "/BerbagiCeritaku/bundle.js",
  "/BerbagiCeritaku/manifest.json",
  "/BerbagiCeritaku/service-worker.js",
  "/BerbagiCeritaku/images/78ea8c65cea28287bd90.png",
  "/BerbagiCeritaku/images/83e70a079ed6ad01f44d.png",
  "/BerbagiCeritaku/images/bf804537a8c269bb5df0.png"
];

// Event untuk push notification
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.options.body,
    icon: '/public/images/icon.png',  // Pastikan path ini benar
    badge: '/public/images/marker-icon.png',  // Pastikan path ini benar
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Event install untuk caching konten statis agar aplikasi dapat diakses offline
self.addEventListener('install', function(event) {
  console.log('Service Worker: Install event triggered');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching files...');
      return cache.addAll(urlsToCache).then(() => {
        console.log('Files successfully cached');
      }).catch((error) => {
        console.error('Caching failed for these URLs:', urlsToCache);
        console.error('Error:', error);  // Menangani error jika cache gagal
      });
    })
  );
});

// Event activate untuk menghapus cache lama yang tidak diperlukan
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Jika ada response dalam cache, gunakan itu. Jika tidak, lakukan fetch dari network.
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
        return new Response("Offline or fetch error", {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      })
  );
});
