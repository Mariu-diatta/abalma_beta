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

            <WhiteRoundedButtonSignInRegister
                titleButton={t(ENDPOINTS.LOGIN)}
                onClick={() => setShowLogin(true)}
            >
                {showLogin && <LogIn onClose={() => setShowLogin(false)} />}
            </WhiteRoundedButtonSignInRegister>

            <WhiteRoundedButtonSignInRegister
                titleButton={t(ENDPOINTS.REGISTER)}
                onClick={() => setShowRegister(true)}
            >
                {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
            </WhiteRoundedButtonSignInRegister>

        </div>
    );
};

export default DesktopNav;
