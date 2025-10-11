import React, { useEffect, useState, useRef } from "react";
import { Outlet } from 'react-router-dom';
import WhiteRoundedButton, { ButtonNavigate } from "../components/Button";
import Logo from "../components/LogoApp";
import { useDispatch, useSelector } from "react-redux";
import { updateLang, updateTheme } from "../slices/navigateSlice";
import { useTranslation } from 'react-i18next';
import { applyTheme, getTabsNavigationsItems } from "../utils";
import SearchBar from "../components/BtnSearchWithFilter";
import api from "../services/Axios";
import NotificationsComponent from "../components/NotificationComponent";
import PayBack from "../components/BacketButtonPay";

export function LanguageDropdown() {

    const { i18n } = useTranslation();

    const dispatch = useDispatch();

    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang);
    };
    const [isOpen, setIsOpen] = useState(false);

    const [selectedLang, setSelectedLang] = useState("Langue");

    const [openDirection, setOpenDirection] = useState("bottom"); // "bottom" ou "top"

    const buttonRef = useRef(null);

    useEffect(() => {

        const lang = i18n.language || window.localStorage.i18nextLng || "fr";

        setSelectedLang(

            (lang === "fr") ? (

                <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-4 h-4" />
            ) : (
                <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-4 h-4" />
            )
        );

    }, [i18n.language]);

    useEffect(() => {

        if (isOpen && buttonRef.current) {

            const rect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const dropdownHeight = 100; // approximatif ou mesurer dynamiquement
            const spaceBelow = viewportHeight - rect.bottom;

            if (spaceBelow < dropdownHeight) {

                setOpenDirection("top");

            } else {

                setOpenDirection("bottom");
            }
        }
    }, [isOpen]);

    const handleChangeLanguage = (lang) => {

        changeLanguage(lang);

        setSelectedLang(

            (lang === "fr") ? (

                <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-4 h-4" />

            ) : (

                <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-4 h-4" />
            )
        );

        setIsOpen(false);

        dispatch(updateLang(lang))
    };

    return (

        <div className="relative inline-block text-left rounded-lg py-0 mx-2 shadow-sm ">

            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="flex justify-center items-center  px-1 h-8  text-xs  text-gray-700 hover:bg-gray-50 rounded-lg"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedLang}

                <svg
                    className="w-6 h-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />

                </svg>

            </button>

            {
                isOpen && (

                    <div

                        className={`absolute right-0 w-28 rounded-md z-[80] ring-black ring-opacity-5 ${openDirection === "top" ? "origin-bottom-right mb-2 bottom-full" : "origin-top-right mt-2 top-full"}`}

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        <div className="py-1">

                            <button
                                onClick={() => handleChangeLanguage("fr")}
                                className="flex gap-2 items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                Fr
                                <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-5 h-4" />

                            </button>

                            <button
                                onClick={() => handleChangeLanguage("en")}
                                className="flex gap-2 items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                En
                                <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-5 h-4" />

                            </button>

                        </div>

                    </div>
                )
            }

        </div>
    );
}

// ⚙️ Appliquer la classe dark/light au body et changer la balise meta
export const ThemeToggle = () => {

    const [theme, setTheme] = useState('light');

    const dispatch = useDispatch();

    useEffect(() => {

        const storedTheme = localStorage.getItem('theme') || 'light';

        const applyTheme = (newTheme) => {

            document.body.classList.remove('dark', 'light');

            document.body.classList.add(newTheme);

            localStorage.setItem('theme', newTheme);

            dispatch(updateTheme(newTheme));

            const metaThemeColor = document.querySelector("meta[name=theme-color]");

            if (metaThemeColor) {

                metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
            }
        };

        applyTheme(storedTheme);

        setTheme(storedTheme);

    }, [dispatch]);

    const toggleTheme = () => {


        const storedTheme = localStorage.getItem('theme');

        const next = storedTheme === 'dark' ? 'light' : 'dark';

        setTheme(next);

        applyTheme(next, dispatch);

        localStorage.setItem('theme', next)
    };

    return (

        <button

            onClick={toggleTheme}

            type="button"

            className="shadow-sm cursor-pointer inline-flex flex-col items-center rounded-full justify-center px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 group h-8 w-8"
        >
            <span className="text-[14px] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">

                {
                    (theme === 'dark') ?
                        (
                            <svg className="w-6 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" clipRule="evenodd" />
                            </svg>
                        )
                        :
                        (
                            <svg className="w-6 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z" />
                            </svg>
                        )
                }

            </span>

        </button>
    );
};

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
                                    <ThemeToggle />

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



