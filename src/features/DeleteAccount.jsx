import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../slices/authSlice";
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import LoadingCard from "../components/LoardingSpin";
import { showMessage } from "../components/AlertMessage";
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

        if (currentNav === "settings") return profileData;

        if (currentNav === "user_profil_product") return selectedProductOwner;

        return null;

    }, [currentNav, profileData, selectedProductOwner]);

    // Suppression du compte
    const delAccountUser = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce profil ?"
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            const deleteResp = await api.delete(API_ENDPOINTS.CLIENTS.DELETE_ACCOUNT);

            showMessage(dispatch, {
                Type: "Message",
                Message:
                    deleteResp?.data?.detail ||
                    "Votre compte a été supprimé avec succès",
            });

            dispatch(logout());
            dispatch(setCurrentNav(null))
            navigate("/");

        } catch (error) {
            const message =
                error?.response?.data?.detail ||
                error?.response?.data ||
                "Erreur lors de la suppression du compte";

            showMessage(dispatch, {
                Type: "Error",
                Message: message,
            });

            console.error("Erreur suppression compte:", error);

        } finally {
            setLoading(false);
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