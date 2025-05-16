const baseURL = '/BerbagiCeritaku/';
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