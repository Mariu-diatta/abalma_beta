import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/Axios';
import { logout, updateCompteUser, updateUserData } from '../slices/authSlice';
import InputBox from '../components/InputBoxFloat';
import { addCurrentChat, addRoom} from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { hashPassword } from '../components/OwnerProfil';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';



const ProfileCard = () => {

    const { t } = useTranslation();

    // Imports et hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileData = useSelector((state) => state.auth.user);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const allChats = useSelector(state => state.chat.currentChats);
    const currentChat = useSelector(state => state.chat.currentChat);
    const messageAlert = useSelector((state) => state.navigate.messageAlert);

    const userProfile = useMemo(() => {

        if (currentNav === "user_profil" || currentNav === "home") return profileData;

        if (currentNav === "user_profil_product") return selectedProductOwner;

        return null;

    }, [currentNav, profileData, selectedProductOwner]);

    // États
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);

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

    // Synchronisation avec le profil actif
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
    }, [userProfile]);

    const isCurrentUser = useMemo(() => userProfile?.email === profileData?.email, [userProfile, profileData]);

    // Gestion des fichiers (image et justificatif)
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

    const handleFileChange = (e) => {

        const file = e.target.files?.[0];

        if (file) {

            setFileProof(file);

            console.log('Fichier sélectionné :', file);
        }
    };

    // Form handling
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Enregistrer la mise à jour du profil
    const handleSave = async () => {

        if (!userProfile?.id) return alert('Erreur : ID utilisateur manquant');

        try {
            const fd = new FormData();

            Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

            if (updateImage) fd.append('image', updateImage);

            if (updateImageCover) fd.append('image_cover', updateImageCover);

            const response = await api.put(`clients/${userProfile?.id}/`, fd, {

                headers: { 'Content-Type': 'multipart/form-data' }
            });

            dispatch(updateUserData(response.data.data));

            setIsEditing(false);

            alert('✅ Profil mis à jour !');

        } catch (error) {

            console.error('❌ Erreur mise à jour :', error);

            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    // Envoi du document de justificatif pro
    const handleSaveDoc = async () => {

        if (!fileProof) return alert('Veuillez sélectionner un fichier avant de sauvegarder.');

        try {

            const formData = new FormData();

            formData.append('is_pro', true);

            formData.append('doc_proof', fileProof);

            const response = await api.put(`clients/${userProfile?.id}/`, formData, {

                headers: { 'Content-Type': 'multipart/form-data' }

            });

            dispatch(updateUserData(response.data.data));

            alert('✅ Justificatif envoyé avec succès !');

        } catch (error) {

            console.error("❌ Erreur d'envoi :", error);

            alert("Erreur lors de l'envoi du justificatif.");
        }
    };

    const handleUpgradeToPro = async (e) => {

        e.preventDefault();

        await handleSaveDoc();

        setIsProFormVisible(false);

        alert('🎉 Votre compte est maintenant professionnel.');
    };

    // Suppression du compte
    const delAccountUser = async () => {

        try {

            if (window.confirm('Voulez-vous vraiment supprimer ce profil ?')) {

                await api.delete(`clients/${userProfile?.id}/`);

                alert('Votre compte a été supprimé avec succès');

                dispatch(logout());

                navigate('/logIn', { replace: true });
            }

        } catch (err) {

            console.error('Erreur de la suppression du compte', err);
        }
    };

    // Récupération ou création d’un compte fournisseur
    const getUserCompte = async () => {

        try {

            if (!profileData?.is_fournisseur) {

                const comptesRes = await api.get('comptes/');

                const userCompte = comptesRes.data.find((c) => c.user === profileData?.id);

                if (userCompte) {

                    dispatch(updateCompteUser(userCompte));

                    const formData = new FormData();

                    formData.append('compte_id', userCompte.id);

                    try {
                        const fournisseurResp = await api.post('fournisseurs/', formData, {

                            headers: { 'Content-Type': 'multipart/form-data' }
                        });

                        const responseGetUser = await api.get(`clients/${fournisseurResp.data.compte.user}/`);

                        dispatch(updateUserData(responseGetUser.data));

                    } catch (err) {

                        const Error = "Unable to create record: Invalid 'To' Phone Number:"

                        console.log(

                            'Erreur création fournisseur:',

                            err?.response?.data?.detail.includes(Error)
                        );  

                        if (err?.response?.data?.detail.includes(Error)) showMessage(dispatch, Error);
                    }

                } else {

                    console.warn('Aucun compte utilisateur trouvé.');

                    showMessage(dispatch, 'Aucun compte utilisateur trouvé.');
                }
            }

        } catch (error) {

            console.error('Erreur getUserCompte:', error);
        }
    };

    // Création de chat
    const getRoomByName = useCallback(async (room) => {

        try {

            const response = await api.get(`/rooms/?name=${room?.name}`);

            dispatch(addCurrentChat(response[0]));

        } catch (err) {

            console.error("❌ Erreur chargement messages :", err);
        }

    }, [dispatch]);

    const creatNewRoom = async () => {

        try {

            const hashedPhone = await hashPassword(selectedProductOwner?.telephone);

            const roomName = `room_${selectedProductOwner?.nom}_${hashedPhone}`;

            await getRoomByName({ name: roomName });

            const roomExists = allChats?.some(room => room?.name === currentChat?.nom);

            if (roomExists) return dispatch(setCurrentNav("message_inbox"));

            const response = await api.post('rooms/', {

                name: roomName,

                current_owner: profileData?.id,

                current_receiver: selectedProductOwner?.id

            });

            console.log("✅ Création du chat réussie:", response);

            dispatch(setCurrentNav("message_inbox"));

            navigate("/message_inbox")

        } catch (err) {

            const errorMsg = err?.response?.data;

            const roomAlreadyExists = [

                errorMsg?.name?.[0],

                errorMsg?.current_receiver?.[0],

                errorMsg?.current_owner?.[0]

            ].some(msg => msg?.includes("already exists"));

            if (roomAlreadyExists) {

                try {
                    const fallbackHash = await hashPassword(selectedProductOwner?.telephone);

                    const fallbackRoom = `room_${selectedProductOwner?.nom}_${fallbackHash}`;

                    dispatch(addRoom(fallbackRoom));

                    dispatch(addCurrentChat(fallbackRoom));

                } catch (hashErr) {

                    console.error("❌ Erreur fallback (hash):", hashErr);
                }

            } else {
                console.error("❌ Erreur création chat:", errorMsg);
            }
        }
    };

    return (

        <div

            className="border-0 style_bg w-full max-w-full mx-auto  rounded-md  h-full"

            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        >

            {/* Image de couverture */}
            <div
                className="relative h-[300px] bg-cover bg-center bg-gray-200"

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

                        aria-label={t('ProfilText.modifierCouverture')}
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                        
                        </svg>

                    </button>
                }

            </div>

            {/* Section profil */}
            <div className="relative px-6 pb-6 style_bg shadow-lg mb-3">

                {/* Photo de profil */}
                <div className="absolute -top-16 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">

                    <div className="relative">

                        <img
                            src={previewUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt="Profil utilisateur"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />

                        {
                            isCurrentUser &&

                                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100" aria-label="Modifier photo de profil">

                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
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

                                        {
                                            (userProfile?.is_pro && userProfile?.doc_proof) && (

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
                                            )
                                        }

                                    </div>

                                    <p className="text-sm text-gray-500">

                                        {formData?.nom}

                                    </p>

                                </div>

                                <div>
                                    {
                                        (!profileData?.is_pro && !isProFormVisible && isCurrentUser) && (

                                            <button

                                                onClick={() => setIsProFormVisible(true)}

                                                className='text-sm border-blue-400 border rounded-full inline-flex items-center justify-center py-2 px-4 text-center text-base font-medium text-primary hover:bg-blue-light-5 hover:text-body-color dark:hover:text-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-blue-light-3'
                                            >
                                                <span className='mr-[10px]'>

                                                    <svg className="w-auto h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />

                                                    </svg>

                                                </span>

                                                {t('ProfilText.passerPro')}

                                            </button>
                                        )
                                    }
                                </div>

                            </div>

                            <textarea

                                name="description"

                                value={formData?.description}

                                onChange={handleChange}

                                disabled

                                className='border-0 w-full border-gray-200 border rounded-sm mt-2 inline-flex items-center justify-center py-2 px-4 text-center  text-primary hover:bg-blue-light-5 hover:text-body-color dark:hover:text-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-blue-light-3'

                                placeholder={t('ProfilText.descriptionPlaceholder')}
                            />
                            
                        </>

                    ) : (

                        <form

                            className="lg:w-1/2 mt-3 space-y-3 mt-4"

                            onSubmit={

                                (e) => {

                                    e.preventDefault(); handleSave();
                                }
                            }
                        >

                            <InputBox
                                type="text"
                                name="name"
                                placeholder={t('ProfilText.nomPlaceholder')}
                                value={formData?.nom}
                                onChange={handleChange}
                             />

                            <InputBox
                                type="text"
                                name="prenom"
                                value={formData?.prenom}
                                onChange={handleChange}
                                placeholder={t('ProfilText.prenomPlaceholder')}
                             />

                            <InputBox
                                type="email"
                                name="email"
                                value={formData?.email}
                                onChange={handleChange}
                                placeholder={t('ProfilText.emailPlaceholder')}
                            />

                            <InputBox
                                type="text"
                                name="adresse"
                                value={formData?.adresse}
                                onChange={handleChange}
                                placeholder={t('ProfilText.adressePlaceholder')}
                             />

                            <InputBox
                                type="text"
                                name="telephone"
                                value={formData?.telephone}
                                onChange={handleChange}
                                placeholder={t('ProfilText.telephonePlaceholder')}
                                
                             />

                            <textarea
                                name="description"
                                value={formData?.description}
                                onChange={handleChange}
                                className="w-full h-24 rounded-md border border-gray-300 p-2 resize-none"
                                placeholder={t('ProfilText.descriptionPlaceholder')}
                            />

                            <div className="flex gap-4">

                                <button
                                    type="submit"
                                    className="rounded-lg bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {t('ProfilText.boutons.enregistrer')}

                                </button>

                                <button
                                    type="button"
                                    className="rounded-lg bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setIsEditing(false)}
                                >
                                    {t('ProfilText.boutons.annuler')}

                                </button>

                            </div>

                        </form>
                    )}

                    <div className="lg:flex sm:flex-wrap: wrap align-items-start mt-6 space-x-0 mb-3 gap-5">

                        {

                            (!isEditing) && (
                            <>
                                {
                                    isCurrentUser &&
                                    <button

                                        onClick={() => setIsEditing(true)}

                                        className="w-full rounded-lg flex gap-1 bg-gray-300 text-white  text-sm px-3 py-1 rounded hover:bg-blue-700 m-1"

                                        title="Modifier le profil"

                                    >
                                        <svg className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            
                                            <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="0.9" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                                       
                                        </svg>

                                        {t('ProfilText.modifierProfil')}

                                    </button>
                                }

                                {
                                    !isCurrentUser &&
                                    <button

                                        onClick={

                                            () => {

                                                setMessageVisible(!messageVisible);

                                                creatNewRoom()

                                                navigate("/message_inbox")
                                            }
                                        }

                                        className="w-full rounded-lg bg-yellow-600 text-white text-sm px-3 py-1 rounded hover:bg-yellow-700 m-1"
                                    >
                                        {!messageVisible ? "Message" : "X"}

                                    </button>
                                }

                                {
                                   (!userProfile?.is_fournisseur || !userProfile?.is_fournisseur) && isCurrentUser &&
                                    <button
                                        onClick={getUserCompte}
                                        className="w-full rounded-lg text-sm  flex gap-1 bg-indigo-300 text-white px-3 py-1 rounded hover:bg-indigo-700 m-1"
                                        title="Devenir un fournisseur"
                                    >
                                        <svg className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                                        
                                        </svg>

                                        {t('ProfilText.devenirFournisseur')}


                                    </button>
                                }
                                {
                                    isCurrentUser && <ModalForm />
                                }
                                {
                                    isCurrentUser &&
                                    <button

                                        onClick={delAccountUser}

                                        className="w-full rounded-lg flex gap-1 bg-red-300 text-white text-sm px-3 py-1 rounded hover:bg-red-700 m-1"

                                        title="supprimer le compte"
                                    >
                                       <svg 
                                            className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                             
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />

                                        </svg>

                                        {t('ProfilText.supprimerProfil')}

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

                                    className="rounded-lg bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                >
                                    {t('ProfilText.envoyerJustificatif')}

                                </button>

                                <button
                                    type="submit"

                                    onClick={() => setIsProFormVisible(false)}

                                    className="rounded-lg bg-red-600 text-white px-4 py-1 rounded hover:bg-green-700"
                                >
                                    {t('ProfilText.annuler')}

                                </button>

                            </div>

                        </form>
                    )}

                </div>

            </div>

            {
                messageAlert && <AttentionAlertMesage title="Erreur" content={messageAlert} /> 
            }

            {
                (profileData?.is_fournisseur && !profileData?.is_verified) && <GetValidateUserFournisseur isCurrentUser={isCurrentUser} />
            }

        </div>
    );
};

export default ProfileCard;


//validation code pour la création d'un compte fournisseur
const GetValidateUserFournisseur = ({ isCurrentUser }) => {

    const { t } = useTranslation();

    const [code, setCode] = useState('');

    const [error, setError] = useState('');

    const [verified, setVerified] = useState(false);

    const profileData = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    const handleCodeChange = (e) => {

        setCode(e.target.value);

        setError('');
    };

    const handleSubmitCode = async (e) => {

        e.preventDefault();

        if (!code || isNaN(code)) {

            setError('Veuillez entrer un code valide.');
            return;
        }

        // Appel du callback ou d'une API
        try {

            const formData = new FormData()

            formData.append("code_validation=", code)

            const response = await api.get(`/fournisseurs/?code_validation=${code}/`)

            if (!!response?.data[0]?.compte?.id) {

                const responseUser = await api.put(`/clients/${response?.data[0]?.compte?.id}/`, { "is_verified": true })

                console.log("COMPTE FOURNISSEUR CREER AVEC SUCCES", responseUser)

                const updateUser = { ...profileData, "is_verified": true }

                dispatch(updateUserData(updateUser))

                setVerified(true) 

                showMessage(dispatch, "Compte fournisseur créer avec succès)");

            } else {

                console.log("ERREUR FOURNISSEUR NON VERIFIER")

                showMessage(dispatch, "Erreur veuillez vérifier votre code");
            }


        } catch (e) {

        }

    };

    return (

        <>
       
            {
                (!verified && isCurrentUser) ?

                <form

                    onSubmit={handleSubmitCode}

                        className="w-full max-w-md mx-auto bg-white rounded-xl p-6 shadow-md space-y-4 shadow-lg"

                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                >
                    <div>

                        <label 
                            htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1"

                            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                        >
                            {t('ProfilText.confirmCode')}

                        </label>

                        <input
                            type="number"
                            name="code"
                            id="code"
                            value={code}
                            onChange={handleCodeChange}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: 123456"
                            min="0"
                            autoComplete="one-time-code"
                            required
                        />

                    </div>

                    {
                        error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )
                    }

                    <button

                        type="submit"

                        disabled={!code}

                        className={
                            `w-full py-2 px-4 rounded-md text-white text-sm font-medium transition duration-200
                            ${
                                code
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`
                        }
                    >
                        {t('ProfilText.validate')}

                    </button>

                </form >
                :
                <>
                </>
            }
        </>

    )
}

const ModalForm = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    // États du formulaire
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Simule la récupération de l'utilisateur connecté
    // À remplacer par ta logique d'authentification réelle
    const getCurrentUser = () => {
        return { id: 1, name: "Utilisateur Demo" };
    };

    const handleToggleModal = () => {
        setError("");
        setSuccess("");
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle("");
        setMessage("");
        setError("");
        setSuccess("");
    };

    // Focus input quand modal s'ouvre
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Fermer modal si clic à l'extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!title.trim() || !message.trim()) {
            setError(t("blog.fill_all_fields") || "Veuillez remplir tous les champs");
            return;
        }

        try {
            const user = getCurrentUser();

            if (!user) {
                setError(t("blog.user_not_authenticated") || "Utilisateur non authentifié");
                return;
            }

            const payload = {
                title_blog: title,
                blog_message: message,
            };

            // Exemple : POST (ou PUT) vers ton API
            await api.post("blogs/", payload);

            setSuccess(t("blog.blog_created") || "Blog créé avec succès !");
            setTitle("");
            setMessage("");

            // Fermer modal après délai (ex : 1.5s)
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            console.error("Erreur lors de la création du blog", err);
            setError(t("blog.error_creating") || "Erreur lors de la création du blog");
        }
    };

    return (
        <div className="relative " role="dialog" aria-modal="true">
            {/* Toggle Button */}
            <button
                onClick={handleToggleModal}
                className="w-full rounded-full flex gap-1 bg-blue-500 text-white text-sm px-3 py-1 hover:bg-blue-700 m-1 items-center"
                aria-expanded={isOpen}
                aria-controls="modal-blog-form"
            >
                <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                    />
                </svg>
                <span>{t("blog.blog")}</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    role="dialog"
                    id="modal-blog-form"
                >
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2
                                id="modal-title"
                                className="text-2xl font-extrabold text-gray-700 dark:text-white"
                            >
                                {t("blog.create_blog")}
                            </h2>
                            <button
                                onClick={handleClose}
                                aria-label={t("blog.close_modal") || "Fermer la fenêtre"}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="title-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t("blog.title_pop")}
                                </label>
                                <input
                                    id="title-input"
                                    ref={inputRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border px-3 py-2 rounded-md text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-300"
                                    placeholder={t("blog.title_placeholder") || "Titre du blog"}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t("blog.description")}
                                </label>
                                <textarea
                                    id="message-input"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full border px-3 py-2 rounded-md text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-300"
                                    placeholder={t("blog.description_placeholder") || "Contenu du blog..."}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            )}
                            {success && (
                                <p className="text-green-600 dark:text-green-400">{success}</p>
                            )}

                            {/* Footer */}
                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    {t("blog.submit")}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-md text-sm border bg-red-800 border-gray-300 text-gray-100 hover:bg-red-900"
                                >
                                    {t("blog.cancel")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
