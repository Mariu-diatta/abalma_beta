import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../slices/authSlice";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { clearCart } from "../slices/cartSlice";
import { cleanAllMessageNotif, clearRooms} from "../slices/chatSlice";
import { useTranslation } from 'react-i18next';
import { setCurrentNav } from "../slices/navigateSlice";
import { showMessage } from "../components/AlertMessage";
import { ENDPOINTS } from "../utils";
import AccountMenuUser from "./AccountMenuUser";

export default function ButtonsNavigateThemecolorPayDropdownaccount() {

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    //const previousNav = useSelector(state => state.navigate.previousNav);

    const trigger = useRef(null);

    const dropdown = useRef(null);

    const navigate = useNavigate();


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

        setLoading(true);

        if (!window.confirm(t("logout"))) {
            setLoading(false);
            return;
        }

        // 1️⃣ Mettre à jour le store immédiatement
        dispatch(clearCart());
        dispatch(clearRooms());
        dispatch(cleanAllMessageNotif());
        dispatch(logout());
        dispatch(setCurrentNav(ENDPOINTS?.HOME));

        // 2️⃣ Naviguer directement
        navigate(`/`, { replace: true });

        // 3️⃣ Essayer la requête API en arrière-plan
        try {
            await api.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            showMessage(dispatch, {
                Type: "Erreur",
                Message: error?.message || error?.request?.response,
            });
        } finally {
            setLoading(false);
        }
    };

    return (

        <section
            style={{top:"6px"}}
            className={`bg-white/20   rounded-lg absolute  right-2 fixed z-50 flex items-centers justify-center`}
        >

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



