import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import BoxMessagesChats from '../features/MessageBoxChat';
import { useTranslation } from 'react-i18next';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .chat-root * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

  /* Layout principal */
  .chat-root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    border-radius: 16px;
    overflow: hidden;
    background: #f8fafc;
    box-shadow: 0 8px 40px rgba(15,23,42,.1);
  }

  /* ── Header ── */
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: rgba(255,255,255,.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(226,232,240,.8);
    flex-shrink: 0;
    min-height: 64px;
    gap: 12px;
  }

  .chat-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #bfdbfe;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(59,130,246,.12);
  }

  .chat-user-name {
    font-size: .95rem;
    font-weight: 700;
    color: #1e40af;
    line-height: 1.2;
  }
  .chat-user-sub {
    font-size: .75rem;
    color: #94a3b8;
    text-transform: lowercase;
    line-height: 1;
    margin-top: 2px;
  }

  /* Indicateur "en ligne" */
  .chat-online-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px rgba(34,197,94,.2);
    flex-shrink: 0;
  }

  /* Indicateur typing */
  @keyframes chat-blink {
    0%, 80%, 100% { opacity: .25; transform: scale(.8); }
    40%           { opacity: 1;   transform: scale(1);   }
  }
  .chat-typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: #eff6ff;
    border-radius: 99px;
    border: 1px solid #bfdbfe;
  }
  .chat-typing span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #3b82f6;
    display: inline-block;
    animation: chat-blink 1.2s ease infinite;
  }
  .chat-typing span:nth-child(2) { animation-delay: .2s; }
  .chat-typing span:nth-child(3) { animation-delay: .4s; }
  .chat-typing-label {
    font-size: .72rem;
    color: #3b82f6;
    font-weight: 600;
    margin-left: 4px;
    white-space: nowrap;
  }

  /* Placeholder (pas de conversation sélectionnée) */
  .chat-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #94a3b8;
    padding: 32px;
    text-align: center;
  }
  .chat-empty-icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem;
  }
  .chat-empty-title { font-size: .95rem; font-weight: 600; color: #64748b; }
  .chat-empty-sub   { font-size: .8rem; color: #cbd5e1; }

  /* Zone messages */
  .chat-messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
    scroll-behavior: smooth;
    background: linear-gradient(180deg, #f0f7ff 0%, #f8fafc 100%);
  }
  .chat-messages-area::-webkit-scrollbar { width: 4px; }
  .chat-messages-area::-webkit-scrollbar-track { background: transparent; }
  .chat-messages-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
  .chat-messages-area::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }

  /* Pied (input) */
  .chat-footer {
    flex-shrink: 0;
    background: rgba(255,255,255,.9);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(226,232,240,.8);
  }

  /* Barre de statut connexion */
  .chat-status-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 16px;
    font-size: .7rem;
    font-weight: 600;
    color: #94a3b8;
    background: rgba(248,250,252,.8);
    border-bottom: 1px solid #f1f5f9;
  }
  .chat-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    transition: background .3s;
  }
  .chat-status-dot.connected { background: #22c55e; }
  .chat-status-dot.error     { background: #ef4444; }
`;

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
            <style>{styles}</style>
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