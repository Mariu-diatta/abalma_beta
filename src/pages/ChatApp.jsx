import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo
} from 'react';

import { useSelector, useDispatch } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import { useTranslation } from 'react-i18next';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import {
    addChatMessage,
    confirmPendingMessage,
} from '../slices/chatSlice';

import MessageBubble from '../features/MessageBoxChat';

const WS_READY = WebSocket.OPEN;

const ChatApp = ({ setShow, show }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // ─── Refs ───
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedUserRef = useRef(null);

    // ─── Redux ───
    const currentUser = useSelector((state) => state.auth.user);
    const selectedUser = useSelector((state) => state.chat.userSlected);
    const currentRoomChat = useSelector((state) => state.chat.currentChat);

    // ─── Local state ───
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [wsStatus, setWsStatus] = useState('idle'); // idle | connected | error
    const [loadingNewMessage, setLoadingNewMessage] = useState(false);

    // ─── Messages memo ───
    const messages = useMemo(() => {
        return currentRoomChat?.messages ?? [];
    }, [currentRoomChat]);

    // ─── sync selected user ref ───
    useEffect(() => {
        selectedUserRef.current = selectedUser;
    }, [selectedUser]);

    // ─── WS CONNECTION ───
    useEffect(() => {
        if (!currentUser) return;

        let socket;

        const normalizeMessage = (msg) => {
            const senderId = msg?.user?.id ?? msg?.user;

            return {
                id: msg.id,
                text: msg.text,
                sender_id: senderId,
                receiver_id: msg.receiver_id,
                created_at: msg.created_at,
                isMine: senderId === currentUser.id,
                pending: false,
                temp_id: msg.temp_id,
            };
        };

        const connect = () => {
            const protocol =
                window.location.protocol === 'https:' ? 'wss' : 'ws';

            socket = new WebSocket(
                `${protocol}://${backendBase}/ws/private/${currentUser.id}/`
            );

            wsRef.current = socket;

            socket.onopen = () => {
                setWsStatus('connected');
            };

            socket.onerror = () => {
                setWsStatus('error');
            };

            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);

                if (data.action === 'new_message') {
                    const msg = data.message;
                    const senderId = msg?.user?.id ?? msg?.user;

                    const openUser = selectedUserRef.current;

                    const belongsToOpenChat =
                        openUser && senderId === openUser.id;

                    const normalized = normalizeMessage(msg);

                    // ✔ message envoyé par nous → confirmation
                    if (senderId === currentUser.id) {
                        dispatch(confirmPendingMessage(normalized));
                        setLoadingNewMessage(false);
                    }

                    // ✔ message reçu dans conversation ouverte
                    else if (belongsToOpenChat) {
                        dispatch(addChatMessage(normalized));
                    }
                }

                if (data.action === 'typing') {
                    const openUser = selectedUserRef.current;

                    if (openUser && data.sender_id === openUser.id) {
                        setTyping(true);
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(
                            () => setTyping(false),
                            1200
                        );
                    }
                }
            };

            socket.onclose = () => {
                setWsStatus('idle');
                setTimeout(connect, 2000);
            };
        };

        connect();

        return () => socket?.close();
    }, [currentUser, dispatch]);

    // ─── SCROLL ───
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'auto',
        });
    }, [messages]);

    // ─── NAV SYNC ───
    useEffect(() => {
        const url = window.location.href;

        if (
            url === IMPORTANTS_URLS?.MESSAGE_APP ||
            url === IMPORTANTS_URLS?.MESSAGE_APPS
        ) {
            dispatch(setCurrentNav(ENDPOINTS.MESSAGE_INBOX));
        }
    }, [dispatch]);

    // ─── SEND MESSAGE (OPTIMISTIC UX) ───
    const sendMessage = useCallback(() => {
        const trimmed = input.trim();

        if (!trimmed || wsRef.current?.readyState !== WS_READY) return;

        if (!selectedUser) return;

        const tempId = `temp-${Date.now()}`;

        setLoadingNewMessage(true);

        //// ✔ message optimiste
        //const optimisticMessage = {
        //    id: tempId,
        //    text: trimmed,
        //    sender_id: currentUser.id,
        //    receiver_id: selectedUser.id,
        //    created_at: new Date().toISOString(),
        //    isMine: true,
        //    pending: true,
        //    temp_id: tempId,
        //};

        //// ✔ ajout UI immédiat
        //dispatch(addChatMessage(optimisticMessage));

        // ✔ envoi WS
        wsRef.current.send(
            JSON.stringify({
                action: 'send_message',
                sender_id: currentUser.id,
                receiver_id: selectedUser.id,
                text: trimmed,
                temp_id: tempId,
            })
        );

        setInput('');
    }, [input, currentUser, selectedUser]);

    // ─── TYPING ───
    const handleTyping = useCallback(() => {
        if (wsRef.current?.readyState !== WS_READY) return;
        if (!selectedUser) return;

        wsRef.current.send(
            JSON.stringify({
                action: 'typing',
                sender_id: currentUser.id,
                receiver_id: selectedUser.id,
            })
        );
    }, [currentUser, selectedUser]);

    // ─── RENDER ───
    return (
        <main className="chat-root flex h-full flex-col overflow-hidden">

            {/* HEADER */}
            <header className="chat-header flex-shrink-0">

                {selectedUser ? (
                    <div className="flex items-center gap-2">

                        <strong className="truncate">
                            {selectedUser.prenom} {selectedUser.nom}
                        </strong>

                        {typing && (
                            <span className="text-xs text-gray-400 animate-pulse">
                                {t('typing')}
                            </span>
                        )}

                    </div>
                ) : (
                    <div className="text-sm text-gray-400">
                        {t('select_conversation')}
                    </div>
                )}

                <ButtonToggleChatsPanel
                    showSidebar={show}
                    setShowSidebar={setShow}
                />
            </header>

            {/* STATUS WS */}
            <div className="text-xs px-3 py-1 text-gray-500 flex items-center gap-2">
                <span
                    className={`w-2 h-2 rounded-full ${
                        wsStatus === 'connected'
                            ? 'bg-green-500'
                            : wsStatus === 'error'
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                    }`}
                />
                {wsStatus}
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-3 scrollbor_hidden py-[12dvh]">

                {!selectedUser ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        {t('chat_empty_title')}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        {t('no_messages_yet')}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 py-3">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}

                        {loadingNewMessage && (
                            <div className="text-xs text-gray-400 animate-pulse">
                                {t('loading')}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* INPUT */}
            <footer className="chat-footer flex-shrink-0">

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