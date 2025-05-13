// Menerima event push dan menampilkan pemberitahuan
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.options.body,
    icon: 'images/icon.png',
    badge: 'images/badge.png'
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
        '/public/images/marker-icon.png',
        '/public/images/marker-shadow.png',
        '/public/manifest.json',
        '/src/views/AddStoryView.js',  // Menambahkan file view
        '/src/views/HomeView.js',  // File view lainnya
        '/src/presenters/AddStoryPresenter.js',  // File presenter
      ]).catch((error) => {
        console.error('Caching failed:', error);  // Menangani error jika cache gagal
      });
    })
  );
});
