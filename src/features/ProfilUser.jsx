// 📦 Imports
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../AuthContext';
import api from '../services/Axios';
import { updateCompteUser, updateUserData } from '../slices/authSlice';
import MessageForm from '../components/MessageForm';
import InputBox from '../components/InputBoxFloat';

// 🧩 Composant principal
const ProfileCard = () => {

    // 🔄 Redux & Auth
    const dispatch = useDispatch();
    const currentUserData = useSelector((state) => state.auth.user);
    const { currentUser } = useAuth();

    // 🧠 State local
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const [profileUser, setProfileUser] = useState(false);
    const [name, setName] = useState(currentUserData?.nom || "");
    const [email, setEmail] = useState(currentUserData?.email || "");
    const [adress, setAdress] = useState(currentUserData?.adresse || "");
    const [tel, setTel] = useState(currentUserData?.telephone || "");



    const [prenom, setPrenom] = useState('');
    const [comment, setComment] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewUrlBackground, setPreviewUrlBackground] = useState(null);
    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);
    const [fileProof, setFileProof] = useState(null);



    // 🔧 Fonctions utilitaires
    const getUserDataProfile = (profile) => {
        setProfileUser(profile);
    };

    const getUserCompte = async () => {
        try {
            const resp = await api.get("comptes/");
            const comptes = resp?.data || [];
            const user_compte = comptes.find(
                (compte) => compte?.user?.id === profileUser?.id && compte?.id != null
            );

            if (user_compte) {
                dispatch(updateCompteUser(user_compte));

                const formData = new FormData();
                formData.append("compte_id", user_compte.id);
                formData.append("activite", "Fournisseur");
                formData.append("is_verified", "true");

                await api.post("fournisseurs/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                    .then((resp) => {
                        console.log("Création de fournisseur:", resp?.data?.compte?.user);
                        const user_ = resp?.data?.compte?.user;
                        user_["is_fournisseur"] = true;
                        dispatch(updateUserData(user_));
                    })
                    .catch((err) => console.log("Erreur création fournisseur:", err));
            } else {
                console.warn("Aucun compte utilisateur trouvé.");
            }
        } catch (error) {
            console.error("Erreur getUserCompte:", error);
        }
    };

    // 🎯 Side effect
    useEffect(() => {
        if (currentUserData) {
            getUserDataProfile(currentUserData);
            setName(currentUserData.nom || '');
            setPrenom(currentUserData.prenom || 'Utilisateur');
            setComment(currentUserData.description || '');
            setPreviewUrl(currentUserData.image || null);
            setPreviewUrlBackground(currentUserData.image_cover || null);
        }
    }, [currentUserData]);

    // 📸 Upload image
    const handleImageUpload = (e, isBackground = false) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);


        if (isBackground) {
            setUpdateImageCover(file);
            setPreviewUrlBackground(url);
            setIsEditingPhotoBg(false);

        } else {
            setUpdateImage(file);
            setPreviewUrl(url);
        }

        setIsEditing(true)
    };

    // ✅ Sauvegarde
    const handleSave = async () => {

        try {
            const formData = new FormData();
            formData.append("nom", name);
            formData.append("prenom", prenom);
            formData.append("description", comment);
            formData.append("email", email);
            formData.append("adresse", adress);
            formData.append("telephone", tel);

            if (updateImage) formData.append("image", updateImage);
            if (updateImageCover) formData.append("image_cover", updateImageCover);

            if (!currentUserData.id) {
                alert("Erreur : ID utilisateur manquant");
                return;
            }

            const response = await api.put(`clients/${currentUserData.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("✅ Mise à jour réussie :", response?.data);
            dispatch(updateUserData(response?.data?.data));
            setIsEditing(false);
            alert("✅ Profil mis à jour !");
        } catch (error) {
            console.error("❌ Erreur mise à jour :", error);
            alert("Erreur lors de la mise à jour du profil.");
        }
    };

    // Quand un fichier est sélectionné
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileProof(file);
            console.log("Fichier sélectionné :", file);
        }
    };

    // Quand on clique sur "Enregistrer justificatif"
    const handleSaveDoc = async (e) => {
  

        if (!fileProof) {
            alert("Veuillez sélectionner un fichier avant de sauvegarder.");
            return;
        }

        const formData = new FormData();
        formData.append("is_pro", true);
        formData.append("doc_proof", fileProof); // clé à adapter selon votre API

        try {
            const response = await api.put(`clients/${currentUserData.id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            dispatch(updateUserData(response?.data?.data));

            alert("✅ Justificatif envoyé avec succès !");
        } catch (error) {
            console.error("❌ Erreur d'envoi :", error);
            alert("Erreur lors de l'envoi du justificatif.");
        }
    }

    // 🔔 Message
    const handleNewMessage = (message) => {
        console.log('Message créé :', message);
    };

    // 🚀 Mise à niveau
    const handleUpgradeToPro =async () => {

        try {

            handleSaveDoc()

            setIsProFormVisible(false);
            alert("🎉 Votre compte est maintenant professionnel.");

        } catch (error) {
            console.error("❌ Erreur mise à jour :", error);
            alert("Erreur lors de la mise à jour du profil.");
        }

    };

    // 🖼️ Rendu JSX
    return (
        <div className="w-full max-w-full mx-auto bg-white rounded-md overflow-hidden shadow-md">
            {/* Image de couverture */}
            <div
                className="relative h-56 bg-cover bg-center bg-gray-200"
                style={{ backgroundImage: `url(${previewUrlBackground || "https://images.unsplash.com/photo-1612832020897-593fae15346e"})` }}
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

                {/* Infos utilisateur */}
                <div className="pt-20 sm:pt-6 sm:ml-40">
                    {!isEditing ? (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                            <p className="text-sm text-gray-500">{prenom}</p>
                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{comment}</p>
                        </>
                    ) : (
                        <form className="space-y-3 mt-4">

                            <InputBox
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />


                             <InputBox
                                type="text"
                                name="prenom"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                placeholder="Prenom"
                             />

                            <InputBox
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                             />

                            <InputBox
                                type="text"
                                name="adress"
                                placeholder="Adress"
                                value={adress}
                                onChange={(e) => setAdress(e.target.value)}
                             />

                            <InputBox
                                type="number"
                                name="number_call"
                                placeholder="Numéro de tel"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                            />

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                    className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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

                    {/* Actions */}
                    {currentUser?.displayName === "Marius DIATTA" ? (
                        <div className="mt-6 flex flex-col sm:flex-row gap-2">
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-100">
                                Modifier
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-100">
                                Supprimer
                            </button>
                            {!currentUserData.is_fournisseur && (
                                <button onClick={getUserCompte} className="cursor-pointer px-4 py-2 text-sm font-medium text-green-600 bg-white border border-gray-300 rounded hover:bg-green-100">
                                    Passer à compte Fournisseur
                                </button>
                            )}
                            {(!currentUserData?.is_pro && !currentUserData?.doc_proof) && <button onClick={() => setIsProFormVisible(true)} className="px-4 py-2 text-sm font-medium text-yellow-600 bg-white border border-gray-300 rounded hover:bg-yellow-100">
                                Passer à compte pro
                            </button>}
                        </div>
                    ) : (
                        <button onClick={() => setMessageVisible(true)} className="px-4 mt-2 py-2 text-sm font-medium text-yellow-600 bg-white border border-gray-300 rounded hover:bg-yellow-100">
                            Message
                        </button>
                    )}

                    {/* Confirmation pro */}
                    {isProFormVisible && (

                        <div className="mt-4 border border-yellow-300 p-4 rounded bg-yellow-50">

                            <form className="d-flex">

                                {
                                    !currentUserData?.doc_proof && !fileProof &&
                                    <>
                                        <div className="">

                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={handleFileChange}
                                                    className="bg-gray rounded-md p-2 shadow-md text-sm"
                                                />
                                            </div>

                                        </div>

                                        <p> <small>Enregistrer sur un seul document votre carte d'identité et justificatif domicile.</small></p>
                                    </>

                                }

                                {
                                     fileProof &&
                                     <>
                                        <p className="text-sm mb-2">
                                            Êtes-vous sûr de vouloir passer à un compte professionnel ?
                                        </p>

                                        <div className="flex gap-2">

                                            <button onClick={handleUpgradeToPro} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                                Confirmer
                                            </button>

                                            <button onClick={() => setIsProFormVisible(false)} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                                                Annuler
                                            </button>

                                        </div>
                                    </>
                                }
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Formulaire message */}
            {messageVisible && <MessageForm onSend={handleNewMessage} />}
        </div>
    );
};

export default ProfileCard;
