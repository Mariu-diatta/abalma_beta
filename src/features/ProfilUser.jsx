import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../AuthContext';
import api from '../services/Axios';
import { logout, updateCompteUser, updateUserData } from '../slices/authSlice';
import MessageForm from '../components/MessageForm';
import InputBox from '../components/InputBoxFloat';

const ProfileCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUserData = useSelector((state) => state.auth.user);
    const { currentUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const [isUserFournisseur, setIsUserFournisseur] = useState(false);

    const [name, setName] = useState(currentUserData?.nom || '');
    const [prenom, setPrenom] = useState(currentUserData?.prenom || 'Utilisateur');
    const [email, setEmail] = useState(currentUserData?.email || '');
    const [adress, setAdress] = useState(currentUserData?.adresse || '');
    const [tel, setTel] = useState(currentUserData?.telephone || '');
    const [comment, setComment] = useState(currentUserData?.description || '');

    const [previewUrl, setPreviewUrl] = useState(currentUserData?.image || null);
    const [previewUrlBackground, setPreviewUrlBackground] = useState(currentUserData?.image_cover || null);
    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);
    const [fileProof, setFileProof] = useState(null);

    useEffect(() => {
        if (currentUserData) {
            setName(currentUserData.nom || '');
            setPrenom(currentUserData.prenom || 'Utilisateur');
            setEmail(currentUserData.email || '');
            setAdress(currentUserData.adresse || '');
            setTel(currentUserData.telephone || '');
            setComment(currentUserData.description || '');
            setPreviewUrl(currentUserData.image || null);
            setPreviewUrlBackground(currentUserData.image_cover || null);
            setIsUserFournisseur(currentUserData.is_fournisseur || false);
        }
    }, [currentUserData]);

    const getUserCompte = async () => {
        try {
            const fournisseursRes = await api.get('fournisseurs/');
            const userFournisseur = fournisseursRes.data.filter(
                (f) => f.compte?.user === currentUserData?.id && f.id != null
            );

            if (userFournisseur) {
                if (!currentUserData?.is_fournisseur) {
                    try {
                        await api.put(`/clients/${currentUserData.id}/`, { is_fournisseur: true });
                    } catch {
                        console.log("Erreur lors de la mise à jour de l'utilisateur");
                    }
                }

                alert("L'utilisateur est déjà un fournisseur");
                setIsUserFournisseur(true);
                return;
            }

            const comptesRes = await api.get('comptes/');
            const userCompte = comptesRes.data.find(
                (c) => c.user === currentUserData?.id && c.id != null
            );

            if (userCompte) {
                dispatch(updateCompteUser(userCompte));

                const formData = new FormData();
                formData.append('compte_id', userCompte.id);
                formData.append('activite', 'Fournisseur');
                formData.append('is_verified', 'true');

                try {
                    const fournisseurResp = await api.post('fournisseurs/', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    const updatedUser = fournisseurResp.data.compte.user;
                    updatedUser.is_fournisseur = true;
                    setIsUserFournisseur(true);
                    dispatch(updateUserData(updatedUser));
                    console.log('Création de fournisseur:', updatedUser);
                } catch (err) {
                    console.log('Erreur création fournisseur:', err);
                }
            } else {
                console.warn('Aucun compte utilisateur trouvé.');
            }
        } catch (error) {
            console.error('Erreur getUserCompte:', error);
        }
    };

    const handleImageUpload = (e, isBackground = false) => {
        const file = e.target.files?.[0];
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

        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentUserData?.id) {
            alert('Erreur : ID utilisateur manquant');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nom', name);
            formData.append('prenom', prenom);
            formData.append('description', comment);
            formData.append('email', email);
            formData.append('adresse', adress);
            formData.append('telephone', tel);
            if (updateImage) formData.append('image', updateImage);
            if (updateImageCover) formData.append('image_cover', updateImageCover);

            const response = await api.put(`clients/${currentUserData.id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(updateUserData(response.data.data));
            setIsEditing(false);
            alert('✅ Profil mis à jour !');
            console.log('✅ Mise à jour réussie :', response.data);
        } catch (error) {
            console.error('❌ Erreur mise à jour :', error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileProof(file);
            console.log('Fichier sélectionné :', file);
        }
    };

    const handleSaveDoc = async () => {
        if (!fileProof) {
            alert('Veuillez sélectionner un fichier avant de sauvegarder.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('is_pro', true);
            formData.append('doc_proof', fileProof);

            const response = await api.put(`clients/${currentUserData.id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(updateUserData(response.data.data));
            alert('✅ Justificatif envoyé avec succès !');
        } catch (error) {
            console.error('❌ Erreur d\'envoi :', error);
            alert('Erreur lors de l\'envoi du justificatif.');
        }
    };

    const handleUpgradeToPro = async (e) => {
        e.preventDefault();

        try {
            await handleSaveDoc();
            setIsProFormVisible(false);
            alert('🎉 Votre compte est maintenant professionnel.');
        } catch (error) {
            console.error('❌ Erreur mise à jour :', error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    const delAccountUser = async () => {
        try {
            if (window.confirm('Voulez-vous vraiment supprimer ce compte ?')) {
                await api.delete(`clients/${currentUserData.id}/`);
                alert('Votre compte a été supprimé avec succès');
                dispatch(logout());
                navigate('/logIn', { replace: true });
            }
        } catch (err) {
            console.error('Erreur de la suppression du compte', err);
        }
    };

    const handleNewMessage = (message) => {
        console.log('Message créé :', message);
    };

    return (
        <div className="w-full max-w-full mx-auto bg-white rounded-md overflow-hidden shadow-md">
            {/* Image de couverture */}
            <div
                className="relative h-56 bg-cover bg-center bg-gray-200"
                style={{ backgroundImage: `url(${previewUrlBackground || 'https://images.unsplash.com/photo-1612832020897-593fae15346e'})` }}
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
                    aria-label="Modifier image de couverture"
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
                            src={previewUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt="Photo de profil"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100" aria-label="Modifier photo de profil">
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
                            <div className="flex items-center gap-2">
                                <h1>{name}</h1>
                                {currentUserData?.is_pro && currentUserData?.doc_proof && (
                                    <svg
                                        className="w-5 h-5 text-blue-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{prenom}</p>
                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{comment}</p>
                        </>
                    ) : (
                        <form className="space-y-3 mt-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
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
                                placeholder="Prénom"
                            />
                            <InputBox
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                            <InputBox
                                type="text"
                                name="adress"
                                value={adress}
                                onChange={(e) => setAdress(e.target.value)}
                                placeholder="Adresse"
                            />
                            <InputBox
                                type="tel"
                                name="tel"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                placeholder="Téléphone"
                            />
                            <textarea
                                name="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full h-24 rounded-md border border-gray-300 p-2 resize-none"
                                placeholder="Description"
                            />
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 space-x-2">
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 m-1"
                                >
                                    Modifier profil
                                </button>
                                <button
                                    onClick={() => setMessageVisible(!messageVisible)}
                                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 m-1"
                                >
                                    Message
                                </button>
                               { !currentUserData?.is_fournisseur && <button
                                    onClick={getUserCompte}
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 m-1"
                                >
                                    Devenir fournisseur
                                </button>}
                                <button
                                    onClick={delAccountUser}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 m-1"
                                >
                                    Supprimer compte
                                </button>
                            </>
                        )}
                    </div>

                    {messageVisible && (
                        <MessageForm
                            userId={currentUserData?.id}
                            onMessageCreated={handleNewMessage}
                            onClose={() => setMessageVisible(false)}
                        />
                    )}

                    {isProFormVisible && (
                        <form onSubmit={handleUpgradeToPro} className="mt-6">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.png,.jpeg"
                                required
                                className="mb-2"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Envoyer justificatif
                            </button>
                        </form>
                    )}

                    {!currentUserData?.is_pro && !isProFormVisible && (
                        <button
                            onClick={() => setIsProFormVisible(true)}
                            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                        >
                            Passer en compte professionnel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
