import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import { useAuth } from '../AuthContext';
import api from '../services/Axios';
import { logout, updateCompteUser, updateUserData } from '../slices/authSlice';
//import MessageForm from '../components/MessageForm';
import InputBox from '../components/InputBoxFloat';
import { newRoom } from '../slices/chatSlice';
import { setCurrentNav } from '../slices/navigateSlice';
import { hashPassword } from '../components/OwnerProfil';

const ProfileCard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const profileData = useSelector((state) => state.auth.user);
    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const currentUser = useSelector((state) => state.auth.user);


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


    useEffect(() => {

        if (messageVisible && userProfile?.nom) {

            const createRoom = async () => {

                try {

                    await hashPassword(selectedProductOwner?.telephone).then(

                        res => {

                            try {
                                api.post('rooms/', 

                                    {
                                        "name": `room_${currentUser?.telephone}_${res}`,
                                        "current_owner": currentUser?.id,
                                        "current_receiver": selectedProductOwner?.id
                                    }

                                ).then(

                                    resp => {

                                        console.log("LA CREATION DU CHAT", resp)

                                        return dispatch(setCurrentNav("message_inbox"))
                                    }

                                ).catch(

                                    err => {

                                        console.log("ERREUR DE LA CREATION DU CHAT", err?.response?.data?.name)

                                        if (err?.response?.data?.name.includes("room with this name already exists.")) {

                                            dispatch(setCurrentNav("message_inbox"))
                                        }

                                    }
                                    
                                )

                            } catch (err) {

                                console.log("0 ERREUR DE LA CREATION DU CHAT", err?.response?.data)
                            }

                            dispatch(newRoom({ name: `room_${currentUser?.telephone }_${res}` }))
                        }

                    )

                } catch (err) {

                    console.error("1 ERREUR DE LA CREATION DU CHAT", err?.response?.data?.name);

                    if (err?.response?.data?.name[0] === 'room with this name already exists.') dispatch(setCurrentNav("message_inbox"));
                }
            };

            createRoom();
        }
    });



    const getUserCompte = async () => {

        try {

            if (!profileData?.is_fournisseur) {

                try {

                    await api.put(`/clients/${profileData?.id}/`, { is_fournisseur: true });

                    const user = {...profileData};

                    user["is_fournisseur"] = true;

                    dispatch(updateUserData(user))

                    alert("Votre compte est passé à fournisseur");

                } catch {

                    console.log("Erreur lors de la mise à jour de l'utilisateur");

                    alert("L'utilisateur est déjà un fournisseur");
                }
              

                return;
            }

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

                {
                    isCurrentUser &&

                    <button
                        onClick={() => setIsEditingPhotoBg(!isEditingPhotoBg)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        aria-label="Modifier image de couverture"
                    >
                        📷
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
                                📷
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
                            <div className="flex items-center gap-2">

                                <h1>{formData?.nom}</h1>

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

                            <p className="text-sm text-gray-500">{formData?.prenom}</p>

                            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{formData?.comment}</p>
                        </>
                    ) : (
                        <form className="space-y-3 mt-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

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
                                name="adress"
                                    value={formData?.adresse}
                                onChange={handleChange}
                                placeholder="Adresse"
                             />

                            <InputBox
                                type="tel"
                                name="tel"
                                    value={formData?.telephone}
                                onChange={handleChange}
                                placeholder="Téléphone"
                             />

                            <textarea
                                name="comment"
                                value={formData?.comment}
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

                    <div className="mt-6 space-x-2 mb-3">

                        {

                            (!isEditing) && (
                            <>
                                {
                                    isCurrentUser &&
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 m-1"
                                    >
                                        Modifier profil
                                    </button>
                                }

                                {
                                    !isCurrentUser &&
                                    <button

                                        onClick={() => setMessageVisible(!messageVisible)}

                                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 m-1"
                                    >
                                        {!messageVisible ? "Message" : "X"}

                                    </button>
                                }

                                {
                                        (!userProfile?.is_fournisseur || !userProfile?.is_fournisseur) &&
                                    <button
                                        onClick={getUserCompte}
                                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 m-1"
                                    >
                                        Devenir fournisseur
                                    </button>
                                }

                                {
                                    isCurrentUser &&
                                    <button
                                        onClick={delAccountUser}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 m-1"
                                    >
                                        Supprimer compte
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

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Envoyer justificatif
                            </button>

                        </form>
                    )}

                    {(!profileData?.is_pro && !isProFormVisible && isCurrentUser) && (

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
