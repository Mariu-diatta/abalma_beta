import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/Axios';

const ChatApp = ({ roomName }) => {
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const currentUser = useSelector(state => state.auth.user);
    const currentChat = useSelector(state => state.chat.currentChat);
    const allRoomsChats = useSelector(state => state.chat.currentChats);
    const selectedUser = useSelector(state => state.chat.userSlected);


    // 🔁 Récupération des anciens messages
    const fetchOldMessages = useCallback(async () => {

        try {
            const response = await api.get(`/rooms/?name=${roomName?.name}`);

            const loaded = [];

            response?.data?.forEach(room =>

                room?.messages?.forEach(msg => {

                    loaded.push({
                        message: msg?.text,
                        sender: msg?.user,
                        date: msg?.created_at_formatted,
                    });
                })
            );

            setMessages(loaded);

        } catch (err) {

            console.error("❌ Erreur chargement messages :", err);
        }

    }, [roomName]);

    // 🔌 Connexion WebSocket
    useEffect(() => {
        if (!roomName?.name) return;

        const socketUrl = `ws://localhost:8000/ws/chats/${roomName.name}/`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("✅ WebSocket connecté :", roomName.name);
        ws.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === "chat_message" && data.payload) {
                    setMessages(prev => [...prev, data.payload]);
                }
            } catch (err) {
                console.error("❌ Erreur de parsing JSON WebSocket :", err);
            }
        };
        ws.current.onerror = (e) => console.error("❌ WebSocket error :", e);
        ws.current.onclose = () => console.log("🔌 WebSocket fermé :", roomName.name);

        fetchOldMessages();

        return () => ws.current?.close();
    }, [roomName, fetchOldMessages]);

    // 📜 Scroll automatique
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
        <div className="flex flex-col h-full p-4 md:p-6 bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Titre */}
            <h2 className="flex text-xl font-semibold text-gray-700 mb-4">

                {/*{(currentChat && Object.keys(currentChat).length > 0) ? "💬 Chat :" : "Sélectionner une discussion"}{" "}*/}

                <span className="text-blue-600 flex gap-1">

                    <img
                        src={selectedUser?.image}
                        alt={`${selectedUser?.nom || "Moi"} avatar`}
                        className="h-7 w-7 rounded-full object-cover"
                    />

                    {selectedUser?.nom} {selectedUser?.prenom}

                </span>

            </h2>

            <div className="w-full h-px bg-gray-300 mb-3" />

            {/* Liste des messages */}
            <ul className="overflow-y-auto flex-1 space-y-3 pr-2">

                {messages.map((msg, idx) => {

                    const isCurrentUser = msg.sender?.email === currentUser?.email;

                    return (

                        <li
                            key={`${msg?.date}-${idx}`}

                            className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {!isCurrentUser && (

                                <img
                                    src={msg.sender?.image}
                                    alt={`${msg.sender?.name || "User"} avatar`}
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                            )}

                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow

                                    ${isCurrentUser
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.message}</p>
                            </div>

                            {isCurrentUser && (
                                <img
                                    src={msg.sender?.image}
                                    alt={`${msg.sender?.name || "Moi"} avatar`}
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                            )}

                        </li>
                    );
                })}

                <div ref={messagesEndRef} />

            </ul>

            {/* Input */}
            <div className="mt-4 flex gap-2">

                <input
                    disabled={allRoomsChats.length === 0}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                    Envoyer
                </button>

            </div>
        </div>
    );
};

export default ChatApp;
