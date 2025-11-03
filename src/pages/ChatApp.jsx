import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { backendBase} from '../utils';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import BoxMessagesChats from '../features/MessageBoxChat';
import { useTranslation } from 'react-i18next';


const ChatApp = ({ setShow , show}) => {

    const { t } = useTranslation();
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const currentChat = useSelector((state) => state.chat.currentChat);
    const currentUser = useSelector((state) => state.auth.user);
    const allRoomsChats = useSelector((state) => state.chat.currentChats);
    const selectedUser = useSelector((state) => state.chat.userSlected);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    // ✅ WebSocket connection
    useEffect(() => {

        if (!currentUser) return;

        const socketUrl = `${backendBase}/ws/private/${currentUser?.id}/`;

        if (ws.current) ws.current.close();

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {

            console.log("✅ WS connecté pour :", currentChat?.name);
        };

        ws.current.onmessage = (e) => {

            try {

                const data = JSON.parse(e.data);

                if (data.action === "new_message") {

                    setMessages((prev) => [...prev, data?.message]);
                }

                if (data.action === "typing") {

                    // typing effect here later
                    setTyping(true);

                    setTimeout(() => {

                        setTyping(false);

                    }, 1800);
                }

            } catch (err) {

                console.error("❌ WS parse error:", err);
            }
        };

        ws.current.onclose = () => console.log("🔌 WS fermé :", currentChat?.name);

        return () => ws.current?.close();

    }, [currentChat, currentUser]);

    // ✅ Load previous messages
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

    // ✅ Scroll to bottom
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);

    // ✅ Send Message
    const sendMessage = useCallback(() => {

        const trimmed = input.trim();

        if (!trimmed || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        ws.current.send(

            JSON.stringify({
                action: "send_message",
                sender_id: currentUser?.id,
                receiver_id: selectedUser?.id,
                text: trimmed,
            })
        );

        setInput("");

    }, [input, currentUser?.id, selectedUser?.id]);

    // ✅ detect typing
    const handleTyping = () => {

        if (ws.current?.readyState === WebSocket.OPEN) {

            ws.current.send(JSON.stringify({
                action: "typing",
                sender_id: currentUser?.id,
                receiver_id: selectedUser?.id,
            }));
        }
    };


    // ✅ detect read message
    //const handleReadMessage = () => {
    //    if (ws.current?.readyState === WebSocket.OPEN) {
    //        ws.current.send(JSON.stringify({
    //            action: "read",
    //            reader_id: currentUser?.id,
    //            room_id: currentChat?.id,
    //        }));
    //    }
    //};

    return (

        <div
            className="flex flex-col w-screen rounded-2xl  overflow-hidden bg-none shadow-sm  z-8 w-full mb-0  "
        >

            <div className="flex justify-between items-align-center p-2 bg-none max-h-[10dvh] min-h-[10dvh]">

                {/* 👤 En-tête utilisateur */}
                {
                    selectedUser && (

                        <div className="flex items-center gap-3 text-gray-700 mb-3">

                            <img
                                src={selectedUser?.image ||
                                    selectedUser?.photo_url ||
                                    "/default-avatar.png"
                                }
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
                    )
                }

                <div className="w-0" />

                <ButtonToggleChatsPanel showSidebar={show} setShowSidebar={setShow}/>

            </div>

            <BoxMessagesChats
                messages={messages}
                messagesEndRef={messagesEndRef}
                typing={typing}
            />

            {/* 📥 Zone d’entrée */}
            <InputBoxChat
                allRoomsChats={allRoomsChats}
                input={input}
                setInput={setInput}
                setShow={setShow}
                sendMessage={sendMessage}
                handleTyping={handleTyping}
            />

        </div>
    );
};

export default ChatApp;