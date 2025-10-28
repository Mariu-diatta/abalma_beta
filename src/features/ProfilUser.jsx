import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/Axios';
import { updateUserData } from '../slices/authSlice';
import { addCurrentChat, addRoom } from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { hashPassword } from '../components/OwnerProfil';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import { ModalFormCreatBlog } from '../components/BlogCreatBlogs';
import GetValidateUserFournisseur from '../components/FournisseurValidation';
import LoadingCard from '../components/LoardingSpin';
import FollowProfilUser from '../components/ViewsProfilUser';
import NumberFollowFollowed from '../components/FollowUserComp';
import InputBox from '../components/InputBoxFloat';

const ProfileCard = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const currentUser = useSelector((state) => state.auth.user);
    const currentOwnUser = useSelector((state) => state.chat.userSlected);
    //const profileData = useSelector((state) => state.auth.user);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const [sedingProofDoc, setSedingProofDoc]=useState(false)

    // Determine user profile based on navigation context
    const userProfile = useMemo(() => {
        if ((currentNav === 'user-profil') || (currentNav === 'home')) return currentUser;
        else if (currentNav === 'user-profil-contact') return selectedProductOwner;
        return null;
    }, [currentNav, currentUser, selectedProductOwner]);

    const isCurrentUser = useMemo(

        () => {

            return (userProfile?.email === currentUser?.email && userProfile?.id === currentUser?.id);
        },

        [userProfile, currentUser]
    );

    // Component state
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(userProfile?.image || null);
    const [previewUrlBackground, setPreviewUrlBackground] = useState(
        userProfile?.image_cover || null
    );
    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);
    const [fileProof, setFileProof] = useState(null);
    const [loadingGetCode, setLoadingGetCode] = useState(true);
    const [loadinUpdate, setLoadinUpdate] = useState(true);

    // Sync form data with user profile
    useEffect(() => {

        if (userProfile) {

            setFormData({
                nom: userProfile.nom || '',
                prenom: userProfile.prenom || '',
                email: userProfile.email || '',
                adresse: userProfile.adresse || '',
                telephone: userProfile.telephone || '',
                description: userProfile.description || '',
            });

            setPreviewUrl(userProfile.image || null);

            setPreviewUrlBackground(userProfile.image_cover || null);
        }

    }, [userProfile]);

    // Form data state
    const [formData, setFormData] = useState({
        nom: userProfile?.nom || '',
        prenom: userProfile?.prenom || 'Utilisateur',
        email: userProfile?.email || '',
        adresse: userProfile?.adresse || '',
        telephone: userProfile?.telephone || '',
        description: userProfile?.description || '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image uploads
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

    // Handle proof document upload
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setFileProof(file);
    };

    // Save profile updates
    const handleSave = async () => {

        if (!userProfile?.id) {

            return;
        }

        setLoadinUpdate(false);

        try {

            const fd = new FormData();

            Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

            //console.log(updateImageCover)

            if (updateImage) fd.append('image', updateImage);

            if (updateImageCover) fd.append('image_cover', updateImageCover);

            const updateUser= await api.put(`clients/${userProfile?.id}/`, fd, {

                headers: { 'Content-Type': 'multipart/form-data' },

            });

            //console.log("donne", updateUser?.data?.data)

            dispatch(updateUserData(updateUser?.data?.data))

            setIsEditing(false);

            alert(t('update_profil'));

        } catch (error) {

            //console.error('❌ Erreur mise à jour :', error);

            const errorMessage = error?.response?.data?.detail || error?.response?.data?.errors?.image_cover?.[0]

            showMessage(dispatch, { Type: "Erreur", Message: errorMessage });

        } finally {

            setLoadinUpdate(true);
        }
    };

    // Handle upgrade to pro
    const handleUpgradeToPro = async (e) => {

        e.preventDefault();

        if (!fileProof) {

            alert(t('select_file'));

            return;
        }

        setSedingProofDoc(true)

        try {

            const formData = new FormData();

            formData.append('doc_proof', fileProof);

            const clientResponse = await api.put(`clients/${userProfile?.id}/become_pro/`, formData, {

                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(updateUserData(clientResponse?.data?.user))

            alert(t('justif_send'));

            setIsProFormVisible(false);

            alert(t('compte_pro'));


        } catch (error) {

            console.error("❌ Erreur d'envoi :", error);

            alert(t("error_file"));

        } finally {

            setSedingProofDoc(false)

        }
    };

    // Fetch or create user account
    const updateAccountToFournisseur = async (e) => {

        e.preventDefault();

        setLoadingGetCode(false);

        try {

            try {

                const fournisseurResp = await api.post('fournisseurs/');

                dispatch(updateUserData(fournisseurResp?.data?.user));

                showMessage(dispatch, { Type: "Message", Message: `Success : ${fournisseurResp?.data?.detail}` });

            } catch (err) {

                if (err?.response?.data?.user) dispatch(updateUserData(err?.response?.data?.user));

                if (err?.response) showMessage(dispatch, { Type: "Erreur", Message: err?.response?.data?.detail});
            }

        } catch (error) {

            console.error('Erreur getUserCompte:', error);

        } finally {

            setLoadingGetCode(true);
        }
    };

    // Create or fetch chat room
    const getRoomByName = useCallback(

        async (room) => {

            try {
                const response = await api.get(`/rooms/?receiver_id=${selectedProductOwner?.id}`);
                dispatch(addCurrentChat(response[0]));

            } catch (err) {
                console.error('❌ Erreur chargement messages :', err);
            }
        },
        [dispatch, selectedProductOwner]
    );

    const creatNewRoom = async () => {

        try {
            const hashedPhone = await hashPassword(selectedProductOwner?.telephone);
            const roomName = `room_${selectedProductOwner?.nom}_${hashedPhone}`;
            await getRoomByName({ name: roomName });
            const roomExists = allChats?.some((room) => room?.name === currentChat?.nom);

            if (roomExists) {
                dispatch(setCurrentNav('message-inbox'));
                navigate('/message-inbox');
                return;
            }

           await api.post('rooms/', {
                name: roomName,
                current_owner: currentUser?.id,
                current_receiver: selectedProductOwner?.id,
           });

            dispatch(setCurrentNav('message-inbox'));
            navigate('/message-inbox');

        } catch (err) {

            const errorMsg = err?.response?.data;
            const roomAlreadyExists = [
                errorMsg?.name?.[0],
                errorMsg?.current_receiver?.[0],
                errorMsg?.current_owner?.[0],
            ].some((msg) => msg?.includes('already exists'));

            if (roomAlreadyExists) {

                try {
                    const fallbackHash = await hashPassword(selectedProductOwner?.telephone);
                    const fallbackRoom = `room_${selectedProductOwner?.email}_${fallbackHash}`;
                    dispatch(addRoom(fallbackRoom));
                    dispatch(addCurrentChat(fallbackRoom));

                } catch (hashErr) {
                    console.error('❌ Erreur fallback (hash):', hashErr);
                }

            } else {
                console.error('❌ Erreur création chat:', errorMsg);
            }
        }
    };

    return (

        <div
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"

            style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)"
            }}

        >

            {/* Cover Image */}
            <div
                className="relative h-48 sm:h-64 md:h-80 bg-cover bg-center bg-gray-200"
                style={{
                    backgroundImage: `url(${previewUrlBackground || 'https://images.unsplash.com/photo-1612832020897-593fae15346e'
                        })`,
                }}
            >
                {isEditingPhotoBg && isCurrentUser && (

                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="bg-white rounded-full p-2 shadow-md text-sm cursor-pointer"
                            aria-label={t('ProfilText.modifierCouverture')}
                        />

                    </div>
                )}

                {isCurrentUser && (

                    <button
                        onClick={() => setIsEditingPhotoBg(!isEditingPhotoBg)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        aria-label={t('ProfilText.modifierCouverture')}
                    >
                        <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                            />

                            <path
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />

                        </svg>

                    </button>
                )}

            </div>

            {/* Profile Section */}
            <div
                className="relative px-4 sm:px-6 pb-6 bg-white dark:bg-gray-900 shadow-md"

                style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}
            >

                {/* Profile Picture */}
                <div className="absolute -top-12 sm:-top-16 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">

                    <img
                        src={previewUrl}
                        alt="Profil utilisateur"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />

                    {isCurrentUser && (
                        <label
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100"
                            aria-label="Modifier photo de profil"
                        >
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
                                />
                                <path
                                    stroke="currentColor"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)}
                                className="hidden"
                            />
                        </label>
                    )}

                </div>

                {/* User Info */}
                <div className="pt-16 sm:pt-20 sm:pl-40" >

                    {!isEditing ? (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                            <div className="flex flex-col items-start">

                                <div className="flex items-center gap-1">

                                    <h1 className="text-xl sm:text-2xl font-semibold">{formData?.prenom}</h1>

                                    {userProfile?.is_pro && (
                                        <svg
                                            className="w-5 h-5 text-blue-900 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
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

                                <p className="text-xs text-gray-500">{formData?.nom}</p>

                            </div>

                            <div className="flex flex-col sm:flex-col md:flex-row sm:items-center sm:justify-between gap-4 mb-2">
     
                                <NumberFollowFollowed profil={isCurrentUser ? currentUser : currentOwnUser} />
                                
                                <>
                                    {
                                        (!currentUser?.is_pro && !isProFormVisible && isCurrentUser) && (

                                            <button
                                                onClick={() => setIsProFormVisible(true)}
                                                className="flex items-center gap-2 text-sm border border-blue-400 rounded-full py-2 px-4 hover:bg-blue-100 dark:hover:bg-blue-900"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
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

                                                {t('ProfilText.passerPro')}

                                            </button>
                                        )
                                    }
                                </>

                            </div>

                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                            className="mt-4 space-y-4 sm:w-1/2"
                        >
                            <InputBox
                                type="text"
                                name="nom"
                                placeholder={t('ProfilText.nomPlaceholder')}
                                value={formData?.nom}
                                onChange={handleChange}
                            />
                            <InputBox
                                type="text"
                                name="prenom"
                                placeholder={t('ProfilText.prenomPlaceholder')}
                                value={formData?.prenom}
                                onChange={handleChange}
                            />
                            <InputBox
                                type="email"
                                name="email"
                                placeholder={t('ProfilText.emailPlaceholder')}
                                value={formData?.email}
                                onChange={handleChange}
                            />
                            <InputBox
                                type="text"
                                name="adresse"
                                placeholder={t('ProfilText.adressePlaceholder')}
                                value={formData?.adresse}
                                onChange={handleChange}
                            />

                            <InputBox
                                type="text"
                                name="telephone"
                                placeholder={t('ProfilText.telephonePlaceholder')}
                                value={formData?.telephone}
                                onChange={handleChange}
                            />

                            <textarea
                                name="description"
                                value={formData?.description}
                                onChange={handleChange}
                                className="w-full h-24 rounded-lg border border-gray-300 p-2 resize-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('ProfilText.descriptionPlaceholder')}
                            />

                            <div className="flex gap-4">

                                {
                                    loadinUpdate ? (
                                        <button
                                            type="submit"
                                            className="rounded-full bg-green-300 text-white px-4 py-2 hover:bg-green-400"
                                        >
                                            {t('ProfilText.boutons.enregistrer')}
                                        </button>
                                    ) : (
                                        <LoadingCard />
                                    )
                                }

                                <button
                                    type="button"
                                    className="rounded-full bg-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-400"
                                    onClick={() => setIsEditing(false)}
                                >
                                    {t('ProfilText.boutons.annuler')}

                                </button>

                            </div>

                        </form>
                    )}

                    <textarea
                        name="description"
                        value={formData?.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full mt-2 rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder={t('ProfilText.descriptionPlaceholder')}
                    />

                    <div className="flex flex-col sm:flex-row gap-2 mt-6">

                        {(!isEditing ) && (
                            <>
                                {
                                    isCurrentUser &&
                                    (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="h-8 w-1/2 border border-gray-300 cursor-pointer flex items-center justify-center gap-0 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm px-0 sm:px-2  hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-0 focus:ring-blue-500 focus:outline-none transition-colors duration-200  md:w-auto"
                                            aria-label={t('ProfilText.modifierProfil')}
                                            style={{
                                                backgroundColor: "var(--color-bg)",
                                                color: "var(--color-text)"
                                            }}
                                        >
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.5"
                                                    d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                                                />
                                            </svg>

                                            <span className="whitespace-nowrap px-2">{t('ProfilText.modifierProfil')}</span>

                                        </button>
                                    )
                                }

                                {
                                    (!isCurrentUser && selectedProductOwner) && (

                                    <button
                                        onClick={() => {
                                            setMessageVisible(!messageVisible);
                                            creatNewRoom();
                                            navigate('/message-inbox');
                                        }}
                                        className="h-8 w-1/2 md:w-auto border border-gray-300 cursor-pointer flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm px-1 sm:px-2  hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200 w-2/3 md:w-auto"
                                    >
                                        <span className="whitespace-nowrap px-2">{!messageVisible ? 'Message' : 'X'}</span>

                                    </button>

                                    )
                                }

                                <>
                                    {!isCurrentUser && <FollowProfilUser clientId={currentOwnUser?.id} />}
                                </>

                                {
                                    loadingGetCode ? (

                                        <>
                                            {(!userProfile?.is_fournisseur || !userProfile?.is_verified) && isCurrentUser && (

                                                <button
                                                    onClick={(e) => updateAccountToFournisseur(e)}
                                                    className="h-8 w-1/2 md:w-auto flex items-center gap-1 rounded-full bg-indigo-300 text-white text-sm px-3 py-1 hover:bg-indigo-400 w-2/3 md:w-auto"
                                                    title="Devenir un fournisseur"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="0.9"
                                                            d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                                                        />
                                                    </svg>

                                                    <span className="whitespace-nowrap px-2">{t('ProfilText.devenirFournisseur')}</span>

                                                </button>
                                            )}
                                        </>

                                    ) : (

                                        <LoadingCard />
                                    )
                                }

                                {isCurrentUser && <ModalFormCreatBlog />}
                            </>
                        )}
                    </div>

                    {(isProFormVisible && isCurrentUser) && (

                        <form

                            onSubmit={handleUpgradeToPro}

                            className="verflow-x-auto mt-6 w-auto flex flex-col items-center gap-4 p-1 rounded-lg shadow-lg"
                        >
                            <label className="text-sm">{t('hintProofDoc')}</label>

                            <div className="flex items-center gap-2">

                                <svg
                                    className="w-6 h-6 text-gray-800 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                        strokeWidth="1"
                                        d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                                    />

                                </svg>

                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.png,.jpeg"
                                    required
                                    className="border border-gray-300 rounded-full p-2 text-sm cursor-pointer w-full"
                                />

                            </div>

                            <div className="flex gap-2">

                                {
                                    (!sedingProofDoc)?
                                    <button
                                        type="submit"
                                        className="rounded-full bg-green-300 text-white px-4 py-2 hover:bg-green-400 text-sm"
                                    >
                                        {t('ProfilText.envoyerJustificatif')}

                                    </button>
                                    :
                                    <LoadingCard/>
                                }

                                <button
                                    type="button"
                                    onClick={() => setIsProFormVisible(false)}
                                    className="h-8 w-1/2 md:w-auto rounded-full bg-red-300 text-white px-4 py-2 hover:bg-red-400 text-sm"
                                >
                                    {t('ProfilText.annuler')}

                                </button>

                            </div>

                        </form>
                    )}

                </div>

            </div>

            <AttentionAlertMesage/>

            {
                (currentUser?.is_fournisseur && !currentUser?.is_verified) &&

                (

                    <GetValidateUserFournisseur isCurrentUser={isCurrentUser} />
                )
            }
        </div>
    );
};

export default ProfileCard;