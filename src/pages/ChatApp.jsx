import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import { useTranslation } from 'react-i18next';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { addChatMessage, addMessageNotif, addPendingMessage, confirmPendingMessage } from '../slices/chatSlice';
import MessageBubble from '../features/MessageBoxChat';

// ─── Constantes ───────────────────────────────────────────────────────────────
const WS_READY = WebSocket.OPEN;

// ⚠️ NOTE D'ARCHITECTURE : ce composant se connecte à `ws/private/<user_id>/`,
// c'est-à-dire au consumer `PrivateChatConsumer` côté backend (chat privé 1-à-1,
// routage par utilisateur), PAS à `ChatConsumer` (chat par room). Toute la
// cohérence des formats ci-dessous est donc calée sur les payloads envoyés par
// `PrivateChatConsumer` (cf. consumers.py).

// ─── ChatApp ─────────────────────────────────────────────────────────────────
const ChatApp = ({ setShow, show }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedUserRef = useRef(null);

    const currentUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.chat.userSlected);
    const currentRoomChat = useSelector((state) => state.chat.currentChat);

    const messages = useMemo(() => { 
        return currentRoomChat?.messages ?? []
    }, [currentRoomChat]);

    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);

    const [wsStatus, setWsStatus] = useState('idle'); // idle | connected | error

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // ── WebSocket (avec reconnexion automatique) ──
    //
    // ⚠️ FIX : `selectedUser` a été RETIRÉ des dépendances de cet effet.
    // Le WS de PrivateChatConsumer est routé par utilisateur (groupe
    // "chat_<currentUser.id>"), pas par conversation : il n'a donc aucune
    // raison de se fermer/rouvrir quand on change de contact sélectionné.
    // Avant ce fix, chaque clic sur un contact fermait puis rouvrait la
    // connexion (effet de bord + flash de "wsStatus: idle"). On continue à
    // utiliser `selectedUserRef` (mis à jour par l'effet ci-dessus) pour lire
    // la conversation actuellement ouverte sans dépendre de `selectedUser`
    // dans la fermeture du `useEffect`.
    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;
        let reconnectTimer = null;
        let attempt = 0;

        // Normalise un message backend (`PrivateChatConsumer` payload.message)
        // vers la MÊME forme que le message optimiste créé dans `sendMessage`
        // ({ id, text, sender_id, receiver_id, created_at, isMine, pending }).
        // ⚠️ FIX : avant, cette fonction renvoyait `user` (et non `sender_id`)
        // et un champ `action: "send_message"` qui n'avait rien à faire ici
        // (copié par erreur depuis le format des messages SORTANTS). Si le
        // reducer `confirmPendingMessage` essaie de retrouver le message
        // optimiste correspondant, il a besoin d'une forme cohérente — sinon
        // le matching échoue silencieusement et on se retrouve avec deux
        // entrées pour le même message (l'optimiste + la version confirmée).
        const normalizeMessage = (msg, currentUserId) => {
            // Le backend envoie "user" comme entier brut (self.user.id), pas
            // comme objet — mais on garde le fallback `?.id` par robustesse
            // au cas où le format backend évoluerait un jour vers un objet.
            const senderId = msg?.user?.id ?? msg?.user;
            const receiverId = msg?.receiver_id ?? msg?.receiver?.id ?? msg?.receiver;

            return {
                id: msg?.id,
                text: msg?.text,
                sender_id: senderId,
                receiver_id: receiverId,
                created_at: msg?.created_at_formatted,
                isMine: senderId === currentUserId,
                pending: false,
            };
        };

        const connect = () => {
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            const socket = new WebSocket(`${protocol}://${backendBase}/ws/private/${currentUser.id}/`);
            wsRef.current = socket;

            socket.onopen = () => {
                attempt = 0;
                setWsStatus('connected');
            };

            socket.onmessage = (e) => {
                let data;
                try {
                    data = JSON.parse(e.data);
                } catch {
                    return;
                }

                if (data.action === 'new_message') {
                    const msg = data.message;
                    const senderId = msg?.user?.id ?? msg?.user;

                    // Conversation actuellement ouverte (lue via la ref, pas
                    // via `selectedUser` directement, puisque cet effet ne se
                    // relance plus à chaque changement de contact).
                    const openUser = selectedUserRef.current;

                    // Comme ce WS est routé par utilisateur (et pas par
                    // room), un message reçu ici a TOUJOURS `receiver_id`
                    // égal à `currentUser.id` (sauf écho de notre propre
                    // envoi). La seule comparaison pertinente pour savoir si
                    // le message appartient au fil ouvert est donc sur
                    // l'expéditeur, pas sur le destinataire.
                    const belongsToOpenThread = !!openUser && senderId === openUser.id;

                    if (senderId === currentUser.id) {
                        // Écho de notre propre message confirmé par le serveur :
                        // on remplace la version optimiste au lieu de la dupliquer.
                        const confirmed = normalizeMessage(msg, currentUser.id);
                        dispatch(confirmPendingMessage(confirmed));

                    } else if (belongsToOpenThread) {
                        dispatch(addChatMessage(normalizeMessage(msg, currentUser.id)));

                    } else {
                        // ⚠️ FIX : le backend n'envoie jamais d'objet "user"
                        // enrichi (juste un id entier), donc `msg?.user?.prenom`
                        // était toujours `undefined` et la notif affichait
                        // systématiquement "un contact". On ne peut pas
                        // retrouver le prénom de l'expéditeur depuis ce
                        // payload : tant que `PrivateChatConsumer` n'envoie
                        // pas un minimum d'info sur l'expéditeur (prenom/nom),
                        // on affiche un message générique honnête plutôt que
                        // de faire semblant d'avoir l'info.
                        dispatch(addMessageNotif(`Nouveau message d'un contact (id ${senderId})`));
                    }
                }

                if (data.action === 'typing') {
                    // ⚠️ FIX : avant, n'importe quel "typing" reçu (même
                    // venant d'un contact qui n'est pas la conversation
                    // ouverte) déclenchait l'indicateur. On filtre maintenant
                    // sur l'expéditeur du typing vs la conversation ouverte.
                    const openUser = selectedUserRef.current;
                    if (openUser && data.sender_id === openUser.id) {
                        setTyping(true);
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(() => setTyping(false), 1200);
                    }
                }
            };

            socket.onerror = () => setWsStatus('error');

            socket.onclose = () => {
                wsRef.current = null;
                if (cancelled) return;
                setWsStatus('idle');
                // Reconnexion progressive (1s, 2s, 4s... plafonnée à 15s)
                const delay = Math.min(1000 * 2 ** attempt, 15000);
                attempt += 1;
                reconnectTimer = setTimeout(connect, delay);
            };
        };

        connect();

        return () => {
            cancelled = true;
            clearTimeout(reconnectTimer);
            wsRef.current?.close();
        };
    }, [currentUser, dispatch]);

    // ── Scroll vers le bas (instantané, sans animation) ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }, [messages]);

    // ── Sync nav URL ──
    useEffect(() => {
        const url = window.location.href;
        if (url === IMPORTANTS_URLS?.MESSAGE_APP || url === IMPORTANTS_URLS?.MESSAGE_APPS) {
            dispatch(setCurrentNav(ENDPOINTS.MESSAGE_INBOX));
        }
    }, [dispatch]);

    // ── Envoi d'un message (affichage optimiste, instantané) ──
    const sendMessage = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || wsRef.current?.readyState !== WS_READY) return;

        // Forme alignée avec `normalizeMessage` ci-dessus, pour que
        // `confirmPendingMessage` puisse retrouver et remplacer ce message
        // optimiste avec la version confirmée par le serveur.
        const optimisticMessage = {
            id: `temp-${currentUser?.id}-${selectedUser?.id}-${Date.now()}`,
            text: trimmed,
            user:currentUser,
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
            pending: true,
        };

        dispatch(addPendingMessage(optimisticMessage));

        // Format attendu par `PrivateChatConsumer.handle_send_message` :
        // { action, text, receiver_id }. `sender_id` n'est pas lu côté
        // backend (le serveur fait confiance à l'utilisateur authentifié du
        // scope, pas à une valeur fournie par le client) — on le garde ici
        // uniquement parce qu'il ne coûte rien et peut servir au debug.
        wsRef.current.send(JSON.stringify({
            action: 'send_message',
            sender_id: currentUser?.id,
            receiver_id: selectedUser?.id,
            text: trimmed,
        }));

        setInput('');

    }, [input, currentUser, selectedUser?.id, dispatch]);

    // ── Indicateur de saisie ──
    const handleTyping = useCallback(() => {
        if (wsRef.current?.readyState !== WS_READY) return;

        wsRef.current.send(JSON.stringify({
            action: 'typing',
            sender_id: currentUser?.id,
            receiver_id: selectedUser?.id,
        }));
    }, [currentUser?.id, selectedUser?.id]);

    // ── Rendu ──
    return (
        <main className="chat-root flex h-full min-h-0 flex-col overflow-hidden border-0">

            {/* Header */}
            <header className="chat-header flex-shrink-0">
                {selectedUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            {(selectedUser?.image || selectedUser?.photo_url) ? (
                                <img
                                    src={selectedUser.image || selectedUser.photo_url}
                                    alt={`${selectedUser?.nom || 'Utilisateur'} avatar`}
                                    className="chat-avatar"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <div
                                    className="chat-avatar"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#6366f1',
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '.85rem',
                                    }}
                                >
                                    {(selectedUser?.prenom?.[0] || selectedUser?.nom?.[0] || '?').toUpperCase()}
                                </div>
                            )}
                            <span className="chat-online-dot" style={{ position: 'absolute', bottom: 1, right: 1 }} />
                        </div>

                        <div style={{ minWidth: 0 }}>
                            <p className="chat-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {selectedUser?.prenom || 'Prénom'}
                            </p>
                            <p className="chat-user-sub">
                                {selectedUser?.nom || 'Nom'}
                            </p>
                        </div>

                        {typing && (
                            <div className="chat-typing" style={{ marginLeft: 8 }}>
                                <span /><span /><span />
                                <span className="chat-typing-label">{t('typing')}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ fontSize: '.85rem', color: '#94a3b8', fontWeight: 500 }}>
                        Sélectionnez une conversation
                    </div>
                )}

                <ButtonToggleChatsPanel showSidebar={show} setShowSidebar={setShow} />
            </header>

            {/* Barre de statut WS */}
            <div className="chat-status-bar flex-shrink-0">
                <span className={`chat-status-dot ${wsStatus}`} />
                {wsStatus === 'connected' ? 'Connecté' : wsStatus === 'error' ? 'Erreur de connexion' : 'En attente…'}
            </div>

            {/* Zone messages */}
            {selectedUser ? (
                <div className="chat-messages-area flex min-h-0 flex-1 flex-col overflow-y-auto px-3">
                    {messages.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center py-10 text-xs text-gray-400">
                            Aucun message pour le moment — dites bonjour 👋
                        </div>
                    ) : (
                        <div className="mt-auto flex flex-col gap-1 px-2 py-[4dvh]">
                            {messages.map(msg => (
                                <MessageBubble
                                    key={`${msg.id}-${msg.created_at}`}
                                    msg={msg}
                                />
                            ))}
                            <div ref={messagesEndRef} className="pb-[10dvh]" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="chat-empty flex-1">
                    <div className="chat-empty-icon">
                        <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                        </svg>
                    </div>
                    <p className="chat-empty-title">{t("chat_empty_title")}</p>
                    <p className="chat-empty-sub">{t("chat_empty_sub")}</p>
                </div>
            )}

            {/* Input */}
            <footer className="chat-footer w-full flex-shrink-0">
                <InputBoxChat
                    disabled={!selectedUser}
                    input={input}
                    setInput={setInput}
                    setShow={setShow}
                    sendMessage={sendMessage}
                    handleTyping={handleTyping}
                />
            </footer>
        </main>
    );
};

export default ChatApp;