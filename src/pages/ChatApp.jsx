import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/Axios';

const ChatApp = ({ roomName = "general" }) => {
    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const currentUser = useSelector(state => state.auth.user);

    useEffect(() => {

        setMessages([])

        const socketUrl = `ws://localhost:8000/ws/chats/${roomName}/`;

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("✅ WebSocket connecté :", roomName);

        ws.current.onmessage = (e) => {

            try {
                const data = JSON.parse(e.data);
                if (data.type === "chat_message" && data.payload) {
                    setMessages(prev => [...prev, data.payload]);
                }
            } catch (err) {
                console.error("❌ Erreur JSON :", err);
            }
        };

        ws.current.onerror = (e) => console.error("❌ WebSocket error :", e);
        ws.current.onclose = () => console.log("🔌 WebSocket fermé");

        //get messages in already in the selected chat
        try {
            api.get(`/rooms/?name=${roomName}`).then(
                resp => {
                    console.log("MESSAGES DES ", resp?.data)

                    resp?.data?.map((el, _) =>
                        el?.messages.map(
                            (msg, _) =>

                                setMessages(prev =>
                                    [...prev,
                                        {
                                            "message": msg?.text,
                                            "sender": msg?.user,
                                            "date": msg?.created_at_formatted,
                                        }
                                    ]
                                )

                        )
                    )
                }
            )
        } catch (err) {

        }

        return () => ws.current?.close();
    }, [roomName]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const sendMessage = () => {

        const trimmed = input.trim();

        if (ws.current?.readyState === WebSocket.OPEN && trimmed) {

            ws.current.send(JSON.stringify({
                sender: currentUser,
                message: trimmed,
            }));

            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full p-4 md:p-6 bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                💬 Chat avec  <span className="text-blue-600">{roomName}</span>
            </h2>

            {/* Messages */}
            <ul className="scrollbor_hidden_ flex-1 overflow-y-auto space-y-3 pr-2 ">

                {messages.map((msg, idx) => {

                const isCurrentUser = msg.sender?.email === currentUser?.email;

                    return (

                    <li
                        key={idx}
                        className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        {!isCurrentUser && (
                            <img
                                src={msg.sender?.image}
                                alt={`${msg.sender?.name || "Utilisateur"} avatar`}
                                className="h-7 w-7 rounded-full object-cover"
                            />
                        )}

                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow 
                            ${isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'}  `
                }
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={sendMessage}
                    className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default ChatApp;
