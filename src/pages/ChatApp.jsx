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

                    if (belongsToOpenThread) {
                        setMessages(prev => [...prev, normalizeMessage(msg, currentUser.id)]);
                    } else if (senderId !== currentUser.id) {
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

    // ── Charger les messages du chat courant ──
    useEffect(() => {
        if (!currentChat?.messages) {
            setMessages([]);
            return;
        }

        setMessages(
            currentChat.messages.map(msg =>
                normalizeMessage(msg, currentUser?.id)
            )
        );
    }, [currentChat, currentUser]);

    // ── Scroll vers le bas ──
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Sync nav URL ──
    useEffect(() => {
        const url = window.location.href;
        if (url === IMPORTANTS_URLS?.MESSAGE_APP || url === IMPORTANTS_URLS?.MESSAGE_APPS) {
            dispatch(setCurrentNav(ENDPOINTS.MESSAGE_INBOX));
        }
    }, [dispatch]);

    // ── Envoi d'un message ──
    const sendMessage = useCallback(() => {
        console.log(
            'ws',
            wsRef.current,
            wsRef.current?.readyState
        );
        const trimmed = input.trim();
        if (!trimmed || wsRef.current?.readyState !== WS_READY) return;
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
        <>
            <main className="chat-root border-0">

                {/* Header */}
                <header className="chat-header">
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
                <div className="chat-status-bar">
                    <span className={`chat-status-dot ${wsStatus}`} />
                    {wsStatus === 'connected' ? 'Connecté' : wsStatus === 'error' ? 'Erreur de connexion' : 'En attente…'}
                </div>

                {/* Zone messages */}
                {selectedUser ? (
                    <div className="chat-messages-area flex flex-col px-3">
                        {messages.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 py-10">
                                Aucun message pour le moment — dites bonjour 👋
                            </div>
                        ) : (
                            messages.map(msg => (
                                <MessageBubble key={msg.id} msg={msg} />
                            ))
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="chat-empty">
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
                <footer className="chat-footer">
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
        </>
    );
};

export default ChatApp;

