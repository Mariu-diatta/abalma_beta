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
import LoadingCard from '../components/LoardingSpin';
import FollowProfilUser from '../components/ViewsProfilUser';
import NumberFollowFollowed from '../components/FollowUserComp';
import { ModalFormCreatBlog } from './BlogCreatBlogs';
import GetValidateUserFournisseur from './FournisseurValidation';
import { ENDPOINTS } from '../utils';
import ProbuttonComp from '../components/ProButtonComp';
import FormEditProfil from '../components/FormEditProfil';
import UpdateUserToPro from '../components/UpdateUserToPro';


// ─── Icônes réutilisables ─────────────────────────────────────────────────────
// React.memo : ces SVG ne dépendent que de leurs props (ou d'aucune prop) et n'ont
// pas besoin d'être re-render à chaque render du parent.

const CameraIcon = React.memo(({ className = 'w-6 h-6' }) => (
    <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
        <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
));
CameraIcon.displayName = 'CameraIcon';

const BadgeProIcon = React.memo(() => (
    <svg className="w-5 h-5 text-blue-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />
    </svg>
));
BadgeProIcon.displayName = 'BadgeProIcon';

const EditProfilIcon = React.memo(() => (
    <svg className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
    </svg>
));
EditProfilIcon.displayName = 'EditProfilIcon';

const FournisseurIcon = React.memo(() => (
    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9"
            d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    </svg>
));
FournisseurIcon.displayName = 'FournisseurIcon';

// ─── Constantes ───────────────────────────────────────────────────────────────
// Hissées hors du composant : identiques à chaque render, jamais recréées.

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1612832020897-593fae15346e';

const ALLOWED_NAVS = ['user-profil', 'user-profil-contact'];

const buildInitialFormData = (profile) => ({
    nom: profile?.nom ?? '',
    prenom: profile?.prenom ?? 'Utilisateur',
    email: profile?.email ?? '',
    adresse: profile?.adresse ?? '',
    telephone: profile?.telephone ?? '',
    description: profile?.description ?? '',
});

// ─── Composant principal ──────────────────────────────────────────────────────

const ProfileCard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ── Sélecteurs Redux ──
    // NB : currentOwnUser et selectedProductOwner lisaient le même chemin du store
    // (state.chat.userSlected) => un seul abonnement useSelector au lieu de deux,
    // ce qui évite un re-render dupliqué à chaque changement de cette valeur.
    const currentUser = useSelector((state) => state.auth.user);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const currentOwnUser = selectedProductOwner;
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const allChats = useSelector((state) => state.chat.currentChats);
    const currentChat = useSelector((state) => state.chat.currentChat);

    // ── État local ──
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);
    const [fileProof, setFileProof] = useState(null);
    const [isSendingProofDoc, setIsSendingProofDoc] = useState(false);
    const [isLoadingCode, setIsLoadingCode] = useState(true);
    const [isUpdating, setIsUpdating] = useState(true);

    // ── Profil affiché ──
    const userProfile = useMemo(() => {
        if (currentNav === 'user-profil') return currentUser;
        if (currentNav === 'user-profil-contact') return selectedProductOwner;
        return null;
    }, [currentNav, currentUser, selectedProductOwner]);

    const isCurrentUser = useMemo(
        () => userProfile?.email === currentUser?.email && userProfile?.id === currentUser?.id,
        [userProfile, currentUser]
    );

    // ── Dérivés d'état (flags) ──
    // Regroupés dans un seul useMemo : avant, ce sont 6 expressions recalculées en
    // valeurs "brutes" à chaque render (pas de coût de calcul ici, mais cela
    // recrée 6 nouvelles valeurs primitives à chaque passage, et surtout cela
    // empêche de raisonner sur des props stables si elles sont un jour passées
    // à des enfants memoïsés). Le useMemo fige ces dérivés tant que leurs
    // dépendances ne changent pas.
    const flags = useMemo(() => ({
        isCurrentUserFournisseurUnverified: currentUser?.is_fournisseur && !currentUser?.is_verified,
        isProFormVisibleForCurrentUser: isProFormVisible && isCurrentUser,
        isBgPhotoEditing: isEditingPhotoBg && isCurrentUser,
        isFournisseurNotVerified: !(userProfile?.is_fournisseur && isCurrentUser),
        isViewingOtherUser: !isCurrentUser && !!selectedProductOwner,
        isNotProAndOwner: !currentUser?.is_pro && !isProFormVisible && isCurrentUser,
    }), [
        currentUser?.is_fournisseur,
        currentUser?.is_verified,
        currentUser?.is_pro,
        isProFormVisible,
        isCurrentUser,
        isEditingPhotoBg,
        userProfile?.is_fournisseur,
        selectedProductOwner,
    ]);

    const {
        isCurrentUserFournisseurUnverified,
        isProFormVisibleForCurrentUser,
        isBgPhotoEditing,
        isFournisseurNotVerified,
        isViewingOtherUser,
        isNotProAndOwner,
    } = flags;

    // ── Données du formulaire ──
    const [formData, setFormData] = useState(() => buildInitialFormData(userProfile));
    const [previewUrl, setPreviewUrl] = useState(userProfile?.image ?? null);
    const [previewUrlBackground, setPreviewUrlBackground] = useState(userProfile?.image_cover ?? null);

    // ── Navigation gardée ──
    useEffect(() => {
        if (!ALLOWED_NAVS.includes(currentNav)) navigate('/account-home');
    }, [currentNav, navigate]);

    useEffect(() => {
        if (currentNav === ENDPOINTS?.ACCOUNT_HOME) navigate(`/${currentNav}`);
    }, [currentNav, navigate]);

    // ── Synchronisation profil → formulaire ──
    useEffect(() => {
        if (!userProfile) return;
        setFormData(buildInitialFormData(userProfile));
        setPreviewUrl(userProfile.image ?? null);
        setPreviewUrlBackground(userProfile.image_cover ?? null);
    }, [userProfile]);

    // ─── Handlers (useCallback : références stables passées aux enfants) ──────

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleImageUpload = useCallback((e, isBackground = false) => {
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
    }, []);

    // Wrappers stables pour les deux usages de handleImageUpload (avatar / couverture),
    // afin de ne pas recréer une arrow function inline à chaque render au niveau JSX.
    const handleAvatarUpload = useCallback(
        (e) => handleImageUpload(e),
        [handleImageUpload]
    );
    const handleCoverUpload = useCallback(
        (e) => handleImageUpload(e, true),
        [handleImageUpload]
    );

    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) setFileProof(file);
    }, []);

    const handleSave = useCallback(async () => {
        if (!userProfile?.id) return;

        setIsUpdating(false);

        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
            if (updateImage) fd.append('image', updateImage);
            if (updateImageCover) fd.append('image_cover', updateImageCover);

            const { data } = await api.put(`clients/${userProfile.id}/`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            dispatch(updateUserData(data?.data));
            setIsEditing(false);
            alert(t('update_profil'));
        } catch (error) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.errors?.image_cover?.[0];
            showMessage(dispatch, { Type: 'Erreur', Message: errorMessage });
        } finally {
            setIsUpdating(true);
        }
    }, [userProfile?.id, formData, updateImage, updateImageCover, dispatch, t]);

    const handleUpgradeToPro = useCallback(async (e) => {
        e.preventDefault();

        if (!fileProof) {
            alert(t('select_file'));
            return;
        }

        if (isSendingProofDoc) return; // anti double submit

        setIsSendingProofDoc(true);

        try {
            const fd = new FormData();
            fd.append('doc_proof', fileProof);

            const { data } = await api.put("clients/become_pro/", fd);

            if (data?.user) {
                dispatch(updateUserData(data.user));
            }

            setIsProFormVisible(false);

            alert(t('compte_pro')); // 1 seul message final

        } catch (error) {
            console.error("Erreur envoi document PRO:", error);

            const message =
                error?.response?.data?.detail ||
                error?.response?.data ||
                t('error_file');

            alert(message);

        } finally {
            setIsSendingProofDoc(false);
        }
    }, [fileProof, isSendingProofDoc, dispatch, t]);

    const updateAccountToFournisseur = useCallback(async (e) => {
        e.preventDefault();
        setIsLoadingCode(false);

        try {
            try {
                const { data } = await api.post('fournisseurs/');
                dispatch(updateUserData(data?.user));
                showMessage(dispatch, { Type: 'Message', Message: `Success : ${data?.detail}` });
            } catch (err) {
                if (err?.response?.data?.user) dispatch(updateUserData(err.response.data.user));
                if (err?.response) showMessage(dispatch, { Type: 'Erreur', Message: err.response.data?.detail });
            }
        } catch (error) {
            console.error('Erreur getUserCompte:', error);
        } finally {
            setIsLoadingCode(true);
        }
    }, [dispatch]);

    const getRoomByName = useCallback(async () => {
        try {
            const response = await api.get(`/rooms/?receiver_id=${selectedProductOwner?.id}`);
            dispatch(addCurrentChat(response[0]));
        } catch (err) {
            console.error('❌ Erreur chargement messages :', err);
        }
    }, [dispatch, selectedProductOwner]);

    const creatNewRoom = useCallback(async () => {
        try {
            const hashedPhone = await hashPassword(selectedProductOwner?.telephone);
            const roomName = `room_${selectedProductOwner?.nom}_${hashedPhone}`;
            await getRoomByName();

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
    }, [selectedProductOwner, getRoomByName, allChats, currentChat, currentUser, dispatch, navigate]);

    const handleMessageClick = useCallback(() => {
        setMessageVisible((prev) => !prev);
        creatNewRoom();
        navigate('/message-inbox');
    }, [creatNewRoom, navigate]);

    // Callbacks de toggle simples, mémoïsés pour stabilité des props (ex: onClick).
    const toggleBgPhotoEditing = useCallback(() => setIsEditingPhotoBg((prev) => !prev), []);
    const openEditing = useCallback(() => setIsEditing(true), []);

    // ─── Rendu ────────────────────────────────────────────────────────────────

    return (
        <div className="text-gray-900 dark:text-white mt-[-20px] p-0">

            {/* Photo de couverture */}
            <div
                className="relative h-48 sm:h-64 md:h-70 bg-cover bg-center bg-gray-200 mt-0 pt-0"
                style={{ backgroundImage: `url(${previewUrlBackground || DEFAULT_COVER})` }}
            >
                {isBgPhotoEditing && (
                    <div className="absolute inset-0 bg-black/30 flex items-start justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="bg-white rounded-full p-2 shadow-md text-sm cursor-pointer"
                            aria-label={t('ProfilText.modifierCouverture')}
                        />
                    </div>
                )}

                {isCurrentUser && (
                    <button
                        onClick={toggleBgPhotoEditing}
                        className="absolute top-1/2 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        aria-label={t('ProfilText.modifierCouverture')}
                    >
                        <CameraIcon />
                    </button>
                )}
            </div>

            {/* Section profil */}
            <div className="relative px-4 md:px-5 lg:px-5 pb-6 bg-white pt-0 mt-0">

                {/* Photo de profil */}
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
                            <CameraIcon />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Informations utilisateur */}
                <div className="pt-10 md:pt-2 lg:pt-2 sm:pl-40">
                    {isEditing ? (
                        <FormEditProfil
                            handleSave={handleSave}
                            handleChange={handleChange}
                            formData={formData}
                            loadinUpdate={isUpdating}
                            setIsEditing={setIsEditing}
                        />
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-1">
                                        <h1 className="text-xl sm:text-2xl font-semibold">{formData.prenom}</h1>
                                        {userProfile?.is_pro && <BadgeProIcon />}
                                    </div>
                                    <p className="text-xs text-gray-500">{formData.nom}</p>
                                </div>

                                <div className="flex flex-col sm:flex-col md:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                                    <NumberFollowFollowed profil={isCurrentUser ? currentUser : currentOwnUser} />
                                    <ProbuttonComp
                                        isUserProAndFormVisible={isNotProAndOwner}
                                        setIsProFormVisible={setIsProFormVisible}
                                        t={t}
                                    />
                                </div>
                            </div>

                            <textarea
                                name="description"
                                rows="5"
                                maxLength="20"
                                value={formData.description}
                                onChange={handleChange}
                                disabled
                                className="w-full mt-2 rounded-lg border border-gray-50 p-2 text-sm focus:ring-2 focus:ring-blue-500 prose scrollbor_hidden leading-relaxed whitespace-pre-lin"
                                placeholder={t('ProfilText.descriptionPlaceholder')}
                            />
                        </>
                    )}

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            {isCurrentUser && (
                                <button
                                    onClick={openEditing}
                                    className="h-8 w-1/2 border border-gray-300 cursor-pointer flex items-center justify-center gap-0 rounded-full bg-gray-100 text-gray-800 dark:text-gray-100 text-sm px-0 sm:px-2 hover:bg-gray-200 focus:ring-0 focus:ring-blue-500 focus:outline-none transition-colors duration-200 md:w-auto"
                                    aria-label={t('ProfilText.modifierProfil')}
                                >
                                    <EditProfilIcon />
                                    <span className="whitespace-nowrap px-2">{t('ProfilText.modifierProfil')}</span>
                                </button>
                            )}

                            {isViewingOtherUser && (
                                <button
                                    onClick={handleMessageClick}
                                    className="h-8 w-1/2 md:w-auto border border-gray-300 cursor-pointer flex items-center justify-center gap-2 rounded-full bg-gray-100 text-gray-800 dark:text-gray-100 text-sm px-1 sm:px-2 hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
                                >
                                    <span className="whitespace-nowrap px-2">
                                        {messageVisible ? 'X' : 'Message'}
                                    </span>
                                </button>
                            )}

                            {!isCurrentUser && <FollowProfilUser clientId={currentOwnUser?.id} />}
                            {isLoadingCode ? (
                                isFournisseurNotVerified && (
                                    <button
                                        onClick={updateAccountToFournisseur}
                                        className="h-8 w-1/2 md:w-auto flex items-center gap-1 rounded-full bg-indigo-300 text-white text-sm px-3 py-1 hover:bg-indigo-400"
                                        title="Devenir un fournisseur"
                                    >
                                        <FournisseurIcon />
                                        <span className="whitespace-nowrap px-2">{t('ProfilText.devenirFournisseur')}</span>
                                    </button>
                                )
                            ) : (
                                <LoadingCard />
                            )}

                            {isCurrentUser && <ModalFormCreatBlog />}
                        </div>
                    )}

                    {isProFormVisibleForCurrentUser && (
                        <UpdateUserToPro
                            handleUpgradeToPro={handleUpgradeToPro}
                            handleFileChange={handleFileChange}
                            sedingProofDoc={isSendingProofDoc}
                            setIsProFormVisible={setIsProFormVisible}
                        />
                    )}
                </div>

            </div>

            <AttentionAlertMesage />

            {isCurrentUserFournisseurUnverified && (
                <GetValidateUserFournisseur isCurrentUser={isCurrentUser} />
            )}

        </div>
    );
};

export default React.memo(ProfileCard);