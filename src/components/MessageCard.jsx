import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, query, getDocs , doc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { ChatComponent } from './MessageForm';


// 🔼 Supprimer un message par son ID
const supprimerMessage = async (messageId) => {
    try {
        await deleteDoc(doc(db, 'messages', messageId));
        console.log(`Message supprimé : ${messageId}`);
    } catch (error) {
        console.error(`Erreur suppression message ${messageId}`, error);
    }
};

const fetchMessages = async () => {
    try {
        const snapshot = await getDocs(query(collection(db, 'messages')));
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                texte: data.texte,
                envoyeurId: data.envoyeurId,
                nomEnvoyeur: data.nomEnvoyeur,
                photoEnvoyeurUrl: data.photoEnvoyeurUrl,
                horodatage: data.horodatage?.toDate ? data.horodatage.toDate() : null,
                conversationId: data.conversationId,
                imageUrl: data.imageUrl,
                type: data.type,
                parentId: data.parentId ?? null,
                status: data.status ?? 'new',
            };
        });
    } catch (error) {
        console.error("Erreur récupération messages :", error);
        return [];
    }
};

const MessageCard = () => {

    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('all');
    const [replies, setReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [dropdownId, setDropdownId] = useState(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    useEffect(() => {
        fetchMessages().then(setMessages);
    }, []);

    const envoyerMessage = async (texte, parentId = null) => {

        if (!texte.trim() || !currentUser) return;

        try {
            await addDoc(collection(db, 'messages'), {
                texte,
                envoyeurId: currentUser.uid,
                nomEnvoyeur: currentUser.displayName || 'Anonyme',
                photoEnvoyeurUrl: currentUser.photoURL || '',
                horodatage: serverTimestamp(),
                conversationId: currentUser.uid,
                parentId,
            });

            setReplies((prev) => ({ ...prev, [parentId]: '' }));
            setReplyingTo(null);
            const updatedMessages = await fetchMessages();
            setMessages(updatedMessages);
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
        }
    };

    const handleFilter = (label) => {
        const statusMap = {
            Nouveaux: 'new',
            Lus: 'read',
            Supprimés: 'deleted',
        };
        setFilter(statusMap[label] || 'all');
        setShowFilterMenu(false);
    };

    const deleteMessage = (id) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, status: 'deleted' } : msg))
        );
        setDropdownId(null);
    };

    // Messages racines filtrés
    const rootMessages = messages
        .filter((msg) => !msg.parentId)
        .filter((msg) => filter === 'all' ? msg.status !== 'deleted' : msg.status === filter)
        .reduce((acc, msg) => {
            if (!acc[msg.conversationId]) acc[msg.conversationId] = msg;
            return acc;
        }, {});
    const filteredParents = Object.values(rootMessages);

    // Réponses groupées par parentId
    const groupedReplies = messages.reduce((acc, msg) => {
        if (msg.parentId) {
            const parentKey = msg.parentId.replace('msg-', '');
            if (!acc[parentKey]) acc[parentKey] = [];
            acc[parentKey].push(msg);
        }
        return acc;
    }, {});

    // Trier chaque groupe de réponses par horodatage décroissant (plus récent en premier)
    Object.keys(groupedReplies).forEach((key) => {
        groupedReplies[key].sort(
            (a, b) => (b.horodatage?.getTime?.() || 0) - (a.horodatage?.getTime?.() || 0)
        );
    });


    return (
        <div className="flex flex-col justify-center items-center gap-5">
            {/* Header */}
            <div className="flex items-center mb-6 space-x-4 relative">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h2>
                <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
                >
                    Filtres
                </button>
                {showFilterMenu && (
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 p-2 rounded shadow z-10">
                        {['Nouveaux', 'Lus', 'Supprimés'].map((label) => (
                            <button
                                key={label}
                                onClick={() => handleFilter(label)}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Messages */}
            {filteredParents.map((msg) => (
                <div
                    key={msg.id}
                    className="relative w-full max-w-md bg-gray-100 dark:bg-gray-700 rounded-xl space-y-2 p-4"
                >
 

                    {/* Message parent avant les réponses */}
                    <ChatComponent conversationId={msg.conversationId} />

                    {/* Réponses au-dessous du message parent */}
                    {[...(groupedReplies[msg.id] || [])].reverse().map((reply) => (
                        <div
                            key={reply.id}
                            className="mb-2 p-3 bg-white dark:bg-gray-800 rounded-md border-l-4 border-blue-500 shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-800 dark:text-gray-100">
                                    <strong>{reply.nomEnvoyeur} :</strong> {reply.texte}
                                </p>
                                <button
                                    onClick={() => supprimerMessage(reply.id)}
                                    title="Supprimer la réponse"
                                    className="text-red-600 hover:text-red-800 ml-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth="2" d="M5 7h14M10 11v6m4-6v6M9 3h6v2H9V3Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}



                    {/* Actions */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setDropdownId(dropdownId === msg.id ? null : msg.id)}
                            className="text-gray-500"
                        >
                            ...
                        </button>
                        {dropdownId === msg.id && (
                            <div className="absolute right-4 top-4 bg-white dark:bg-gray-700 shadow-md rounded z-20 p-2">
                                {['Répondre', 'Copier', 'Supprimer'].map((action) => (
                                    <button
                                        key={action}
                                        className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        onClick={() => {
                                            if (action === 'Supprimer') deleteMessage(msg.id);
                                            if (action === 'Répondre') setReplyingTo(msg.id);
                                            setDropdownId(null);
                                        }}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulaire de réponse */}
                    {replyingTo === msg.id && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                envoyerMessage(replies[msg.id] || '', msg.id);
                            }}
                            className="mt-2 flex flex-col gap-1"
                        >
                            <input
                                type="text"
                                value={replies[msg.id] || ''}
                                onChange={(e) =>
                                    setReplies({ ...replies, [msg.id]: e.target.value })
                                }
                                placeholder="Répondre à ce message..."
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                                type="submit"
                                className="self-end bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                            >
                                Envoyer
                            </button>
                        </form>
                    )}
                </div>

            ))}
        </div>
    );
};

export default MessageCard;
