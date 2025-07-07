import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/Axios';

const ChatApp = ({ roomName }) => {

    const ws = useRef(null);

    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const currentUser = useSelector(state => state.auth.user);

    const allRoomsChats = useSelector(state => state.chat.currentChats);

    const selectedUser = useSelector(state => state.chat.userSlected);

    // 🔁 Fetch des anciens messages
    const fetchOldMessages = useCallback(async () => {

        try {

            const response = await api.get(`/rooms/?name=${roomName?.name}`);

            const loaded = [];

            response?.data?.forEach(room =>

                room?.messages?.forEach(msg =>

                    loaded.push({

                        message: msg?.text,

                        sender: msg?.user,

                        date: msg?.created_at_formatted,
                    })
                )
            );

            setMessages(loaded);

        } catch (err) {

            console.error("❌ Erreur chargement messages :", err);
        }

    }, [roomName]);

    // 🔌 Connexion WebSocket
    useEffect(() => {

        if (!roomName?.name) return;
        //process.env.NODE_ENV === 'production'
        const backendBase = true
            ? 'wss://backend-mpb0.onrender.com'
            : 'ws://localhost:8000';

        const socketUrl = `${backendBase}/chat/${roomName.name}/`;

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("✅ WebSocket connecté :", roomName.name);

        ws.current.onmessage = (e) => {

            try {
                const data = JSON.parse(e.data);

                if (data.type === "chat_message" && data.payload) {

                    setMessages(prev => [...prev, data.payload]);
                }

            } catch (err) {

                console.error("❌ Erreur parsing WebSocket :", err);
            }
        };

        ws.current.onerror = e => console.error("❌ WebSocket error :", e);

        ws.current.onclose = () => console.log("🔌 WebSocket fermé :", roomName.name);

        fetchOldMessages();

        return () => ws.current?.close();

    }, [roomName, fetchOldMessages]);

    // 📜 Scroll vers le bas à chaque message
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    }, [messages]);

    // ✉️ Envoi de message
    const sendMessage = useCallback(() => {

        const trimmed = input.trim();

        if (trimmed && ws.current?.readyState === WebSocket.OPEN) {

            ws.current.send(JSON.stringify({

                sender: currentUser,

                message: trimmed,

            }));

            setInput("");
        }

    }, [input, currentUser]);

    return (

        <div
            className="flex flex-col h-full p-4 md:p-6 bg-white rounded-2xl shadow overflow-hidden"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >

            {/* 👤 En-tête utilisateur */}
            {selectedUser && (

                <div className="flex items-center gap-3 text-gray-700 mb-3">

                    <img

                        src={selectedUser?.image || "/default-avatar.png"}

                        alt={`${selectedUser?.nom || "Utilisateur"} avatar`}

                        className="h-8 w-8 rounded-full object-cover"
                    />

                    <div>

                        <p className="text-md font-semibold text-blue-600">{selectedUser?.prenom || "Prénom"}</p>

                        <p className="text-xs text-gray-500">{selectedUser?.nom?.toLowerCase() || "Nom"}</p>

                    </div>

                </div>
            )}

            <div className="w-full h-px bg-gray-300 mb-3" />

            {/* 💬 Liste des messages */}
            <ul className="flex-1 overflow-y-auto space-y-3 pr-2" >

                {allRoomsChats.length > 0 && messages.map((msg, idx) => {

                    const isCurrentUser = msg.sender?.email === currentUser?.email;

                    const alignment = isCurrentUser ? "justify-end" : "justify-start";

                    const bubbleColor = isCurrentUser

                        ? "bg-blue-500 text-white rounded-br-none"

                        : "bg-gray-200 text-gray-800 rounded-bl-none";

                    return (

                        <li key={`${msg.date}-${idx}`} className={`flex items-end gap-2 ${alignment}`}>

                            {!isCurrentUser && (

                                <img
                                    src={msg.sender?.image}
                                    alt="avatar"
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                            )}

                            <div className={`max-w-[70%] px-4 py-2 text-sm shadow rounded-2xl ${bubbleColor}`}>

                                <p>{msg.message}</p>

                            </div>

                            {isCurrentUser && (

                                <img
                                    src={msg.sender?.image}
                                    alt="avatar"
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                            )}
                        </li>
                    );
                })}

                <div ref={messagesEndRef} />

            </ul>

            {/* 📥 Zone d’entrée */}
            <div className="mt-4 flex gap-2" >

                <input
                    disabled={allRoomsChats.length === 0}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                    aria-label="Envoyer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">

                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z" />

                    </svg>

                </button>

            </div>
        </div>
    );
};

export default ChatApp;
