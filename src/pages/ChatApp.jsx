import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import { useTranslation } from 'react-i18next';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { addMessageNotif } from '../slices/chatSlice';
import MessageBubble from '../features/MessageBoxChat';

// ─── Constantes ───────────────────────────────────────────────────────────────
const WS_READY = WebSocket.OPEN;

// Convertit un id en valeur comparable : les ids temporaires ("temp-...", non
// numériques) sont toujours considérés comme les plus récents, donc placés
// en fin de liste tant que le serveur n'a pas confirmé le message.
const toComparableId = (id) => {
    const n = Number(id);
    return Number.isNaN(n) ? Infinity : n;
};

// Trie les messages par id croissant, donc dans l'ordre chronologique
// d'envoi (suppose des ids attribués de façon séquentielle côté backend).
const sortMessages = (msgs) =>
    [...msgs].sort((a, b) => toComparableId(a.id) - toComparableId(b.id));

// ─── ChatApp ─────────────────────────────────────────────────────────────────
const ChatApp = ({ setShow, show }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedUserRef = useRef(null);

    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [wsStatus, setWsStatus] = useState('idle'); // idle | connected | error

    const normalizeMessage = (msg, currentUserId) => {

        const senderId = msg.user?.id ?? msg.user;

        return {
            id: msg.id,
            text: msg.text,
            sender_id: senderId,
            created_at: msg.created_at_formatted,
            isMine: senderId === currentUserId,
        };
    };

    // ── WebSocket (avec reconnexion automatique) ──
    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;
        let reconnectTimer = null;
        let attempt = 0;

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
                    const receiverId = msg?.receiver?.id ?? msg?.receiver_id ?? msg?.receiver;

                    // Le WebSocket est "global" (par utilisateur, pas par room) :
                    // on ne doit ajouter le message au fil affiché que s'il
                    // appartient bien à la conversation actuellement ouverte,
                    // sinon il faut juste notifier sans mélanger les discussions.
                    const belongsToOpenThread =
                        selectedUserRef.current &&
                        (senderId === selectedUserRef.current.id || receiverId === selectedUserRef.current.id);

                    if (senderId === currentUser.id) {
                        // C'est l'écho de notre propre message confirmé par le serveur :
                        // on remplace la version optimiste (en attente) au lieu de la dupliquer.
                        setMessages(prev => {
                            const pendingIndex = prev.findIndex(
                                m => m.pending && m.text === msg.text
                            );
                            const confirmed = normalizeMessage(msg, currentUser.id);

                            if (pendingIndex !== -1) {
                                const updated = [...prev];
                                updated[pendingIndex] = confirmed;
                                return sortMessages(updated);
                            }
                            return sortMessages([...prev, confirmed]);
                        });
                    } else if (belongsToOpenThread) {
                        setMessages(prev => sortMessages([...prev, normalizeMessage(msg, currentUser.id)]));
                    } else {
                        dispatch(addMessageNotif(`Nouveau message de ${msg?.user?.prenom || 'un contact'}`));
                    }
                }

                if (data.action === 'typing') {
                    setTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1200);
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

    // ── Charger les messages du chat courant (triés chronologiquement) ──
    useEffect(() => {
        if (!currentChat?.messages) {
            setMessages([]);
            return;
        }

        setMessages(
            sortMessages(
                currentChat.messages.map(msg => normalizeMessage(msg, currentUser?.id))
            )
        );
    }, [currentChat, currentUser]);

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

        // Affiché immédiatement, sans attendre la réponse du serveur.
        const optimisticMessage = {
            id: `temp-${Date.now()}`,
            text: trimmed,
            sender_id: currentUser?.id,
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
            pending: true,
        };
        setMessages(prev => sortMessages([...prev, optimisticMessage]));

        wsRef.current.send(JSON.stringify({
            action: 'send_message',
            sender_id: currentUser?.id,
            receiver_id: selectedUser?.id,
            text: trimmed,
        }));
        setInput('');
    }, [input, currentUser?.id, selectedUser?.id]);

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
                                <MessageBubble key={msg.id} msg={msg} />
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