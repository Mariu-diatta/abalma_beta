import React, { useCallback, useEffect, useMemo,  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/Axios';
import { updateCompteUser, updateUserData } from '../slices/authSlice';
import InputBox from '../components/InputBoxFloat';
import { addCurrentChat, addRoom} from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { hashPassword } from '../components/OwnerProfil';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { useTranslation } from 'react-i18next';
import { ModalFormCreatBlog } from '../components/BlogCreatBlogs';
import GetValidateUserFournisseur from '../components/FournisseurValidation';
import LoadingCard from '../components/LoardingSpin';
import ViewsProfil from '../components/ViewsProfilUser';



const ProfileCard = () => {

    const { t } = useTranslation();

    //loadings

    const [loading, setLoading] = useState()

    const [loadingGetCode, setLoadingGetCode] = useState(true)

    const [messageError, setMessageError] = useState("Erreur");

    // Imports et hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileData = useSelector((state) => state.auth.user);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const allChats = useSelector(state => state.chat.currentChats);
    const currentChat = useSelector(state => state.chat.currentChat);
    const messageAlert = useSelector((state) => state.navigate.messageAlert);
    const userSelected = useSelector((state) => state.chat.userSlected);


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

            setLoading(false)

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

        } finally {

            setLoading(true)
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

    //Fonction pour devenir pro
    const handleUpgradeToPro = async (e) => {

        e.preventDefault();

        await handleSaveDoc();

        setIsProFormVisible(false);

        alert('🎉 Votre compte est maintenant professionnel.');
    };

    // Récupération ou création d’un compte fournisseur
    const getUserCompte = async (e) => {

        e.preventDefault()

        setLoadingGetCode(false)

        try {

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

                    setMessageError("sucess")

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
            

        } catch (error) {

            console.error('Erreur getUserCompte:', error);

        } finally {

            setLoadingGetCode(true)
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

                        className="absolute top-4 right-4 p-2 rounded-full shadow hover:bg-gray-100 text-sm"

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
                  
                    <img

                        src={previewUrl || 'https://randomuser.me/api/portraits/men/32.jpg'}

                        alt="Profil utilisateur"

                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover"
                    />

                    {
                        isCurrentUser &&

                            <label className="absolute bottom-0 right-0 bg-white rounded-lg p-1 rounded-full shadow cursor-pointer hover:bg-gray-100" aria-label="Modifier photo de profil">

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

                {/* Infos utilisateur */}
                <div className="pt-20 sm:pt-6 sm:ml-40">

                    {!isEditing ? (
                        <>
                            <div className="flex gap-2 justify-between items-center">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <h1 className="text-2xl">{formData?.prenom}</h1>

                                        {
                                            (userProfile?.is_pro && userProfile?.doc_proof) && (

                                                <svg
                                                    className="w-5 h-5 text-blue-900 dark:text-white"
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

                                {!isCurrentUser && <ViewsProfil clientId={userSelected?.id} />}

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

                                className='border-0 w-full border-gray-200 border rounded-sm mt-2 inline-flex items-center justify-center py-2 px-4 text-center  text-sm hover:bg-blue-light-5 hover:text-body-color dark:hover:text-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-blue-light-3'

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
                                    !loading?
                                    <>
                                        {
                                            isCurrentUser &&
                                            <button

                                                onClick={() => setIsEditing(true)}

                                                className="w-auto rounded-lg flex gap-1 bg-gray-300 text-white  text-sm px-3 py-1 rounded hover:bg-blue-700 m-1"

                                                title="Modifier le profil"

                                            >
                                                <svg className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            
                                                    <path stroke="currentColor" strokeLinecap="square" strokeLinejoin="round" strokeWidth="0.9" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                                       
                                                </svg>

                                                {t('ProfilText.modifierProfil')}

                                            </button>
                                        }
                                    </> 
                                    :
                                    <>   </>
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

                                        className="w-auto rounded-lg bg-yellow-600 text-white text-sm px-3 py-1 rounded hover:bg-yellow-700 m-1"
                                    >
                                        {!messageVisible ? "Message" : "X"}

                                    </button>
                                }

                                    {
                                           loadingGetCode ?
                                            <>
                                                {
                                                    (!userProfile?.is_fournisseur || !userProfile?.is_verified) && isCurrentUser &&
                                                    <button
                                                        onClick={(e) => getUserCompte(e)}
                                                        className="cursor-pointer w-auto rounded-lg text-sm  flex gap-1 bg-indigo-300 text-white px-3 py-1 rounded hover:bg-indigo-700 m-1"
                                                        title="Devenir un fournisseur"
                                                    >
                                                        <svg className="w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" d="m7.171 12.906-2.153 6.411 2.672-.89 1.568 2.34 1.825-5.183m5.73-2.678 2.154 6.411-2.673-.89-1.568 2.34-1.825-5.183M9.165 4.3c.58.068 1.153-.17 1.515-.628a1.681 1.681 0 0 1 2.64 0 1.68 1.68 0 0 0 1.515.628 1.681 1.681 0 0 1 1.866 1.866c-.068.58.17 1.154.628 1.516a1.681 1.681 0 0 1 0 2.639 1.682 1.682 0 0 0-.628 1.515 1.681 1.681 0 0 1-1.866 1.866 1.681 1.681 0 0 0-1.516.628 1.681 1.681 0 0 1-2.639 0 1.681 1.681 0 0 0-1.515-.628 1.681 1.681 0 0 1-1.867-1.866 1.681 1.681 0 0 0-.627-1.515 1.681 1.681 0 0 1 0-2.64c.458-.361.696-.935.627-1.515A1.681 1.681 0 0 1 9.165 4.3ZM14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />

                                                        </svg>

                                                        {t('ProfilText.devenirFournisseur')}

                                                    </button>
                                                }

                                            </>
                                            :
                                            <LoadingCard/>
                                    }


                                {
                                    isCurrentUser && <ModalFormCreatBlog/>
                                }


                            </>
                         )}

                    </div>

                    {isProFormVisible && isCurrentUser && (

                        <form onSubmit={handleUpgradeToPro} className="mt-6 flex flex-col w-auto gap-1 shadow-sm p-3 items-center justify-center">

                            <label className="text-sm">{t('hintProofDoc')} </label>

                            
                            <div className="flex items-center">

                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                                </svg>

                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.png,.jpeg"
                                    required
                                    className="mb-2  border border-0.5 rounded-lg p-2 text-xs cursor-pointer"
                                />

                            </div>

                            <div className="flex gap-2">

                                <button

                                    type="submit"

                                    className="rounded-lg bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text sm"
                                >
                                    {t('ProfilText.envoyerJustificatif')}

                                </button>

                                <button
                                    type="submit"

                                    onClick={() => setIsProFormVisible(false)}

                                    className="rounded-lg bg-red-600 text-white px-4 py-1 rounded hover:bg-green-700 sm"
                                >
                                    {t('ProfilText.annuler')}

                                </button>

                            </div>

                        </form>
                    )}

                </div>

            </div>

            {
                messageAlert && <AttentionAlertMesage title={messageError} content={messageAlert} /> 
            }

            {
                (profileData?.is_fournisseur && !profileData?.is_verified) && <GetValidateUserFournisseur isCurrentUser={isCurrentUser} />
            }

        </div>
    );
};

export default ProfileCard;






