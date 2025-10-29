import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { backendBase} from '../utils';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import InputBoxChat from '../components/InputBoxChat';
import BoxMessagesChats from '../features/MessageBoxChat';

const ChatApp = ({ setShow , show}) => {

    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const currentChat = useSelector(state => state.chat.currentChat);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const currentUser = useSelector(state => state.auth.user);
    const allRoomsChats = useSelector(state => state.chat.currentChats);
    const selectedUser = useSelector(state => state.chat.userSlected);

    // 🔌 Connexion WebSocket pour les messages
    useEffect(() => {

        if (!currentChat?.name) return;

        const socketUrl = `${backendBase}/chats/${currentChat.name}/`;

        // Ferme l'ancienne connexion si elle existe
        if (ws.current) {
            ws.current.close();
        }

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("✅ WebSocket connecté :", currentChat.name.slice(20,40));

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

        //ws.current.onerror = (e) => console.error("❌ WebSocket error :", e);
        //ws.current.onclose = () => console.log("🔌 WebSocket fermé :", currentChat.name);

        // Cleanup à la fin ou avant la prochaine exécution
        return () => {

            if (ws.current) {
                //console.log("🧹 Nettoyage WebSocket :", currentChat.name);
                ws.current.close();
            }
        };

    }, [currentChat?.name]);

    //récupérer les messages du chats
    useEffect(() => {

        setMessages([])

        // 🔁 Fetch des anciens messages
        const fetchOldMessages = async () => {

            try {

                const loaded = [];

                currentChat?.messages?.forEach(msg =>

                    loaded.push({

                        message: msg?.text,

                        sender: msg?.user,

                        date: msg?.created_at_formatted,
                    })
                )
          
                setMessages(loaded);

            } catch (err) {

                //console.error("❌ Erreur chargement messages :", err);
            }
        };

        fetchOldMessages()

    }, [selectedUser, currentChat?.messages]);

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
            className="flex flex-col w-screen rounded-2xl  overflow-hidden    bg-none shadow-lg  z-8 w-full mb-0  "
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

                        </div>
                    )
                }

                <div className="w-0" />

                <ButtonToggleChatsPanel showSidebar={show} setShowSidebar={setShow}/>

            </div>

            <BoxMessagesChats
                selectedUser={selectedUser}
                messages={messages}
                currentUser={currentUser}
                messagesEndRef={messagesEndRef}
            />

            {/* 📥 Zone d’entrée */}
            <InputBoxChat
                allRoomsChats={allRoomsChats}
                input={input}
                setInput={setInput}
                setShow={setShow}
                sendMessage={sendMessage}
            />

        </div>
    );
};

export default ChatApp;