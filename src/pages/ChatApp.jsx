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
import { ENDPOINTS, IMPORTANTS_URLS, getMediaUrl } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { Users, Search, Bell, MoreHorizontal, FileText, Download } from 'lucide-react';

import {
    addChatMessage,
    confirmPendingMessage,
} from '../slices/chatSlice';
import { Video, Phone, Info } from 'lucide-react';

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
    const [showInfo, setShowInfo] = useState(false); // panneau profil à droite

    // ─── Messages memo ───
    const messages = useMemo(() => {
        return currentRoomChat?.messages ?? [];
    }, [currentRoomChat]);

    // ─── sync selected user ref ───
    useEffect(() => {
        selectedUserRef.current = selectedUser;
        // ferme le panneau profil quand on change de conversation
        setShowInfo(true);
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
        <div className="flex h-full w-full overflow-hidden">
            <main className="chat-root flex h-full flex-1 min-w-0 flex-col overflow-hidden">

                {/* HEADER */}
                <header className="chat-header flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-gray-100">

                    {selectedUser ? (
                        <div className="flex items-center gap-2 min-w-0">

                            {(() => {
                                const avatarSrc = selectedUser?.image || selectedUser?.photo_url;
                                const trusted = !!(selectedUser?.is_pro || selectedUser?.is_fournisseur || selectedUser?.fournisseur || selectedUser?.is_verified);

                                return avatarSrc ? (
                                    <img
                                        src={getMediaUrl(avatarSrc)}
                                        alt=""
                                        className={`w-9 h-9 rounded-full object-cover flex-shrink-0${trusted ? ' story-ring--trusted' : ''}`}
                                    />
                                ) : (
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-semibold flex-shrink-0${trusted ? ' story-ring--trusted' : ''}`}>
                                        {(selectedUser?.prenom?.[0] || selectedUser?.nom?.[0] || '?').toUpperCase()}
                                    </div>
                                );
                            })()}

                            <div className="min-w-0">
                                <strong className="truncate block text-sm font-semibold text-gray-800">
                                    {selectedUser.prenom} {selectedUser.nom}
                                </strong>

                                {typing && (
                                    <span className="text-xs text-gray-400 animate-pulse">
                                        {t('typing')}
                                    </span>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="text-sm text-gray-400">
                            {t('select_conversation')}
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {selectedUser && (
                            <>
                                <button
                                    className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                                    aria-label={t('video_call')}
                                >
                                    <Video size={16} />
                                </button>
                                <button
                                    className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                                    aria-label={t('audio_call')}
                                >
                                    <Phone size={15} />
                                </button>
                                <button
                                    onClick={() => setShowInfo((s) => !s)}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showInfo ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-500 hover:bg-indigo-100'
                                        }`}
                                    aria-label={t('conversation_info')}
                                >
                                    <Info size={16} />
                                </button>
                            </>
                        )}

                        <ButtonToggleChatsPanel
                            showSidebar={show}
                            setShowSidebar={setShow}
                        />
                    </div>
                </header>

                {/* STATUS WS */}
                <div className="text-[11px] px-4 md:px-6 py-1.5 text-gray-400 flex items-center gap-1.5 flex-shrink-0">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${wsStatus === 'connected'
                            ? 'bg-emerald-500'
                            : wsStatus === 'error'
                                ? 'bg-red-500'
                                : 'bg-gray-300'
                            }`}
                    />
                    {wsStatus === 'connected' ? t('connected') : wsStatus === 'error' ? t('connection_error') : t('connecting')}
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto px-3 scrollbor_hidden py-[12dvh] relative">

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
                <footer className="chat-footer flex-shrink-0 relative">

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

            {/* PANNEAU PROFIL */}
            {showInfo && (
                <ProfilePanel
                    selectedUser={selectedUser}
                    onClose={() => setShowInfo(!showInfo)}
                />
            )}
        </div>
    );
};

export default ChatApp;




/**
 * Panneau profil à droite du chat.
 * Reçoit `selectedUser` (même objet que dans ChatApp) + `onClose`.
 *
 * Champs optionnels attendus sur selectedUser, à adapter à ton API :
 *   - bio / description
 *   - company / entreprise
 *   - sharedMedia: [{ id, url }]
 *   - sharedFiles: [{ id, name, size, url }]
 * S'ils n'existent pas encore côté back, le panneau reste fonctionnel
 * avec des états vides.
 */
const ProfilePanel = ({ selectedUser, onClose }) => {
    const { t } = useTranslation();

    if (!selectedUser) return null;

    const avatarSrc = selectedUser?.image || selectedUser?.photo_url;
    const initials = (selectedUser?.prenom?.[0] || selectedUser?.nom?.[0] || '?').toUpperCase();
    const media = selectedUser?.sharedMedia || [];
    const files = selectedUser?.sharedFiles || [];

    return (
        <aside className="xl:flex flex-col w-[300px] flex-shrink-0 border-l border-gray-100 bg-white overflow-y-auto">

            {/* COVER */}
            <div
                className="h-24  relative z-0"
                style={{
                    backgroundImage: `url(${getMediaUrl(
                        selectedUser?.image_cover
                    )})`,
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
                    aria-label={t('close')}
                >
                    ✕
                </button>
            </div>

            {/* IDENTITY */}
            <div className="px-5 -mt-8 pb-5 border-b border-gray-100 z-[999]">
                {avatarSrc ? (
                    <img
                        src={getMediaUrl(avatarSrc)}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-white z-[999]"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full ring-2 ring-white flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-semibold">
                        {initials}
                    </div>
                )}

                <p className="mt-3 text-base font-semibold text-gray-800">
                    {selectedUser.prenom} {selectedUser.nom}
                </p>
                <p className="text-xs text-gray-400">
                    {selectedUser.role || selectedUser.metier}
                    {selectedUser.company ? ` • ${selectedUser.company}` : ''}
                </p>

                <div className="flex items-center gap-5 mt-4 hidden">
                    {[
                        { icon: Users, label: t('profile') },
                        { icon: Search, label: t('search') },
                        { icon: Bell, label: t('notifications') },
                        { icon: MoreHorizontal, label: t('more') },
                    ].map(({ icon: Icon, label }) => (
                        <button key={label} className="flex flex-col items-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                <Icon size={15} />
                            </div>
                            <span className="text-[10px]">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ABOUT */}
            {(selectedUser.bio || selectedUser.description) && (
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('about')}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        {selectedUser.bio || selectedUser.description}
                    </p>
                </div>
            )}

            {/* SHARED MEDIA */}
            <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">{t('shared_media')}</h3>
                    {media.length > 0 && (
                        <button className="text-xs text-indigo-500 hover:underline">{t('see_all')}</button>
                    )}
                </div>
                {media.length === 0 ? (
                    <p className="text-xs text-gray-400">{t('no_shared_media')}</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {media.slice(0, 5).map((m) => (
                            <img
                                key={m.id}
                                src={getMediaUrl(m.url)}
                                alt=""
                                className="aspect-square rounded-lg object-cover bg-gray-100"
                            />
                        ))}
                        {media.length > 5 && (
                            <div className="aspect-square rounded-lg bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                                +{media.length - 5}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SHARED FILES */}
            <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800">{t('shared_files')}</h3>
                    {files.length > 0 && (
                        <button className="text-xs text-indigo-500 hover:underline">{t('see_all')}</button>
                    )}
                </div>
                {files.length === 0 ? (
                    <p className="text-xs text-gray-400">{t('no_shared_files')}</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {files.map((f) => (
                            <div key={f.id} className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                                    <FileText size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-700 truncate">{f.name}</p>
                                    <p className="text-[10px] text-gray-400">{f.size}</p>
                                </div>
                                <a href={getMediaUrl(f.url)} target="_blank" rel="noreferrer">
                                    <Download size={13} className="text-gray-300 flex-shrink-0 hover:text-indigo-500" />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

