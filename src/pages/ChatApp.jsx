import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { backendBase} from '../utils';
import ButtonToggleChatsPanel from '../components/ButtonHandleChatsPanel';
import ProfilPictureView from '../components/ProfilPictureView';
import PrintMessagesOnChat from '../components/PrintMessagesObChats';

const ChatApp = ({ setShow , show}) => {

    const ws = useRef(null);
    const messagesEndRef = useRef(null);
    const currentChat = useSelector(state => state.chat.currentChat);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const currentUser = useSelector(state => state.auth.user);
    const allRoomsChats = useSelector(state => state.chat.currentChats);
    const selectedUser = useSelector(state => state.chat.userSlected);

    // 🔌 Connexion WebSocket
    useEffect(() => {

        if (!currentChat?.name) return;

        const socketUrl = `${backendBase}/chats/${currentChat.name}/`;

        // Ferme l'ancienne connexion si elle existe
        if (ws.current) {
            ws.current.close();
        }

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => console.log("✅ WebSocket connecté :", currentChat.name);

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
            className="flex flex-col w-screen rounded-2xl  overflow-hidden  bg-grey  border-grey-600 shadow-lg  z-8 w-full mb-0 "
        >

            <div className="flex justify-between items-align-center p-2">

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

            <div className="relative flex-1 space-y-0 pr-2">         

                <div className="w-full h-px bg-gray-300 mb-3" />

                {/* 💬 Liste des messages */}

                {
                        (messages?.length===0) ?
                        (
                            <ProfilPictureView
                                currentUser={selectedUser} /
                            >
                        )
                        :
                        (
                            <PrintMessagesOnChat
                                messages={messages}
                                currentUser={currentUser}
                                selectedUser={selectedUser}
                                messagesEndRef={messagesEndRef}
                            />

                        )

                }
                  
            </div>

            {/* 📥 Zone d’entrée */}
            <div className="bg-white fixed bottom-2  flex items-center gap-2 px-2 py-2 bg-white  rounded-xl w-full max-w-lg mb-0">
                <input
                    disabled={allRoomsChats.length === 0}
                    value={input}
                    onChange={e => { setInput(e.target.value); setShow(false); }}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                    aria-label="Envoyer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                        />
                    </svg>
                </button>
            </div>


        </div>
    );
};

export default ChatApp;