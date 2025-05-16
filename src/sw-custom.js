self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.option.body || 'Notification Body',
    icon: '/images/icon.png',
    badge: '/images/icon.png',
    data: data.url || '/BerbagiCeritaku/',
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});

self.__WB_MANIFEST;