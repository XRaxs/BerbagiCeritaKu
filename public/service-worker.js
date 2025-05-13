// Menerima event push dan menampilkan pemberitahuan
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.options.body,
    icon: 'images/icon.png',  // Tentukan ikon pemberitahuan
    badge: 'images/badge.png' // Tentukan badge pemberitahuan
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Event install untuk caching konten statis agar aplikasi dapat diakses offline
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/style.css',
        '/styles/transition.css',
        '/index.js',
        '/src/components/Header.js',
        '/images/marker-icon.png',
        '/images/marker-shadow.png',
        '/manifest.json',
        '/src/views/AddStoryView.js',  // Menambahkan file view
        '/src/views/HomeView.js',  // File view lainnya
        '/src/presenters/AddStoryPresenter.js',  // File presenter
      ]).catch((error) => {
        console.error('Caching failed:', error);  // Menangani error jika cache gagal
      });
    })
  );
});
