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
        '/public/images/icon.png',
        '/public/manifest.json',  // Pastikan manifest di-cache
        '/src/views/AddStoryView.js',
        '/src/views/HomeView.js',
        '/src/presenters/AddStoryPresenter.js',
        '/public/images/marker-icon.png',
        '/public/images/marker-shadow.png',
      ]);
    }).catch((error) => {
      console.error('Caching failed:', error);
    })
  );
});

