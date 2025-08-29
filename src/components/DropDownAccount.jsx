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
import AttentionAlertMessage, { showMessage } from "./AlertMessage";
import LoadingCard from "./LoardingSpin";
import NotificationGroup from "./NotificationGrouped";

export default function AccountDropdownUserProfil() {

    const { t } = useTranslation();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [loading, setLoading] = useState(false);

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

        if (!currentUser?.id) return 

        setLoading(true)

        if (window.confirm("Voulez-vous vous deconnecter???")) {

            try {

                const formData = new FormData();

                formData.append("is_connected", false);

                await api.put(`clients/${currentUser?.id}/`, formData, {

                    headers: { "Content-Type": "multipart/form-data" },
                });

                dispatch(clearCart());

                dispatch(clearRooms());

                dispatch(cleanAllMessageNotif());

                dispatch(logout());

                dispatch(setCurrentNav("/logIn"))

                return navigate("/logIn", { replace: true });

            } catch (error) {

                showMessage(dispatch, {Type:"Erreur", Message :error?.message || error?.request?.response});

            } finally {

                setLoading(false)
            }
        }
    };

    return (

        <section className="flex items-center justify-center px-2  bg-transparent rounded-lg absolute top-0 bg-gray-2 dark:bg-dark z-[10] mb-6">

            <AttentionAlertMessage/>

            {/* Mobile only - fixed bottom bar */}
            <div
                className="fixed bottom-0 w-max-100 left-0 right-0 z-0 flex items-center justify-around sm:flex md:hidden lg:hidden"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >

                <NotificationGroup
                    currentUser={currentUser}
                    currentNotifMessages={currentNotifMessages}
                    notify={notify}
                    changeLanguage={changeLanguage}
                    nbItems={nbItems}
                    dispatch={dispatch}
                    navigate={navigate}
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
                    dispatch={dispatch}
                    navigate={navigate}
                />

            </div>

            {/* Avatar + dropdown */}
            <button

                ref={trigger}

                onClick={() => setDropdownOpen(!dropdownOpen)}

                className="hover:bg-gray-50 dark:hover:bg-gray-800 relative inline-flex h-6 items-center justify-center gap-0 rounded-lg  dark:bg-dark-2 px-1 my-2 dark:text-white"

            >
                {
                    currentUser?.image ? (

                        <div className="flex items-center relative h-[30px] w-[30px] rounded-full">

                            <img
                                src={currentUser?.image}
                                alt="avatar"
                                title={currentUser?.email}
                                className="h-6 w-6 rounded-full object-cover object-center cursor-pointer items-center "
                            />

                            {
                                currentUser?.is_connected &&
                                (

                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark">

                                    </span>

                                )
                            }

                        </div>

                    ) : (
                        <div className="relative h-[30px] w-[30px] rounded-full" title={currentUser?.email}>

                            <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"
                                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                            </svg>

                            {
                                currentUser?.is_connected &&
                                (

                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                )
                            }

                        </div>
                    )}

                <span className={`transition-transform duration-100 ${dropdownOpen ? "-scale-y-100" : ""}`}>

                    <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                    </svg>

                </span>

            </button>

            {/* Dropdown menu */}
            <div
                ref={dropdown}

                onFocus={() => setDropdownOpen(true)}

                onBlur={() => setDropdownOpen(false)}

                className={` shadow-lg bg-transparent absolute right-0 top-full me-3 overflow-hidden rounded-lg dark:divide-dark-3 dark:bg-dark-2 ${dropdownOpen ? "block z-50 bg-white" : "hidden"}`}

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >

                <div className="px-4 py-3">

                    <p className="whitespace-nowrap text-sm font-semibold text-dark dark:text-white">{currentUser?.email}</p>

                </div>

                <div>

                    <button

                        className="shadow-md flex gap-1 w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"

                        onClick={

                            () => {

                                navigate("/user_profil");

                                dispatch(setCurrentNav("user_profil"))
                            }
                        }
                    >

                        <div className="flex gap-2 items-center">

                            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeWidth="1" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />

                            </svg>

                            <div className="whitespace-nowrap">{t("profil")}</div>

                        </div>

                        <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />

                        </svg>

                    </button>

                </div>

                <div>

                    <button

                        onClick={() => { navigate("/settings"); dispatch(setCurrentNav("settings")) }}

                        className="shadow-md d-flex gap-3 flex w-full items-center justify-between px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">

                        <div className="text-left flex gap-2 items-center">

                            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            </svg>


                            <div className="whitespace-nowrap">{t("param")} </div>

                        </div>

                        <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />

                        </svg>

                    </button>

                </div>

                <div>

                    {
                        !loading?
                        <button onClick={getUserLogOut} className="shadow-lg flex w-full items-center justify-start gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-white/5">

                            <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2" />

                            </svg>

                            {t("logOut")}

                        </button>
                        :
                        <LoadingCard/>

                    }

                </div>

            </div>
            
        </section>
    );
}



