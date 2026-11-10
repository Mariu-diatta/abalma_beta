import React, { useCallback, useEffect, useState } from 'react';
import {
    PushError,
    disablePush,
    enablePush,
    getPushState,
    sendTestPush,
} from '../services/push';

/**
 * Activation des notifications push (Paramètres > Préférences).
 * Gère les cas : navigateur non compatible, serveur non configuré,
 * permission refusée, activation, désactivation, notification de test.
 */
const PushNotificationsCard = ({ t, onChange }) => {
    const [state, setState] = useState(null);
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState(null); // { type: 'ok' | 'error', text }

    const refresh = useCallback(async () => {
        try {
            setState(await getPushState());
        } catch (error) {
            setState({ supported: false, serverEnabled: false, permission: 'unsupported', subscribed: false });
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const explainError = (error) => {
        if (error instanceof PushError) {
            if (error.code === 'denied') return t('settingsText.pushDenied', 'Notifications bloquées : autorisez-les dans les réglages de votre navigateur.');
            if (error.code === 'not_configured') return t('settingsText.pushNotConfigured', "Les notifications push ne sont pas encore configurées sur le serveur.");
            if (error.code === 'unsupported') return t('settingsText.pushUnsupported', "Ce navigateur ne prend pas en charge les notifications push.");
        }
        return t('settingsText.pushError', "Une erreur est survenue, réessayez.");
    };

    const toggle = async () => {
        if (busy || !state) return;
        setBusy(true);
        setFeedback(null);
        try {
            if (state.subscribed) {
                await disablePush();
                setFeedback({ type: 'ok', text: t('settingsText.pushOff', 'Notifications push désactivées.') });
                onChange?.(false);
            } else {
                await enablePush();
                setFeedback({ type: 'ok', text: t('settingsText.pushOn', 'Notifications push activées sur cet appareil.') });
                onChange?.(true);
            }
        } catch (error) {
            setFeedback({ type: 'error', text: explainError(error) });
        } finally {
            await refresh();
            setBusy(false);
        }
    };

    const test = async () => {
        setBusy(true);
        setFeedback(null);
        try {
            await sendTestPush();
            setFeedback({ type: 'ok', text: t('settingsText.pushTestSent', 'Notification de test envoyée.') });
        } catch (error) {
            setFeedback({ type: 'error', text: explainError(error) });
        } finally {
            setBusy(false);
        }
    };

    if (!state) {
        return <p className="text-sm text-gray-400">{t('settingsText.pushLoading', 'Chargement…')}</p>;
    }

    const unavailable = !state.supported || !state.serverEnabled;
    const blocked = state.permission === 'denied' && !state.subscribed;
    const disabled = busy || unavailable || (blocked && !state.subscribed);

    return (
        <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {t('settingsText.pushLabel', 'Notifications push')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {t('settingsText.pushHint', 'Soyez alerté d’une nouvelle commande, d’un message ou de l’avancement de votre colis, même application fermée.')}
                    </p>
                </div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={state.subscribed}
                    aria-label={t('settingsText.pushLabel', 'Notifications push')}
                    disabled={disabled}
                    onClick={toggle}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300
                        ${state.subscribed ? 'bg-indigo-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${state.subscribed ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>

            {unavailable && (
                <p className="text-xs text-amber-600">
                    {!state.supported
                        ? t('settingsText.pushUnsupported', "Ce navigateur ne prend pas en charge les notifications push.")
                        : t('settingsText.pushNotConfigured', "Les notifications push ne sont pas encore configurées sur le serveur.")}
                </p>
            )}

            {blocked && !unavailable && (
                <p className="text-xs text-amber-600">
                    {t('settingsText.pushDenied', 'Notifications bloquées : autorisez-les dans les réglages de votre navigateur.')}
                </p>
            )}

            {state.subscribed && (
                <button
                    type="button"
                    onClick={test}
                    disabled={busy}
                    className="text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 disabled:opacity-50"
                >
                    {t('settingsText.pushTest', 'Envoyer une notification de test')}
                </button>
            )}

            {feedback && (
                <p role="status" className={`text-xs ${feedback.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.text}
                </p>
            )}
        </div>
    );
};

export default PushNotificationsCard;
