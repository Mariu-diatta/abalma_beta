import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { WhiteRoundedButtonSignInRegister } from '../components/Button';
import NotificationsComponent from '../components/NotificationComponent';
import PayBack from '../components/BacketButtonPay';
import ThemeToggle from './Theme';
import { ENDPOINTS } from '../utils';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import LogIn from '../pages/Login';
import RegisterForm from "../pages/Register";
import { logout } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";
import { cleanAllMessageNotif, clearRooms } from "../slices/chatSlice";
import { setCurrentNav } from "../slices/navigateSlice";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { showMessage } from "../components/AlertMessage";


//button navigate for desktop
export const DesktopNav = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const currentUser = useSelector(state => state.auth.user);

    const [showLogin, setShowLogin] = useState(false);

    const [showRegister, setShowRegister] = useState(false);

    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {

        if (!window.confirm(t("logout"))) return;

        setLoggingOut(true);

        dispatch(clearCart());
        dispatch(clearRooms());
        dispatch(cleanAllMessageNotif());
        dispatch(logout());
        dispatch(setCurrentNav(ENDPOINTS?.HOME));

        navigate('/', { replace: true });

        try {
            await api.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            showMessage(dispatch, {
                Type: "Erreur",
                Message: error?.message || error?.request?.response,
            });
        } finally {
            setLoggingOut(false);
        }
    };

    return (

        <div
            className="hidden sm:flex items-center justify-center gap-3 w-auto mx-1 z-20 rounded-full bg-white/80 lg:bg-transparent md:bg-transparent"
        >
            <ThemeToggle />

            <NotificationsComponent />

            <PayBack />

            {currentUser ? (
                /* Utilisateur connecté : on propose de se déconnecter, plus jamais
                   les boutons de connexion / inscription. */
                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-6 py-2 text-[14px] font-semibold text-gray-700 bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-red-200 hover:bg-red-50/40 hover:text-red-600 disabled:opacity-60"
                >
                    <LogOut size={15} strokeWidth={2} />
                    {t("logOut")}
                </button>
            ) : (
                <>
                    {/* BOUTON LOGIN */}
                    <WhiteRoundedButtonSignInRegister
                        titleButton={t(ENDPOINTS.LOGIN)}
                        onClick={() => {
                            setShowLogin(!showLogin);
                            setShowRegister(false); // On ferme le registre si on ouvre le login
                        }}
                    >
                        {showLogin && <LogIn
                            onClose={() => setShowLogin(false)}
                            callbackState={() => {
                                setShowLogin(false);      // 1. fermer le login
                                setShowRegister(true); // 2. ouvre le registre
                            }}
                        />}
                    </WhiteRoundedButtonSignInRegister>

                    {/* BOUTON REGISTER */}
                    <WhiteRoundedButtonSignInRegister
                        titleButton={t(ENDPOINTS.REGISTER)}
                        onClick={() => {
                            setShowRegister(!showRegister);
                            setShowLogin(false); // On ferme le login si on ouvre le registre
                        }}
                    >
                        {showRegister && (
                            <RegisterForm
                                callbackState={() => {
                                    setShowRegister(false); // 1. Ferme le registre
                                    setShowLogin(true);      // 2. Ouvre le login
                                }}
                                onClose={() => setShowRegister(false)}
                            />
                        )}
                    </WhiteRoundedButtonSignInRegister>
                </>
            )}

        </div>
    );
};

export default DesktopNav;