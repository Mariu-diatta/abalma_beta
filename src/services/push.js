// Notifications push : navigateur (Web Push / VAPID) et application native (FCM via Capacitor).
import { Capacitor, registerPlugin } from '@capacitor/core';
import api from './Axios';
import { API_ENDPOINTS } from './apiEndpoints';

const { PUSH } = API_ENDPOINTS;
const FCM_TOKEN_KEY = 'abalma_fcm_token';

// Plugin natif (disponible après `npm i @capacitor/push-notifications && npx cap sync`).
const NativePush = registerPlugin('PushNotifications');

export class PushError extends Error {
    constructor(code, message) {
        super(message || code);
        this.code = code; // 'unsupported' | 'denied' | 'not_configured'
    }
}

export const isNative = () => Capacitor.isNativePlatform();

export const isWebPushSupported = () =>
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

export const isPushSupported = () => isNative() || isWebPushSupported();

/** 'granted' | 'denied' | 'default' | 'unsupported' */
export const getPermission = () => {
    if (isNative()) return 'default';
    return isWebPushSupported() ? Notification.permission : 'unsupported';
};

const urlBase64ToUint8Array = (base64) => {
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

const registerWorker = async () => {
    await navigator.serviceWorker.register('/sw.js');
    return navigator.serviceWorker.ready;
};

/** État affiché dans les réglages. */
export const getPushState = async () => {
    const [{ data: key }, { data: status }] = await Promise.all([
        api.get(PUSH.PUBLIC_KEY),
        api.get(PUSH.STATUS),
    ]);

    let deviceSubscribed = false;
    if (isWebPushSupported()) {
        const reg = await navigator.serviceWorker.getRegistration('/sw.js');
        deviceSubscribed = Boolean(reg && (await reg.pushManager.getSubscription()));
    } else if (isNative()) {
        deviceSubscribed = Boolean(localStorage.getItem(FCM_TOKEN_KEY));
    }

    return {
        supported: isPushSupported(),
        serverEnabled: isNative() ? true : Boolean(key.enabled),
        permission: getPermission(),
        subscribed: deviceSubscribed && status.subscribed,
        notificationsEnabled: status.notifications_enabled,
    };
};

const enableNative = async () => {
    const perm = await NativePush.requestPermissions();
    if (perm.receive !== 'granted') throw new PushError('denied');

    const token = await new Promise((resolve, reject) => {
        NativePush.addListener('registration', (t) => resolve(t.value));
        NativePush.addListener('registrationError', (e) => reject(new PushError('unsupported', e?.error)));
        NativePush.register();
    });

    localStorage.setItem(FCM_TOKEN_KEY, token);
    await api.post(PUSH.SUBSCRIBE, { kind: 'fcm', token });
};

const enableWeb = async () => {
    if (!isWebPushSupported()) throw new PushError('unsupported');

    const { data: key } = await api.get(PUSH.PUBLIC_KEY);
    if (!key.enabled || !key.public_key) throw new PushError('not_configured');

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new PushError('denied');

    const reg = await registerWorker();
    const existing = await reg.pushManager.getSubscription();
    const subscription =
        existing ||
        (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(key.public_key),
        }));

    await api.post(PUSH.SUBSCRIBE, { subscription: subscription.toJSON() });
};

export const enablePush = () => (isNative() ? enableNative() : enableWeb());

export const disablePush = async () => {
    if (isNative()) {
        const token = localStorage.getItem(FCM_TOKEN_KEY);
        localStorage.removeItem(FCM_TOKEN_KEY);
        await api.post(PUSH.UNSUBSCRIBE, token ? { token } : {});
        return;
    }

    let endpoint;
    if (isWebPushSupported()) {
        const reg = await navigator.serviceWorker.getRegistration('/sw.js');
        const sub = reg && (await reg.pushManager.getSubscription());
        if (sub) {
            endpoint = sub.endpoint;
            await sub.unsubscribe();
        }
    }
    await api.post(PUSH.UNSUBSCRIBE, endpoint ? { endpoint } : {});
};

export const sendTestPush = () => api.post(PUSH.TEST);
