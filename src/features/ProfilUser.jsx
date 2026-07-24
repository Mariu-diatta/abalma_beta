import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from '../services/Axios';
import { API_ENDPOINTS } from '../services/apiEndpoints';

import { updateUserData } from '../slices/authSlice';
import { addCurrentChat, addRoom } from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';

import AttentionAlertMesage, {
    showMessage,
} from '../components/AlertMessage';
import LoadingCard from '../components/LoardingSpin';
import FollowProfilUser from '../components/ViewsProfilUser';
import NumberFollowFollowed from '../components/FollowUserComp';
import ProbuttonComp from '../components/ProButtonComp';
import FormEditProfil from '../components/FormEditProfil';
import UpdateUserToPro from '../components/UpdateUserToPro';

import { ModalFormCreatBlog } from './BlogCreatBlogs';
import GetValidateUserFournisseur from './FournisseurValidation';

import {
    ENDPOINTS,
    getMediaUrl,
    getOrCreateRoom,
} from '../utils';

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

const CameraIcon = React.memo(({ className = 'w-5 h-5' }) => (
    <svg
        className={className}
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
));

CameraIcon.displayName = 'CameraIcon';

const BadgeProIcon = React.memo(() => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"
        />
    </svg>
));

BadgeProIcon.displayName = 'BadgeProIcon';

const EditProfilIcon = React.memo(() => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
        />
    </svg>
));

EditProfilIcon.displayName = 'EditProfilIcon';

const MessageIcon = React.memo(() => (
    <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 1 1 17 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
));

MessageIcon.displayName = 'MessageIcon';

const FournisseurIcon = React.memo(() => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3Z"
        />
    </svg>
));

FournisseurIcon.displayName = 'FournisseurIcon';

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_COVER ='https://images.unsplash.com/photo-1612832020897-593fae15346e';

const ALLOWED_NAVS = [
    'user-profil',
    'user-profil-contact',
];

const buildInitialFormData = (profile) => ({
    nom: profile?.nom ?? '',
    prenom: profile?.prenom ?? 'Utilisateur',
    email: profile?.email ?? '',
    adresse: profile?.adresse ?? '',
    telephone: profile?.telephone ?? '',
    description: profile?.description ?? '',
});

/* -------------------------------------------------------------------------- */
/*                                PROFILE CARD                                */
/* -------------------------------------------------------------------------- */

const ProfileCard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector(
        (state) => state.auth.user
    );

    const selectedProductOwner = useSelector(
        (state) => state.chat.userSlected
    );

    const currentNav = useSelector(
        (state) => state.navigate.currentNav
    );

    /* -------------------------------- STATES -------------------------------- */

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPhotoBg, setIsEditingPhotoBg] = useState(false);
    const [isProFormVisible, setIsProFormVisible] = useState(false);

    const [updateImage, setUpdateImage] = useState(null);
    const [updateImageCover, setUpdateImageCover] = useState(null);

    const [fileProof, setFileProof] = useState(null);

    const [isSendingProofDoc, setIsSendingProofDoc] =
        useState(false);

    const [isLoadingCode, setIsLoadingCode] =
        useState(true);

    const [isUpdating, setIsUpdating] =
        useState(true);

    const [loadingChat, setLoadingChat] =
        useState(false);

    /* ------------------------------ USER PROFILE ----------------------------- */

    const userProfile = useMemo(() => {
        if (currentNav === 'user-profil') {
            return currentUser;
        }

        if (currentNav === 'user-profil-contact') {
            return selectedProductOwner;
        }

        return null;
    }, [
        currentNav,
        currentUser,
        selectedProductOwner,
    ]);

    const isCurrentUser = useMemo(
        () =>
            userProfile?.email === currentUser?.email &&
            userProfile?.id === currentUser?.id,
        [
            userProfile?.email,
            userProfile?.id,
            currentUser?.email,
            currentUser?.id,
        ]
    );

    const isTrustedSellerProfile = Boolean(
        userProfile?.is_pro ||
        userProfile?.is_fournisseur ||
        userProfile?.fournisseur ||
        userProfile?.is_verified
    );

    const isCurrentUserFournisseurUnverified =
        Boolean(
            currentUser?.is_fournisseur &&
            !currentUser?.is_verified
        );

    const isProFormVisibleForCurrentUser =
        isProFormVisible && isCurrentUser;

    const isBgPhotoEditing =
        isEditingPhotoBg && isCurrentUser;

    const isFournisseurNotVerified =
        !(
            userProfile?.is_fournisseur &&
            isCurrentUser
        );

    const isViewingOtherUser =
        !isCurrentUser &&
        Boolean(selectedProductOwner);

    const isNotProAndOwner =
        !currentUser?.is_pro &&
        !isProFormVisible &&
        isCurrentUser;

    /* ------------------------------- FORM DATA ------------------------------- */

    const [formData, setFormData] = useState(
        () => buildInitialFormData(userProfile)
    );

    const [previewUrl, setPreviewUrl] =
        useState(userProfile?.image ?? null);

    const [
        previewUrlBackground,
        setPreviewUrlBackground,
    ] = useState(
        userProfile?.image_cover ?? null
    );

    /* -------------------------------- EFFECTS -------------------------------- */

    useEffect(() => {
        if (!ALLOWED_NAVS.includes(currentNav)) {
            navigate('/account-home');
        }
    }, [currentNav, navigate]);

    useEffect(() => {
        if (
            currentNav === ENDPOINTS?.ACCOUNT_HOME
        ) {
            navigate(`/${currentNav}`);
        }
    }, [currentNav, navigate]);

    useEffect(() => {
        if (!userProfile) return;

        setFormData(
            buildInitialFormData(userProfile)
        );

        setPreviewUrl(
            userProfile.image ?? null
        );

        setPreviewUrlBackground(
            userProfile.image_cover ?? null
        );
    }, [userProfile]);

    /* -------------------------------- HANDLERS ------------------------------- */

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }, []);

    const handleImageUpload = useCallback(
        (e, isBackground = false) => {
            const file = e.target.files?.[0];

            if (!file) return;

            const objectUrl =
                URL.createObjectURL(file);

            if (isBackground) {
                setUpdateImageCover(file);
                setPreviewUrlBackground(objectUrl);
                setIsEditingPhotoBg(false);
            } else {
                setUpdateImage(file);
                setPreviewUrl(objectUrl);
            }

            setIsEditing(true);
        },
        []
    );

    const handleAvatarUpload = useCallback(
        (e) => handleImageUpload(e, false),
        [handleImageUpload]
    );

    const handleCoverUpload = useCallback(
        (e) => handleImageUpload(e, true),
        [handleImageUpload]
    );

    const handleFileChange = useCallback(
        (e) => {
            const file = e.target.files?.[0];

            if (file) {
                setFileProof(file);
            }
        },
        []
    );

    /* --------------------------------- SAVE --------------------------------- */

    const handleSave = useCallback(async () => {
        if (!userProfile?.id) return;

        setIsUpdating(false);

        try {
            const fd = new FormData();

            Object.entries(formData).forEach(
                ([key, value]) => {
                    fd.append(key, value ?? '');
                }
            );

            if (updateImage) {
                fd.append('image', updateImage);
            }

            if (updateImageCover) {
                fd.append(
                    'image_cover',
                    updateImageCover
                );
            }

            const { data } = await api.put(
                API_ENDPOINTS.CLIENTS.UPDATE(
                    userProfile.id
                ),
                fd,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data',
                    },
                }
            );

            dispatch(
                updateUserData(data?.data)
            );

            setIsEditing(false);

            alert(t('update_profil'));
        } catch (error) {
            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.errors
                    ?.image_cover?.[0] ||
                'Une erreur est survenue.';

            showMessage(dispatch, {
                Type: 'Erreur',
                Message: errorMessage,
            });
        } finally {
            setIsUpdating(true);
        }
    }, [
        userProfile?.id,
        formData,
        updateImage,
        updateImageCover,
        dispatch,
        t,
    ]);

    /* ------------------------------- BECOME PRO ------------------------------ */

    const handleUpgradeToPro =
        useCallback(
            async (e) => {
                e.preventDefault();

                if (!fileProof) {
                    alert(t('select_file'));
                    return;
                }

                if (isSendingProofDoc) {
                    return;
                }

                setIsSendingProofDoc(true);

                try {
                    const fd =
                        new FormData();

                    fd.append(
                        'doc_proof',
                        fileProof
                    );

                    const { data } =
                        await api.post(
                            API_ENDPOINTS.CLIENTS
                                .BECOME_PRO,
                            fd
                        );

                    if (data?.user) {
                        dispatch(
                            updateUserData(
                                data.user
                            )
                        );
                    }

                    setIsProFormVisible(
                        false
                    );

                    alert(
                        t('compte_pro')
                    );
                } catch (error) {
                    const message =
                        error?.response?.data
                            ?.detail ||
                        error?.response?.data
                            ?.errors
                            ?.doc_proof?.[0] ||
                        t('error_file');

                    alert(message);
                } finally {
                    setIsSendingProofDoc(
                        false
                    );
                }
            },
            [
                fileProof,
                isSendingProofDoc,
                dispatch,
                t,
            ]
        );

    /* --------------------------- BECOME FOURNISSEUR -------------------------- */

    const updateAccountToFournisseur =
        useCallback(
            async (e) => {
                e.preventDefault();

                setIsLoadingCode(false);

                try {
                    const { data } =
                        await api.post(
                            API_ENDPOINTS.SUPPLIER
                                .CREATE
                        );

                    dispatch(
                        updateUserData(
                            data?.user
                        )
                    );

                    showMessage(dispatch, {
                        Type: 'Message',
                        Message:
                            data?.detail ||
                            'Compte fournisseur activé.',
                    });
                } catch (error) {
                    if (
                        error?.response?.data
                            ?.user
                    ) {
                        dispatch(
                            updateUserData(
                                error.response
                                    .data.user
                            )
                        );
                    }

                    showMessage(dispatch, {
                        Type: 'Erreur',
                        Message:
                            error?.response
                                ?.data?.detail ||
                            'Une erreur est survenue.',
                    });
                } finally {
                    setIsLoadingCode(true);
                }
            },
            [dispatch]
        );

    /* -------------------------------- MESSAGE -------------------------------- */

    const createNewRoom =
        useCallback(async () => {
            if (
                loadingChat ||
                !selectedProductOwner
            ) {
                return;
            }

            setLoadingChat(true);

            try {
                const room =
                    await getOrCreateRoom({
                        currentUser,
                        otherUser:
                            selectedProductOwner,
                    });

                if (!room) {
                    showMessage(dispatch, {
                        Type: 'Erreur',
                        Message:
                            "Impossible d'ouvrir la conversation pour le moment.",
                    });

                    return;
                }

                dispatch(addRoom(room));
                dispatch(
                    addCurrentChat(room)
                );

                dispatch(
                    setCurrentNav(
                        'message-inbox'
                    )
                );

                navigate('/message-inbox');
            } finally {
                setLoadingChat(false);
            }
        }, [
            loadingChat,
            selectedProductOwner,
            currentUser,
            dispatch,
            navigate,
        ]);

    const toggleBgPhotoEditing =
        useCallback(() => {
            setIsEditingPhotoBg(
                (previous) => !previous
            );
        }, []);

    const openEditing =
        useCallback(() => {
            setIsEditing(true);
        }, []);

    /* -------------------------------------------------------------------------- */
    /*                                   RENDER                                   */
    /* -------------------------------------------------------------------------- */

    return (
        <div className="
            min-h-95 pt-0 mt-[-15px]
            bg-none
            text-gray-900
        ">
            <div className="
                mx-auto
                w-full
                max-w-6xl
                overflow-hidden
                bg-white
                sm:shadow-sm
                sm:ring-1
                sm:ring-black/5
            ">

                {/* COVER */}
                <section
                    className="
                        group
                        relative
                        h-52
                        sm:h-64
                        md:h-80
                        overflow-hidden
                        bg-gray-200
                        bg-cover
                        bg-center
                    "
                    style={{
                        backgroundImage: `url(${getMediaUrl(
                            previewUrlBackground
                        ) ||
                            DEFAULT_COVER
                            })`,
                    }}
                >
                    {/* Overlay */}
                    <div className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/40
                        via-black/5
                        to-transparent
                    " />

                    {/* Modification cover */}
                    {isBgPhotoEditing && (
                        <label className="
                            absolute
                            inset-0
                            z-20
                            flex
                            cursor-pointer
                            items-center
                            justify-center
                            bg-black/45
                            backdrop-blur-[2px]
                        ">
                            <div className="
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-gray-900
                                shadow-xl
                            ">
                                <CameraIcon />

                                <span>
                                    {t(
                                        'ProfilText.modifierCouverture'
                                    )}
                                </span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleCoverUpload
                                }
                                className="hidden"
                            />
                        </label>
                    )}

                    {isCurrentUser && (
                        <button
                            type="button"
                            onClick={
                                toggleBgPhotoEditing
                            }
                            className="
                                absolute
                                bottom-4
                                right-4
                                z-10
                                flex
                                items-center
                                gap-2
                                rounded-full
                                bg-white/95
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-gray-800
                                shadow-lg
                                backdrop-blur
                                transition
                                hover:bg-white
                                hover:shadow-xl
                                active:scale-95
                            "
                        >
                            <CameraIcon />

                            <span className="
                                hidden
                                sm:inline
                            ">
                                {t(
                                    'ProfilText.modifierCouverture'
                                )}
                            </span>
                        </button>
                    )}
                </section>

                {/* PROFILE CONTENT */}
                <section className="
                    relative
                    px-4
                    pb-6
                    sm:px-6
                    lg:px-8
                ">

                    {/* AVATAR */}
                    <div className="
                        relative
                        -mt-14
                        flex
                        justify-center
                        sm:-mt-16
                        sm:justify-start
                    ">
                        <div className="relative">
                            <div
                                className={`
                                    rounded-full
                                    bg-white
                                    p-1
                                    shadow-xl
                                    ${isTrustedSellerProfile
                                        ? 'ring-4 ring-indigo-500/80'
                                        : ''
                                    }
                                `}
                            >
                                <img
                                    src={getMediaUrl(
                                        previewUrl
                                    )}
                                    alt={`Profil de ${formData.prenom ||
                                        'Utilisateur'
                                        }`}
                                    className="
                                        h-28
                                        w-28
                                        rounded-full
                                        object-cover
                                        sm:h-36
                                        sm:w-36
                                    "
                                />
                            </div>

                            {isCurrentUser && (
                                <label className="
                                    absolute
                                    bottom-1
                                    right-1
                                    flex
                                    h-10
                                    w-10
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-4
                                    border-white
                                    bg-gray-100
                                    text-gray-800
                                    shadow-md
                                    transition
                                    hover:bg-gray-200
                                ">
                                    <CameraIcon className="w-4 h-4" />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleAvatarUpload
                                        }
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* EDIT MODE */}
                    {isEditing ? (
                        <div className="
                            mt-6
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-4
                            shadow-sm
                            sm:p-6
                        ">
                            <FormEditProfil
                                handleSave={
                                    handleSave
                                }
                                handleChange={
                                    handleChange
                                }
                                formData={
                                    formData
                                }
                                loadinUpdate={
                                    isUpdating
                                }
                                setIsEditing={
                                    setIsEditing
                                }
                            />
                        </div>
                    ) : (
                        <>
                            {/* HEADER PROFILE */}
                            <div className="
                                mt-4
                                flex
                                flex-col
                                gap-5
                                sm:flex-row
                                sm:items-start
                                sm:justify-between
                            ">
                                {/* Identity */}
                                <div className="
                                    min-w-0
                                    text-center
                                    sm:text-left
                                ">
                                    <div className="
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        gap-2
                                        sm:justify-start
                                    ">
                                        <h1 className="
                                            truncate
                                            text-2xl
                                            font-bold
                                            tracking-tight
                                            sm:text-3xl
                                        ">
                                            {formData.prenom}
                                        </h1>

                                        {userProfile?.is_pro && (
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1
                                                    rounded-full
                                                    bg-indigo-50
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-indigo-700
                                                    ring-1
                                                    ring-indigo-100
                                                "
                                                title="Compte professionnel"
                                            >
                                                <BadgeProIcon />
                                                PRO
                                            </span>
                                        )}

                                        {userProfile?.is_verified && (
                                            <span
                                                className="
                                                    inline-flex
                                                    h-6
                                                    w-6
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-blue-500
                                                    text-xs
                                                    font-bold
                                                    text-white
                                                "
                                                title="Compte vérifié"
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </div>

                                    {formData.nom && (
                                        <p className="
                                            mt-1
                                            text-sm
                                            font-medium
                                            text-gray-500
                                        ">
                                            @{formData.nom
                                                .trim()
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    ''
                                                )}
                                        </p>
                                    )}

                                    {/* BIO */}
                                    <p className="
                                        mx-auto
                                        mt-4
                                        max-w-2xl
                                        whitespace-pre-line
                                        text-sm
                                        leading-6
                                        text-gray-700
                                        sm:mx-0
                                    ">
                                        {formData.description ||
                                            'Bienvenue sur mon profil.'}
                                    </p>
                                </div>

                                {/* FOLLOW STATS */}
                                <div className="
                                    flex
                                    shrink-0
                                    justify-center
                                    rounded-2xl
                                    bg-gray-50
                                    px-4
                                    py-3
                                    sm:justify-end
                                ">
                                    <NumberFollowFollowed
                                        profil={
                                            isCurrentUser
                                                ? currentUser
                                                : selectedProductOwner
                                        }
                                    />
                                </div>
                            </div>

                            {/* ACTION BAR */}
                            <div className="
                                mt-6
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-2
                                border-t
                                border-gray-100
                                pt-5
                                sm:justify-start
                            ">
                                {isCurrentUser && (
                                    <button
                                        type="button"
                                        onClick={
                                            openEditing
                                        }
                                        className="
                                            inline-flex
                                            h-10
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-full
                                            bg-gray-100
                                            px-5
                                            text-sm
                                            font-semibold
                                            text-gray-800
                                            transition
                                            hover:bg-gray-200
                                            active:scale-95
                                        "
                                    >
                                        <EditProfilIcon />

                                        <span>
                                            {t(
                                                'ProfilText.modifierProfil'
                                            )}
                                        </span>
                                    </button>
                                )}

                                {isViewingOtherUser && (
                                    <button
                                        type="button"
                                        onClick={
                                            createNewRoom
                                        }
                                        disabled={
                                            loadingChat
                                        }
                                        className="
                                            inline-flex
                                            px-3 py-1                                             
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-full
                                            bg-indigo-600
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:bg-indigo-700
                                            active:scale-95
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                            w-1/3 md:w-auto
                                        "
                                    >
                                        {loadingChat ? (
                                            <span>
                                                Chargement...
                                            </span>
                                        ) : (
                                            <>
                                                <MessageIcon />
                                                <span>
                                                    Message
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )}

                                {!isCurrentUser && (
                                    <FollowProfilUser
                                        clientId={
                                            selectedProductOwner?.id
                                        }
                                    />
                                )}

                                {isLoadingCode ? (
                                    isFournisseurNotVerified &&
                                    isCurrentUser && (
                                        <button
                                            type="button"
                                            onClick={
                                                updateAccountToFournisseur
                                            }
                                            className="
                                                inline-flex
                                                h-10
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-full
                                                bg-gradient-to-r
                                                from-indigo-600
                                                to-violet-600
                                                px-5
                                                text-sm
                                                font-semibold
                                                text-white
                                                shadow-sm
                                                transition
                                                hover:opacity-90
                                                active:scale-95
                                            "
                                        >
                                            <FournisseurIcon />

                                            <span>
                                                {t(
                                                    'ProfilText.devenirFournisseur'
                                                )}
                                            </span>
                                        </button>
                                    )
                                ) : (
                                    <LoadingCard />
                                )}

                                {isCurrentUser && (
                                    <ModalFormCreatBlog />
                                )}

                                <ProbuttonComp
                                    isUserProAndFormVisible={
                                        isNotProAndOwner
                                    }
                                    setIsProFormVisible={
                                        setIsProFormVisible
                                    }
                                    t={t}
                                />
                            </div>
                        </>
                    )}

                    {/* PRO FORM */}
                    {isProFormVisibleForCurrentUser && (
                        <div className="
                            mt-6
                            rounded-2xl
                            border
                            border-gray-200
                            bg-gray-50
                            p-4
                            sm:p-6
                        ">
                            <UpdateUserToPro
                                handleUpgradeToPro={
                                    handleUpgradeToPro
                                }
                                handleFileChange={
                                    handleFileChange
                                }
                                sedingProofDoc={
                                    isSendingProofDoc
                                }
                                setIsProFormVisible={
                                    setIsProFormVisible
                                }
                            />
                        </div>
                    )}
                </section>
            </div>

            <AttentionAlertMesage />

            {isCurrentUserFournisseurUnverified && (
                <GetValidateUserFournisseur
                    isCurrentUser={
                        isCurrentUser
                    }
                />
            )}
        </div>
    );
};

export default React.memo(ProfileCard);