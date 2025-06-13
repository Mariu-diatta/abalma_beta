import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const ChatApp = ({ roomName = "general" }) => {
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const currentUser = useSelector(state => state.auth.user);

    useEffect(() => {
        const socketUrl = `ws://localhost:8000/ws/chats/${roomName}/`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
            console.log("✅ WebSocket connecté à :", roomName);
        };

        ws.current.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);

                if (data.type === "chat_message" && data.payload) {
                    setMessages(prev => [...prev, data.payload]);
                } else {
                    console.warn("⚠️ Message ignoré :", data);
                }
            } catch (err) {
                console.error("❌ Erreur parsing JSON :", err);
            }
        };

        ws.current.onerror = (e) => {
            console.error("❌ WebSocket error :", e);
        };

        ws.current.onclose = () => {
            console.log("🔌 WebSocket fermé");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [roomName]);

    useEffect(() => {
        // Scroll auto vers le bas
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && input.trim() !== "") {
            const messageData = {
                sender: currentUser,
                message: input.trim(),
            };
            ws.current.send(JSON.stringify(messageData));
            setInput("");
        } else {
            console.warn("❗ WebSocket non connecté ou message vide");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-lg flex flex-col h-[85vh]">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                💬 Chat Room : <span className="text-blue-600">{roomName}</span>
            </h2>

            <ul className="scrollbor_hidden flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
                {messages.map((msg, idx) => {
                    const isCurrentUser = msg.sender?.email === currentUser?.email;
                    return (
                        <li
                            key={idx}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow transition-all duration-200 ease-in-out
                                    ${isCurrentUser
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >    <p>{msg.sender?.email}</p>
                                <p>{msg.message}</p>
                            </div>
                        </li>
                    );
                })}
                <div ref={messagesEndRef} />
            </ul>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
