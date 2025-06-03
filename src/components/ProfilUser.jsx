import React, { useEffect, useState } from 'react';
import MessageForm from './MessageForm';
import { useAuth } from '../AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import { updateCompteUser, updateUserData } from '../slices/authSlice';




const ProfileCard = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false)
    const [profileUser, setProfileUser] = useState(false)
    const currentUserEmail = useSelector((state) => state.auth.user)
    const { currentUser } = useAuth()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('Utilisateur');
    const [comment, setComment] = useState("");
    const dispatch=useDispatch()

    const [previewUrl, setPreviewUrl] = useState(null);

    const getUserDataProfile = (profile) => {

        setProfileUser(profile)
    }

    const getUserCompte = async () => {
        try {
            const resp = await api.get("comptes/");
            const comptes = resp?.data || [];

            console.log("Liste des comptes:", comptes);
            console.log("Profil utilisateur:", profileUser);

            const user_compte = comptes.find(
                (compte) => compte?.user?.id === profileUser?.id && compte?.id != null
            );

            if (user_compte) {

                console.log("Compte utilisateur trouvé:", user_compte);

                dispatch(updateCompteUser(user_compte))

                const postResp = await api.post("fournisseurs/", {
                    compte_id: user_compte.id,
                    activite: "Fournisseur",
                    is_verified: true,
                });

                console.log("Fournisseur créé avec succès:", postResp?.data);
            } else {
                console.warn("Aucun compte correspondant trouvé pour l'utilisateur.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération ou création de fournisseur:", error);
        }
    };


    const [previewUrlBackground, setPreviewUrlBackground] = useState(null)

    useEffect(() => {

        api.get(`/utilisateurs/?email=${currentUserEmail?.email}`).then(

            resp => {

                console.log("UTILISATEUR CR2R", `/utilisateurs/?email=${currentUserEmail?.email}`, resp?.data[0])
                dispatch(updateUserData(resp?.data[0]))
                getUserDataProfile(resp?.data[0])
                setName(resp?.data[0]?.nom)
                setDescription(resp?.data[0]?.description)
                setComment(resp?.data[0]?.description)
                setPreviewUrlBackground(resp?.data[0]?.image)
                setPreviewUrl(resp?.data[0]?.image)
            }
        )
    },[])

    const handleImageUpload = (e, isBackground = false) => {

        const file = e.target.files[0];

        if (!file) return;

        const url = URL.createObjectURL(file);

        if (isBackground) {

            setPreviewUrlBackground(url);

            setIsEditingPhotoBg(false); // <-- cacher le champ une fois l'image choisie

        } else {

            setPreviewUrl(url);
        }
    };

    const handleNewMessage = (message) => {
        console.log('Message créé :', message);
        // Ici tu peux appeler `addDoc(...)` vers Firestore si tu veux l’enregistrer
    };

    const handleSave = () => {
        setIsEditing(false);
        alert("✅ Votre profil a été mis à jour avec succès.");
    };

    const handleUpgradeToPro = () => {
        setIsProFormVisible(false);
        alert("🎉 Félicitations ! Votre compte est maintenant professionnel.");
    };


    return (
        <div className="w-full max-w-full mx-auto bg-white rounded-md overflow-hidden shadow-md">
            {/* Image de couverture */}
            <div
                className="relative h-56 bg-cover bg-center bg-gray-200"
                style={{
                    backgroundImage: `url(${previewUrlBackground || "https://images.unsplash.com/photo-1612832020897-593fae15346e"})`
                }}
            >
                {isEditingPhotoBg && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="bg-gray rounded-md p-2 shadow-md text-sm"
                        />
                    </div>
                )}
                <button
                    onClick={() => setIsEditingPhotoBg(!isEditingPhotoBg)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                    📷
                </button>
            </div>

            {/* Section profil */}
            <div className="relative px-6 pb-6">
                {/* Photo de profil */}
                <div className="absolute -top-16 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">

                    <div className="relative">
                        <img
                            src={previewUrl || "https://randomuser.me/api/portraits/men/32.jpg"}
                            alt=""
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                            📷
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Informations utilisateur */}
                <div className="pt-20 sm:pt-6 sm:ml-40">
                    {!isEditing ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                            <p className="text-sm text-gray-500">{description}</p>
                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{comment}</p>
                        </>
                    ) : (
                        <form className="space-y-3 mt-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-sm"
                                placeholder="Nom"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-sm"
                                placeholder="Description"
                            />
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md text-sm"
                                placeholder="Commentaire"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Boutons d'action */}
                    {
                        currentUser?.displayName === "Marius DIATTA" ?

                        <div className="mt-6 flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Modifier
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-100"
                            >
                                Supprimer
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-gray-300 rounded hover:bg-green-100"
                                onClick={() => getUserCompte()}
                            >
                                Passer à compte Fournisseur
                            </button>
                            <button
                                onClick={() => setIsProFormVisible(true)}
                                className="px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-gray-300 rounded hover:bg-yellow-100"
                            >
                                Passer à compte pro
                            </button>
                        </div> :
                        <button
                            onClick={() => setMessageVisible(true)}
                            className="px-4 mt-2 py-2 text-sm font-medium text-yellow-600 bg-white border border-gray-300 rounded hover:bg-yellow-100"
                        >
                            Message
                        </button>
                    }

                    {/* Formulaire de confirmation pour compte pro */}
                    {isProFormVisible && (
                        <div className="mt-4 border border-yellow-300 p-4 rounded bg-yellow-50">
                            <p className="text-sm mb-2">
                                Êtes-vous sûr de vouloir passer à un compte professionnel ?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpgradeToPro}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Confirmer
                                </button>
                                <button
                                    onClick={() => setIsProFormVisible(false)}
                                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {messageVisible  && <MessageForm onSend={handleNewMessage} />}

        </div>
    );
};

export default ProfileCard;
