import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import { useAuth } from '../AuthContext';
import api from '../services/Axios';
import { logout, updateCompteUser, updateUserData } from '../slices/authSlice';
//import MessageForm from '../components/MessageForm';
import InputBox from '../components/InputBoxFloat';
import { addCurrentChat, addRoom, newRoom } from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { hashPassword } from '../components/OwnerProfil';

const ProfileCard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileData = useSelector((state) => state.auth.user);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const currentUser = useSelector((state) => state.auth.user);
    const allChats = useSelector(state => state.chat.currentChats);
    const currentChat = useSelector(state => state.chat.currentChat);

    const userProfile = useMemo(() =>
        (currentNav === "user_profil" || currentNav === "home") ? profileData :
        currentNav === "user_profil_product" ? selectedProductOwner :
        null,
        [currentNav, profileData, selectedProductOwner]
    );

    //const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    //const [isUserFournisseur, ] = useState(false);

    const isCurrentUser = useMemo(() => {

        return userProfile?.email === profileData?.email;

    }, [userProfile, profileData]);

    const [previewUrl, setPreviewUrl] = useState(userProfile?.image || null);
    const [previewUrlBackground, setPreviewUrlBackground] = useState(userProfile?.image_cover || null);
    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);
    const [fileProof, setFileProof] = useState(null);

    const [formData, setFormData] = useState({
        nom: userProfile?.nom || '',
        prenom: userProfile?.prenom || 'Utilisateur',
        email: userProfile?.email || '',
        adresse: userProfile?.adresse || '',
        telephone: userProfile?.telephone || '',
        description: userProfile?.description || ''
    });

    useEffect(() => {

        if (userProfile) {

            setFormData({

                nom: userProfile.nom || '',
                prenom: userProfile.prenom || '',
                email: userProfile.email || '',
                adresse: userProfile.adresse || '',
                telephone: userProfile.telephone || '',
                description: userProfile.description || ''
            });

            setPreviewUrl(userProfile.image || null);

            setPreviewUrlBackground(userProfile.image_cover || null);
        }
    }, [userProfile])


    const getRoomByName = useCallback(async (room) => {
        try {
            const response = await api.get(`/rooms/?name=${room?.name}`);

            dispatch(addCurrentChat(response[0]))

        } catch (err) {
            console.error("❌ Erreur chargement messages :", err);
        }
    }, []);


    const creatNewRoom= async () => {

            try {

                try {
                    const hashedPhone = await hashPassword(selectedProductOwner?.telephone);

                    const roomName = `room_${selectedProductOwner?.nom}_${hashedPhone}`;

                    await getRoomByName(roomName);

                    const roomExists = allChats?.some(room => room?.name === currentChat?.nom);

                    if (roomExists) {
 
                        return dispatch(setCurrentNav("message_inbox"));
                    }

                    try {
                        const response = await api.post('rooms/', {

                            name: `room_${selectedProductOwner?.nom}_${hashedPhone}`,

                            current_owner: currentUser?.id,

                            current_receiver: selectedProductOwner?.id
                        });

                        console.log("✅ Création du chat réussie:", response);

                        return dispatch(setCurrentNav("message_inbox"));

                    } catch (err) {

                        const errorMsg = err?.response?.data;

                        console.error("❌ Erreur création chat:", errorMsg);

                        const roomAlreadyExists = [

                            errorMsg?.name?.[0],

                            errorMsg?.current_receiver?.[0],

                            errorMsg?.current_owner?.[0]

                        ].some(msg => msg?.includes("already exists"));

                        if (roomAlreadyExists) {

                            try {

                                const fallbackHash = await hashPassword(selectedProductOwner?.telephone);

                                const fallbackRoom = `room_${selectedProductOwner?.nom}_${fallbackHash}`;

                                console.log("ℹ️ Room déjà existante, fallback :", fallbackRoom);

                                dispatch(addRoom(fallbackRoom));

                                dispatch(addCurrentChat(fallbackRoom));

                            } catch (hashErr) {

                                console.error("❌ Erreur fallback (hash):", hashErr);
                            }
                        } else {
                            console.error("❌ Erreur inconnue création chat:", errorMsg);
                        }
                    }

                } catch (err) {
                    console.error("❌ Erreur globale création de chat:", err);
                }

            } catch (err) {

                console.error("1 ERREUR DE LA CREATION DU CHAT", err?.response?.data?.name);

                if (err?.response?.data?.name[0] === 'room with this name already exists.') dispatch(setCurrentNav("message_inbox"));
            }

    };


    const getUserCompte = async () => {

        try {

            if (!profileData?.is_fournisseur) {

                const comptesRes = await api.get('comptes/');

                const userCompte = comptesRes.data.find(

                    (c) => c.user === profileData?.id && c.id != null
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

                        dispatch(updateUserData(updatedUser));

                        console.log('Création de fournisseur:', updatedUser);

                    } catch (err) {

                        console.log('Erreur création fournisseur:', err);
                    }


                    try {

                        await api.put(`/clients/${profileData?.id}/`, { is_fournisseur: true });

                        const user = { ...profileData };

                        user["is_fournisseur"] = true;

                        dispatch(updateUserData(user))

                        alert("Votre compte est passé à fournisseur");

                    } catch {

                        console.log("Erreur lors de la mise à jour de l'utilisateur");

                        alert("L'utilisateur est déjà un fournisseur");
                    }


                } else {

                    console.warn('Aucun compte utilisateur trouvé.');
                }

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

        if (!userProfile?.id) {
            alert('Erreur : ID utilisateur manquant');
            return;
        }

        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
            if (updateImage) fd.append('image', updateImage);
            if (updateImageCover) fd.append('image_cover', updateImageCover);

            const response = await api.put(`clients/${userProfile?.id}/`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(updateUserData(response.data.data));
            setIsEditing(false);
            alert('✅ Profil mis à jour !');
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

            const response = await api.put(`clients/${userProfile?.id}/`, formData, {

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

                await api.delete(`clients/${userProfile?.id}/`);

                alert('Votre compte a été supprimé avec succès');

                dispatch(logout());

                navigate('/logIn', { replace: true });
            }

        } catch (err) {

            console.error('Erreur de la suppression du compte', err);
        }
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
                            onChange={(e) => {
                                    handleImageUpload(e, true)
                                }
                            }
                            className="bg-gray rounded-md p-2 shadow-md text-sm"
                        />

                    </div>
                )}

                {
                    isCurrentUser &&

                    <button
                        onClick={() => setIsEditingPhotoBg(!isEditingPhotoBg)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        aria-label="Modifier image de couverture"
                    >
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                            </svg>

                    </button>
                }

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

                        {
                            isCurrentUser &&

                                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100" aria-label="Modifier photo de profil">

                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                                </svg>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e)}
                                    className="hidden"
                                />

                            </label>
                        }

                    </div>
                </div>

                {/* Infos utilisateur */}
                <div className="pt-20 sm:pt-6 sm:ml-40">

                    {!isEditing ? (
                        <>
                            <div className="flex gap-2 justify-between">

                                <div>
                                    <div className="flex items-center gap-2">

                                        <h1 className="text-2xl">{formData?.prenom}</h1>

                                        {userProfile?.is_pro && userProfile?.doc_proof && (
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

                                    <p className="text-sm text-gray-500">{formData?.nom}</p>

                                </div>

                                <div>
                                    {(!profileData?.is_pro && !isProFormVisible && isCurrentUser) && (


                                            <button
                                                onClick={() => setIsProFormVisible(true)}
                                                className='border-blue-400 border rounded-full inline-flex items-center justify-center py-2 px-4 text-center text-base font-medium text-primary hover:bg-blue-light-5 hover:text-body-color dark:hover:text-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-blue-light-3'>
                                                <span className='mr-[10px]'>
                                                    <svg class="w-auto h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />
                                                    </svg>
                                                </span>
                                                Passer en compte professionnel
                                            </button>

                                     
                                    )}
                                </div>

                            </div>

                            <textarea
                                name="description"
                                value={formData?.description}
                                onChange={handleChange}
                                disabled
                                className='w-full border-gray-200 border rounded-sm mt-2 inline-flex items-center justify-center py-2 px-4 text-center  text-primary hover:bg-blue-light-5 hover:text-body-color dark:hover:text-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-blue-light-3'
                                placeholder="Description"
                            />
                            
                        </>
                    ) : (
                        <form className="lg:w-1/2 mt-3 space-y-3 mt-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

                            <InputBox
                                type="text"
                                name="name"
                                placeholder="Nom"
                                value={formData?.nom}
                                onChange={handleChange}
                             />

                            <InputBox
                                type="text"
                                name="prenom"
                                value={formData?.prenom}
                                onChange={handleChange}
                                placeholder="Prénom"
                             />

                            <InputBox
                                type="email"
                                name="email"
                                value={formData?.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />

                            <InputBox
                                type="text"
                                name="adresse"
                                value={formData?.adresse}
                                onChange={handleChange}
                                placeholder="Adresse"
                             />

                            <InputBox
                                type="text"
                                name="telephone"
                                value={formData?.telephone}
                                onChange={handleChange}
                                placeholder="Téléphone"
                             />

                            <textarea
                                name="description"
                                value={formData?.description}
                                onChange={handleChange}
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

                    <div className="flex align-items-start mt-6 space-x-0 mb-3">

                        {

                            (!isEditing) && (
                            <>
                                {
                                    isCurrentUser &&
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="lg:flex gap-1 bg-gray-300 text-white px-3 py-1 rounded hover:bg-blue-700 m-1"
                                        title="Modifier le profil"

                                    >
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                                        </svg>
                                        Modifier le compte
                                    </button>
                                }

                                {
                                    !isCurrentUser &&
                                    <button

                                        onClick={
                                            () => {
                                                setMessageVisible(!messageVisible);
                                                creatNewRoom()
                                            }
                                        }

                                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 m-1"
                                    >
                                        {!messageVisible ? "Message" : "X"}

                                    </button>
                                }

                                {
                                    (!userProfile?.is_fournisseur || !userProfile?.is_fournisseur) &&
                                    <button
                                        onClick={getUserCompte}
                                        className="lg:flex gap-1 bg-indigo-300 text-white px-3 py-1 rounded hover:bg-indigo-700 m-1"
                                        title="Devenir un fournisseur"
                                    >
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                        </svg>
                                        Devenir fournisseur
                                    </button>
                                }

                                {
                                    isCurrentUser &&
                                    <button
                                        onClick={delAccountUser}
                                        className="lg:flex gap-1 bg-red-300 text-white px-3 py-1 rounded hover:bg-red-700 m-1"
                                        title="supprimer le compte"
                                    >
                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                        </svg>

                                        Supprimer le compte
                                    </button>
                                }
                            </>
                         )}

                    </div>

                    {isProFormVisible && isCurrentUser && (

                        <form onSubmit={handleUpgradeToPro} className="mt-6">

                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.png,.jpeg"
                                required
                                className="mb-2"
                            />

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                >
                                    Envoyer justificatif
                                </button>

                                <button
                                    type="submit"
                                    onClick={() => setIsProFormVisible(false)}
                                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}

          
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
