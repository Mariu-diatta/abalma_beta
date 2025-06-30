import React, { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp, query, getDocs , doc, deleteDoc} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { ChatComponent } from './MessageForm';
import ChatApp from '../pages/ChatApp';


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
        <div className="flex flex-col justify-center items-center h-full w-full">

            <ChatApp />

        </div>
    );
};

export default MessageCard;
