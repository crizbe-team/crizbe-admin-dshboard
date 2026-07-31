// Crizbe Service Worker for Background Web Push Notifications

self.addEventListener('push', function (event) {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const title = data.title || '🛒 New Crizbe Order Received!';
        const options = {
            body: data.message || 'A customer just placed a new order.',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            data: {
                url: data.reference_id
                    ? `/bd6b-6ced/dashboard/orders/${data.reference_id}`
                    : '/bd6b-6ced/dashboard/orders',
            },
        };

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
        console.error('Error handling push event:', e);
    }
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
