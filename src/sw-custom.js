const baseURL = document.querySelector('base')?.getAttribute('href') || './';
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.options.body || 'Notification Body',
    icon:  `${baseURL}images/icon.png`,
    badge: `${baseURL}images/icon.png`,
    data: data.url || 'https://xraxs.github.io/BerbagiCeritaku/',
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

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

self.__WB_MANIFEST;