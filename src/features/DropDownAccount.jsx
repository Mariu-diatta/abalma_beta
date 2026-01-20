import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../slices/authSlice";
import api from "../services/Axios";
import { clearCart } from "../slices/cartSlice";
import { cleanAllMessageNotif, clearRooms, removeMessageNotif } from "../slices/chatSlice";
import toast from 'react-hot-toast';
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import { setCurrentNav } from "../slices/navigateSlice";
import AttentionAlertMessage, { showMessage } from "../components/AlertMessage";
import GroupThemNotifPayLangageButtons from "../components/NotificationGrouped";
import { ENDPOINTS } from "../utils";
import AccountMenuUser from "./AccountMenuUser";

export default function ButtonsNavigateThemecolorPayDropdownaccount() {

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const currentNotifMessages = useSelector(state => state.chat.messageNotif);

    const trigger = useRef(null);

    const dropdown = useRef(null);

    const navigate = useNavigate();

    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang);
    };

    const notify = () => {

        toast(currentNotifMessages[0]);

        dispatch(removeMessageNotif());
    };

    // Outside click
    useEffect(() => {

        const clickHandler = ({ target }) => {

            if (!dropdown.current) return;

            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;

            setDropdownOpen(false);
        };

        document.addEventListener("click", clickHandler);

        return () => document.removeEventListener("click", clickHandler);
    });

    // ESC key
    useEffect(() => {

        const keyHandler = ({ keyCode }) => {

            if (!dropdownOpen || keyCode !== 27) return;

            setDropdownOpen(false);
        };

        document.addEventListener("keydown", keyHandler);

        return () => document.removeEventListener("keydown", keyHandler);
    });

    const getUserLogOut = async () => {

        setLoading(true)

        if (window.confirm(t("logout"))) {

            dispatch(clearCart());

            dispatch(clearRooms());

            dispatch(cleanAllMessageNotif());

            dispatch(logout());

            try {

                await api.get(`logout/`);

                dispatch(setCurrentNav(ENDPOINTS?.LOGIN))

                return navigate(`/${ENDPOINTS?.LOGIN}`, { replace: true });

            } catch (error) {

                showMessage(dispatch, { Type: "Erreur", Message: error?.message || error?.request?.response });
                
                dispatch(setCurrentNav(ENDPOINTS?.LOGIN))

                return navigate(`/${ENDPOINTS?.LOGIN}`, { replace: true });

            } finally {

                setLoading(false)


            }
        } else {

            setLoading(false)
        }
    };

    return (


        <section
            
            className={`bg-none flex items-center justify-center px-2  rounded-lg absolute top-0  fixed z-50`}
        >

            <AttentionAlertMessage/>


            <GroupThemNotifPayLangageButtons

                notify={notify}

                changeLanguage={changeLanguage}

            />

            {/* Avatar + dropdown */}
            <AccountMenuUser

                dropdown={dropdown}

                setDropdownOpen={setDropdownOpen}

                dropdownOpen={dropdownOpen}

                trigger={trigger}

                getUserLogOut={getUserLogOut}

                loading={loading}

            />
            
        </section>
    );
}



