import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../slices/authSlice";
import api from "../services/Axios";
import { clearCart } from "../slices/cartSlice";
import { addMessageNotif, cleanAllMessageNotif, clearRooms, removeMessageNotif } from "../slices/chatSlice";
import toast, { Toaster } from 'react-hot-toast';
import { LanguageDropdown, ThemeToggle } from "../pages/Header";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';


const NotificationGroup = ({ currentUser, currentNotifMessages, notify, changeLanguage, nbItems }) => (

    <>
        {currentNotifMessages.length > 0 && (

            <button

                onClick={notify}

                className="relative flex items-center justify-center h-12 w-12 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >
                <NotificationsComponent userId={currentUser?.id} />

            </button>
        )}

        <Toaster />

        <ThemeToggle />

        <LanguageDropdown changeLanguage={changeLanguage} />

        {/* Paiement */}
        <NavLink

            to="/payment_product"

            className="relative flex items-center justify-center h-12 w-12 rounded-lg bg-white dark:bg-dark-2 text-dark dark:text-white"

            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        >
            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
            </svg>

            <span className="absolute top-2 right-2 text-xs text-green-600 font-bold">{nbItems}</span>

        </NavLink>

    </>
);

const NotificationsComponent = ({ userId }) => {

    const currentNotifMessages = useSelector(state => state.chat.messageNotif);

    const dispatch = useDispatch();

    useEffect(() => {

        //process.env.NODE_ENV === 'production'
        const backendBase = true
            ? 'wss://backend-mpb0.onrender.com'
            : 'ws://localhost:8000';

        const socketUrl = `${backendBase}/chat/notifications/${userId}/`;

        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {

            console.log("✅ WebSocket connecté");
        };

        socket.onmessage = (event) => {

            try {
                const data = JSON.parse(event.data);

                if (data.type === "send_notification" && data.payload) {

                    console.log("🔔 Notification reçue:", data);

                    dispatch(addMessageNotif(data.message));
                }
            } catch (e) {

                console.error("Erreur JSON:", e);
            }
        };

        socket.onclose = () => {

            console.warn("❌ WebSocket fermé");
        };

        socket.onerror = (err) => {

            console.error("❗ WebSocket erreur:", err);
        };

        return () => socket.close();

    }, [userId, dispatch]);

    return (

        <div className="flex">

            <svg className="w-[26px] h-[25px] text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                    d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />

            </svg>

            {currentNotifMessages.length}


        </div>
    );
};

export default function AccountDropdownUserProfil() {

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dispatch = useDispatch();

    const nbItems = useSelector(state => state.cart.nbItem);

    const currentUser = useSelector(state => state.auth.user);

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

        if (window.confirm("Voulez-vous vous deconnecter???")) {

            if (!currentUser?.id) {

                dispatch(logout());

                return navigate("/logIn", { replace: true });
            }

            try {

                const formData = new FormData();

                formData.append("is_connected", false);

                await api.put(`clients/${currentUser?.id}/`, formData, {

                    headers: { "Content-Type": "multipart/form-data" },
                });

                dispatch(logout());

                dispatch(clearCart());

                dispatch(clearRooms());

                dispatch(cleanAllMessageNotif());

                return navigate("/logIn", { replace: true });

            } catch (error) {

                console.log("error..................", error);
            }
        }
    };

    return (
        <section className="absolute top-2 bg-gray-2 dark:bg-dark z-5">

            <div className="flex justify-center items-center">

                <div className="flex items-center p-2 bg-transparent rounded-lg">

                    {/* Mobile only - fixed bottom bar */}
                    <div className="fixed bottom-0 w-max-100 left-0 right-0 z-0 flex items-center justify-around sm:flex md:hidden lg:hidden">

                        <NotificationGroup
                            currentUser={currentUser}
                            currentNotifMessages={currentNotifMessages}
                            notify={notify}
                            changeLanguage={changeLanguage}
                            nbItems={nbItems}
                        />

                    </div>

                    {/* Desktop (md and up) */}
                    <div className="hidden md:flex lg:flex items-center gap-2">

                        <NotificationGroup
                            currentUser={currentUser}
                            currentNotifMessages={currentNotifMessages}
                            notify={notify}
                            changeLanguage={changeLanguage}
                            nbItems={nbItems}
                        />

                    </div>

                    {/* Avatar + dropdown */}
                    <button
                        ref={trigger}

                        onClick={() => setDropdownOpen(!dropdownOpen)}

                        className="relative inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white dark:bg-dark-2 px-4 py-1 text-base font-medium text-dark dark:text-white"

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        {currentUser?.image ? (

                            <div className="relative h-[30px] w-[30px] rounded-full">

                                <img src={currentUser?.image} alt="avatar" title={currentUser?.email}

                                    className="h-full w-full rounded-full object-cover object-center cursor-pointer" />

                                    {currentUser?.is_connected && (
                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>

                                )}

                            </div>
                        ) : (
                                <div className="relative h-[30px] w-[30px] rounded-full" title={currentUser?.email}>

                                <svg className="w-[26px] h-[25px] text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                {currentUser?.is_connected && (

                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                )}

                            </div>
                        )}

                        <span className={`transition-transform duration-100 ${dropdownOpen ? "-scale-y-100" : ""}`}>

                            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                            </svg>

                        </span>

                    </button>

                    {/* Dropdown menu */}
                    <div
                        ref={dropdown}

                        onFocus={() => setDropdownOpen(true)}

                        onBlur={() => setDropdownOpen(false)}

                        className={`absolute right-0 top-full me-3 overflow-hidden rounded-lg bg-white dark:divide-dark-3 dark:bg-dark-2 z-[700] ${dropdownOpen ? "block" : "hidden"}`}

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        <div className="px-4 py-3">
                            <p className="text-sm font-semibold text-dark dark:text-white">{currentUser?.email}</p>
                        </div>

                        <div>
                            <NavLink to="/user_profil" className="flex gap-1 w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3m-3 3h3m-3 3h3M5 5h14v14H5z" />
                                </svg>
                                {t("profil")}
                            </NavLink>
                        </div>

                        <div>
                            <NavLink to="/dashboard" className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" d="M5 7h14M5 12h14M5 17h14" />
                                </svg>
                                {t("activity")}
                            </NavLink>
                        </div>

                        <div>
                            <button disabled className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z" />
                                </svg>
                                Support
                            </button>
                        </div>

                        <div>
                            <button onClick={getUserLogOut} className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />
                                </svg>
                                {t("logOut")}
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
