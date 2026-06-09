import React, { useState } from 'react'
import { WhiteRoundedButtonSignInRegister } from '../components/Button';
import NotificationsComponent from '../components/NotificationComponent';
import PayBack from '../components/BacketButtonPay';
import ThemeToggle from './Theme';
import { ENDPOINTS } from '../utils';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import LogIn from '../pages/Login';
import RegisterForm from "../pages/Register";


//button navigate for desktop
export const DesktopNav = () => {

    const { t } = useTranslation();

    const currentNav = useSelector(state => state.navigate.currentNav);

    const [showLogin, setShowLogin] = useState(false);

    const [showRegister, setShowRegister] = useState(false);

    return (

        <div
            className="hidden sm:flex items-center justify-center gap-3 w-auto mx-1 z-20 rounded-full bg-white/80 lg:bg-transparent md:bg-transparent"
        >
            {
                (currentNav === ENDPOINTS?.HOME) &&
                <>
                    <ThemeToggle />

                    <NotificationsComponent/>

                    <PayBack/>
                </>
            }

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

        </div>
    );
};

export default DesktopNav;
