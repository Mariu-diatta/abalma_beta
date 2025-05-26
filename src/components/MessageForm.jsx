import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import {
    collection, addDoc, serverTimestamp, query,
    where, orderBy, onSnapshot, doc, deleteDoc,setDoc
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 🔼 Upload image vers Firebase Storage
const uploadImageAndGetURL = async (file) => {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
};

// 🔼 Supprimer un message par son ID
const supprimerMessage = async (messageId) => {
    try {
        await deleteDoc(doc(db, 'messages', messageId));
        console.log(`Message supprimé : ${messageId}`);
    } catch (error) {
        console.error(`Erreur suppression message ${messageId}`, error);
    }
};

// 🔼 Écouter les messages d'une conversation en temps réel
const ecouterMessagesConversation = (conversationId, callback) => {
    if (!conversationId) return;

    const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('horodatage', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            horodatage: doc.data().horodatage?.toDate?.() || null
        }));
        callback(messages);
    }, (error) => console.error("Erreur écoute messages :", error));
};


// 🔼 Composant d'affichage de la conversation
export const ChatComponent = ({ conversationId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = ecouterMessagesConversation(conversationId, setMessages);
        return () => unsubscribe?.();
    }, [conversationId]);

    return (
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
            {messages.map((msg) => (
                <div key={msg.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md space-y-1">
                    <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {msg.nomEnvoyeur || 'Anonyme'} :
                        </span>
                        <button onClick={() => supprimerMessage(msg.id)} title="Supprimer le message">
                            <svg className="w-4 h-4 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" d="M5 7h14M10 11v6m4-6v6M9 3h6v2H9V3Z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{msg.texte}</p>
                    {msg.image && <img src={msg.image} alt="envoyée" className="w-32 rounded shadow" />}
                    {msg.url && (
                        <a href={msg.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                            {msg.url}
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
};

// 🔼 Formulaire d’envoi de messages
const MessageForm = ({ onSend }) => {
    const { currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [fileSelected, setFileSelected] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [url, setUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [showImageUrl, setShowImageUrl] = useState(false);
    const [showLinkUrl, setShowLinkUrl] = useState(false);

    // conversationId : utiliser uid comme conversation unique
    const conversationId = currentUser?.uid;

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            setError("Le fichier dépasse 5 Mo.");
            setFileSelected(null);
            setPreviewUrl(null);
            return;
        }

        setError('');
        setFileSelected(file);
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
    };

    const resetForm = () => {
        setContent('');
        setFileSelected(null);
        setImageUrl('');
        setUrl('');
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || (!content && !fileSelected && !imageUrl && !url)) {
            setError("Le message ne peut pas être vide.");
            return;
        }

        let uploadedImageURL = null;
        if (fileSelected) {
            uploadedImageURL = await uploadImageAndGetURL(fileSelected);
        } else if (imageUrl) {
            uploadedImageURL = imageUrl;
        }

        const horodatage = new Date();
        const customId = `${currentUser.uid}_${horodatage.getTime()}`;

        const messageData = {
            texte: content,
            envoyeurId: currentUser.uid,
            nomEnvoyeur: currentUser.displayName || 'Anonyme',
            photoEnvoyeurUrl: currentUser.photoURL || null,
            horodatage,
            horodatageServeur: serverTimestamp(),
            conversationId,
            image: uploadedImageURL || null,
            parentId: null,
            url: url || null,
        };

        try {
            await setDoc(doc(db, 'messages', customId), messageData);
            onSend?.(messageData);
            resetForm();
        } catch (err) {
            console.error('Erreur envoi message :', err);
            setError('Échec de l’envoi.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <ChatComponent conversationId={conversationId} />
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    placeholder="Écris ton message ici..."
                    className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />

                <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => setShowImageUploader(!showImageUploader)}>📷 Image</button>
                    <button type="button" onClick={() => setShowImageUrl(!showImageUrl)}>🌐 URL image</button>
                    <button type="button" onClick={() => setShowLinkUrl(!showLinkUrl)}>🔗 Lien</button>
                </div>

                {showImageUploader && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0 file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                )}

                {showImageUrl && (
                    <input
                        type="url"
                        placeholder="URL directe d'une image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                )}

                {showLinkUrl && (
                    <input
                        type="url"
                        placeholder="Lien externe (ex : GitHub)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                )}

                {previewUrl && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Aperçu image :</p>
                        <img src={previewUrl} alt="Aperçu" className="w-32 h-auto rounded" />
                    </div>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default MessageForm;


