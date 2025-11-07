import React from 'react'
import WhiteRoundedButton from '../components/Button';
import NotificationsComponent from '../components/NotificationComponent';
import PayBack from '../components/BacketButtonPay';
import ThemeToggle from './Theme';
import { ENDPOINTS } from '../utils';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';


//button navigate for desktop
export const DesktopNav = () => {

    const { t } = useTranslation();

    const currentNav = useSelector(state => state.navigate.currentNav);

    return (

        <div
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            className="hidden sm:flex items-center justify-center gap-3 w-auto bg-white mx-1 z-20 rounded-full"
        >
            {
                (currentNav === ENDPOINTS?.HOME) &&
                <>
                    <ThemeToggle />

                    <NotificationsComponent/>

                    <PayBack/>
                </>
            }

            <WhiteRoundedButton titleButton={t(ENDPOINTS.LOGIN)} to={ENDPOINTS.LOGIN} />

            <WhiteRoundedButton titleButton={t(ENDPOINTS.REGISTER)} to={ENDPOINTS.REGISTER} />

        </div>
    );
};

export default DesktopNav;
