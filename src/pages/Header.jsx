import React, { useEffect, useState, useRef } from "react";
import { Outlet } from 'react-router-dom';
import WhiteRoundedButton, { ButtonNavigate } from "../components/Button";
import Logo from "../components/LogoApp";
import {  useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { getTabsNavigationsItems } from "../utils";
import SearchBar from "../components/BtnSearchWithFilter";
import api from "../services/Axios";
import NotificationsComponent from "../components/NotificationComponent";
import PayBack from "../components/BacketButtonPay";
import ThemeToggle from "../features/Theme";


const NavbarHeader = () => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const themeValue = useSelector((state) => state.navigate.theme)

    const ref = useRef(null);

    useEffect(

        () => {
            const getDataSeachSelectedItem = async (data = categorySelectedData) => {

                if (!data?.query) return

                try {

                    await api.get(`product/fimter?search=${data?.query}`)

                } catch (e) {

                }
            }

            getDataSeachSelectedItem()

        }, [categorySelectedData]
    )

    useEffect(() => {
        function handleClickOutside(event) {

            if (ref.current && !ref.current.contains(event.target)) {

                setOpen(false); // Fermer si clic en dehors
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [])

    useEffect(() => {

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const saved = localStorage.getItem("theme");

        const theme = saved || themeValue || (prefersDark ? "dark" : "light");

        document.body.classList.remove("dark", "light");

        document.body.classList.add(theme);

    }, [themeValue]);

    return (

        <nav className="sticky top-0 z-20 max-h-[20px] min-h-[20px]">

            <header

                className="flex w-full items-center justify-between  h-[50px] px-1  bg-white"

                ref={ref}

                style={
                    {
                        backgroundColor: "var(--color-bg)",

                        color: "var(--color-text)"
                    }
                }

            >
                {/* Logo */}
                 <Logo />

                <ButtonNavigate tabs={getTabsNavigationsItems(currentNav, t)} />

                <SearchBar/>

                {

                    (!(currentNav === "login") && !(currentNav === "register")) &&

                    <span>
                        {/* Toggle Button for Mobile */}
                        <button
                            onClick={() => setOpen(!open)}
                            id="navbarToggler"
                            className={`
                            ${open && "navbarTogglerActive"} 
                            sm:hidden 
                            z-[71] px-3 py-3  rounded-lg 
                            text-black
                            dark:bg-dark-3 dark:text-white dark:bg-white
                            items-center
                            focus:outline-none
                            `}

                        >
                            <span className="block w-[30px] h-[2px] bg-gray-700 dark:bg-gray-400 my-[6px]" ></span>
                            <span className="block w-[30px] h-[2px] bg-gray-700 dark:bg-gray-200 my-[6px]"></span>
                            <span className="block w-[30px] h-[2px] bg-gray-700 dark:bg-gray-200 my-[6px]"></span>

                        </button>

                        {/* Navigation */}

                        <nav
                            id="navbarCollapse"
                            className={`sm:hidden absolute top-1/2 right-0  w-full max-w-[250px] z-[70] rounded-lg dark:divide-dark-3 dark:bg-dark-2 ${!open && "hidden"}
                            lg:static lg:block lg:max-w-full lg:w-auto`}
                        >

                            {/* Boutons et Dropdown (Mobile) */}

                            <div
                                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                                className="text-sm absolute top-4 flex flex-col items-start justify-start gap-3 p-1 sm:hidden shadow-lg w-full py-5 bg-white "
                            >
                                <WhiteRoundedButton titleButton={t('login')} to="login" />

                                <WhiteRoundedButton titleButton={t('register')} to="register" />

                                <ThemeToggle />

                            </div>

                        </nav>

                        {/* Boutons et Dropdown (Desktop) */}

                        <div
                            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                            className="hidden sm:flex items-center justify-center gap-3 w-auto bg-white mx-1"
                        >
                            {
                                (currentNav === "home") &&
                                <>
                                    <ThemeToggle/>

                                    <NotificationsComponent />

                                    <PayBack />
                                </>
                            }

                            <WhiteRoundedButton titleButton={t('login')} to="login" />

                            <WhiteRoundedButton titleButton={t('register')} to="register" />

                        </div>

                    </span>

                }

            </header>

            <Outlet />

        </nav>
    );
};

export default NavbarHeader;



