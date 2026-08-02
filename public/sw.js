// Crizbe Service Worker for Background Web Push Notifications

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: '🛒 New Order Received!', message: event.data.text() };
        }
    }

    const title = data.title || '🛒 New Order Received!';
    const options = {
        body: data.message || 'A customer placed a new order.',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [300, 100, 300],
        requireInteraction: true,
        renotify: true,
        tag: data.reference_id || 'order-' + Date.now(),
        data: {
            url: data.reference_id
                ? `/bd6b-6ced/dashboard/orders/${data.reference_id}`
                : '/bd6b-6ced/dashboard/orders',
        },
    };

    // Broadcast push event instantly to all active window tabs
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        clientList.forEach((client) => {
            client.postMessage({
                type: 'PUSH_ORDER_ALERT',
                payload: data
            });
        });
    });

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/bd6b-6ced/dashboard/orders';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.includes('/bd6b-6ced/dashboard') && 'focus' in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
