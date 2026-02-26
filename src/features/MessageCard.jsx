import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ChatApp from '../pages/ChatApp';



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

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages().then(setMessages);
    }, []);



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
