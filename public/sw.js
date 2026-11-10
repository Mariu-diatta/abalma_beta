/* Service worker Abalma : notifications push.
 *
 * - "push"              : affiche la notification (sauf si l'application est
 *                         déjà au premier plan : la page est prévenue à la place) ;
 * - "notificationclick" : ouvre / ramène l'application sur l'URL de la notification.
 */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch (e) {
        payload = { title: 'Abalma', body: event.data ? event.data.text() : '' };
    }

    const title = payload.title || 'Abalma';
    const options = {
        body: payload.body || '',
        icon: payload.icon || '/logo192.png',
        badge: payload.badge || '/logo192.png',
        tag: payload.tag || undefined,       // même tag = remplace la précédente
        renotify: Boolean(payload.tag),
        data: { url: payload.url || '/', ...(payload.data || {}) },
    };

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const visible = windows.find((w) => w.visibilityState === 'visible' && w.focused);

        if (visible) {
            // L'application est ouverte : pas de notification système, la page s'en charge.
            visible.postMessage({ type: 'abalma-push', title, body: options.body, url: options.data.url });
            return;
        }
        await self.registration.showNotification(title, options);
    })());
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;

    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const w of windows) {
            if (w.url.startsWith(self.location.origin) && 'focus' in w) {
                await w.focus();
                if ('navigate' in w) await w.navigate(target);
                return;
            }
        }
        await self.clients.openWindow(target);
    })());
});
