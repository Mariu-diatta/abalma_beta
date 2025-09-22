import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../slices/authSlice";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "./LoardingSpin";
import { setCurrentNav } from "../slices/navigateSlice";


const DeleteProfilAccount = () => {

    const { t } = useTranslation();

    const [loading, setLoading]=useState(false)

    const selectedProductOwner = useSelector((state) => state.chat.userSlected);
    const profileData = useSelector((state) => state.auth.user);
    const currentNav = useSelector((state) => state.navigate.currentNav);

    // Imports et hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const userProfile = useMemo(() => {

        if (currentNav === "settings" || currentNav === "home") return profileData;

        if (currentNav === "user_profil_product") return selectedProductOwner;

        return null;

    }, [currentNav, profileData, selectedProductOwner]);

    // Suppression du compte
    const delAccountUser = async () => {


        try {


            if (window.confirm('Voulez-vous vraiment supprimer ce profil ?')) {

                setLoading(true)

                const deleteResp = await api.delete(`clients/${userProfile?.id}/`);

                console.log("Response suppression", deleteResp?.data)

                alert('Votre compte a été supprimé avec succès');

                dispatch(logout());

                dispatch(setCurrentNav("home"));

                navigate('/', { replace: true });
            }

        } catch (err) {

            console.error('Erreur de la suppression du compte', err);

        } finally {

            setLoading(false)
        }
    };

    const isCurrentUser = useMemo(() => userProfile?.email === profileData?.email, [userProfile, profileData]);

 
    if (!isCurrentUser) return

    return (

         <>
     
            {
                loading ?
                <LoadingCard/>
                :
                <button

                    onClick={delAccountUser}

                    className="w-auto rounded-lg flex gap-1 bg-red-300 text-white text-xs px-3 py-1 rounded hover:bg-red-700 m-1 z-0"

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
    )

}


export default DeleteProfilAccount;