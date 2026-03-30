import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import BoxMessagesChats from '../features/MessageBoxChat';
import { useTranslation } from 'react-i18next';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';

// ─── Constantes ───────────────────────────────────────────────────────────────
const WS_READY = WebSocket.OPEN;

// ─── ChatApp ─────────────────────────────────────────────────────────────────
const ChatApp = ({ setShow, show }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const allRoomsChats = useSelector((state) => state.chat.currentChats);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [wsStatus, setWsStatus] = useState('idle'); // idle | connected | error

    // ── WebSocket ──
    useEffect(() => {
        if (!currentUser || wsRef.current) return;

        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const socketUrl = `${protocol}://${backendBase}/ws/private/${currentUser.id}/`;
        const socket = new WebSocket(socketUrl);
        wsRef.current = socket;

        socket.onopen = () => setWsStatus('connected');

        socket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.action === 'new_message') {
                    setMessages((prev) => [...prev, data.message]);
                }
                if (data.action === 'typing') {
                    setTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1800);
                }
            } catch (err) {
                console.error('❌ WS parse error:', err);
            }
        };

        socket.onerror = () => setWsStatus('error');

        socket.onclose = () => {
            wsRef.current = null;
            setWsStatus('idle');
        };

        return () => {
            socket.close();
            wsRef.current = null;
            clearTimeout(typingTimeoutRef.current);
        };
    }, [currentUser]);

    // ── Charger les messages du chat courant ──
    useEffect(() => {
        if (!currentChat?.messages) { setMessages([]); return; }
        setMessages(
            currentChat.messages.map((msg) => ({
                id: msg?.id,
                text: msg.text,
                sender_id: msg?.user,
                created_at: msg?.created_at_formatted,
            }))
        );
    }, [currentChat, selectedUser]);

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
            <main className="chat-root">

                {/* Header */}
                <header className="chat-header">
                    {selectedUser ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <img
                                    src={selectedUser?.image || selectedUser?.photo_url || '/default-avatar.png'}
                                    alt={`${selectedUser?.nom || 'Utilisateur'} avatar`}
                                    className="chat-avatar"
                                />
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
                    <div className="chat-messages-area">
                        <BoxMessagesChats
                            messages={messages}
                            messagesEndRef={messagesEndRef}
                            typing={typing}
                        />
                    </div>
                ) : (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">💬</div>
                        <p className="chat-empty-title">Aucune conversation ouverte</p>
                        <p className="chat-empty-sub">Choisissez un contact pour commencer à échanger</p>
                    </div>
                )}

                {/* Input */}
                <footer className="chat-footer">
                    <InputBoxChat
                        allRoomsChats={allRoomsChats}
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