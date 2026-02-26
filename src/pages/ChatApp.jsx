import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import BoxMessagesChats from '../features/MessageBoxChat';
import { useTranslation } from 'react-i18next';
import AnaliesChatsWithAi from './ChatWithAi';
import { backendBase } from '../services/Axios';
import { ENDPOINTS, IMPORTANTS_URLS } from '../utils';
import { setCurrentNav } from '../slices/navigateSlice';
import { useDispatch, } from 'react-redux';


const ChatApp = ({ setShow, show }) => {
    const { t } = useTranslation();
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const allRoomsChats = useSelector((state) => state.chat.currentChats);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {

        if (!currentUser) return;
        if (ws.current) return; // 🔒 empêche les reconnexions

        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        const socketUrl = `${protocol}://${backendBase}/ws/private/${currentUser.id}/`;

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log("✅ WS connecté (user) :", currentUser.id);
        };

        ws.current.onmessage = (e) => {

            try {
                const data = JSON.parse(e.data);

                if (data.action === "new_message") {
                    setMessages((prev) => [...prev, data.message]);
                }

                if (data.action === "typing") {
                    setTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1800);
                }

            } catch (err) {
                console.error("❌ WS parse error:", err);
            }
        };

        ws.current.onerror = (err) => {
            console.error("❌ WS error :", err);
            // ❌ ne pas fermer ici
        };

        ws.current.onclose = (e) => {
            console.log("🔌 WS fermé :", e.code, e.reason);
            ws.current = null;
        };

        return () => {
            ws.current?.close();
            ws.current = null;
            clearTimeout(typingTimeoutRef.current);
        };

    }, [currentUser]); // 👈 UNE SEULE dépendance


    // ===== Load previous messages =====
    useEffect(() => {
        setMessages([]);
        if (!currentChat?.messages) return;

        const formatted = currentChat.messages.map((msg) => ({
            id: msg?.id,
            text: msg.text,
            sender_id: msg?.user,
            created_at: msg?.created_at_formatted,
        }));

        setMessages(formatted);
    }, [currentChat, selectedUser]);

    // ===== Scroll to bottom =====
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(
        () => {
            const currentUrl = window.location.href;
            if (currentUrl === IMPORTANTS_URLS?.MESSAGE_APP || currentUrl === IMPORTANTS_URLS?.MESSAGE_APPS) {
                dispatch(setCurrentNav(ENDPOINTS.MESSAGE_INBOX))
            }

        }, [dispatch]
    )

    // ===== Send Message =====
    const sendMessage = useCallback(() => {
        const trimmed = input.trim();
        if (!trimmed || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        ws.current.send(JSON.stringify({
            action: "send_message",
            sender_id: currentUser?.id,
            receiver_id: selectedUser?.id,
            text: trimmed,
        }));

        setInput("");
    }, [input, currentUser?.id, selectedUser?.id]);

    // ===== Detect typing =====
    const handleTyping = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                action: "typing",
                sender_id: currentUser?.id,
                receiver_id: selectedUser?.id,
            }));
        }
    }, [currentUser?.id, selectedUser?.id]);

    return (
        <main className="flex flex-col w-screen rounded-2xl overflow-hidden bg-none shadow-sm z-8 w-full mb-0">

            <div className="md:hidden">
                <AnaliesChatsWithAi />
            </div>

            <section className="flex justify-between items-align-center p-2 bg-none max-h-[10dvh] min-h-[10dvh]">
                
            {selectedUser && (
                    <div className="flex items-center gap-3 text-gray-700 mb-3">

                        <img
                            src={selectedUser?.image || selectedUser?.photo_url || "/default-avatar.png"}
                            alt={`${selectedUser?.nom || "Utilisateur"} avatar`}
                            className="h-[40px] w-[40px] rounded-full object-cover"
                        />

                        <div>
                            <p className="text-md font-semibold text-blue-600">{selectedUser?.prenom || "Prénom"}</p>
                            <p className="text-xs text-gray-500">{selectedUser?.nom?.toLowerCase() || "Nom"}</p>
                        </div>

                        {
                            typing && (
                                <div className="text-xs text-gray-500 pl-3 pb-1 animate-pulse">
                                    {t('typing')}
                                </div>
                            )
                        }

                    </div>
                )}

                <div className="w-0" />

                <ButtonToggleChatsPanel showSidebar={show} setShowSidebar={setShow} />

            </section>

            <section>

                <BoxMessagesChats messages={messages} messagesEndRef={messagesEndRef} typing={typing} />

                <InputBoxChat
                    allRoomsChats={allRoomsChats}
                    input={input}
                    setInput={setInput}
                    setShow={setShow}
                    sendMessage={sendMessage}
                    handleTyping={handleTyping}
                />

            </section>

        </main>
    );
};

export default ChatApp;
