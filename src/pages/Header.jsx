import React, { useEffect, useState, useRef } from "react";
import { Outlet, NavLink } from 'react-router-dom';
import WhiteRoundedButton from "../components/Button";
import Logo from "../components/LogoApp";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav, updateTheme } from "../slices/navigateSlice";
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

export function LanguageDropdown({ changeLanguage }) {

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

    }, []);

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
    };

    return (

        <div className="relative inline-block text-left shadow-md rounded-full py-0">

            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="flex justify-center items-center w-full  px-2  text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none rounded-full"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedLang}

                <svg
                    className="w-[22px] h-[22px] ml-2 -mr-1 h-5 w-5"
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

                        className={`absolute right-0 w-28 rounded-md shadow-lg z-[80] ring-black ring-opacity-5 ${openDirection === "top" ? "origin-bottom-right mb-2 bottom-full" : "origin-top-right mt-2 top-full" }`}

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

    const applyTheme = (newTheme) => {

        document.body.classList.remove('dark', 'light');

        document.body.classList.add(newTheme);

        localStorage.setItem('theme', newTheme);

        dispatch(updateTheme(newTheme));

        const metaThemeColor = document.querySelector("meta[name=theme-color]");

        if (metaThemeColor) {

            metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
        }
    }

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

        const next = theme === 'dark' ? 'light' : 'dark';

        setTheme(next);

        applyTheme(next);
    };

    return (

        <button

            onClick={toggleTheme}

            type="button"

            className="shadow-lg inline-flex flex-col items-center rounded-full justify-center px-5 m-2 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">

                {
                    (theme === 'dark') ?
                        (

                            <svg className="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                <path fill="currentColor" d="M5.99997 17c-.55229 0-1 .4477-1 1s.44771 1 1 1h.01c.55228 0 1-.4477 1-1s-.44772-1-1-1h-.01ZM18 17c-.5523 0-1 .4477-1 1s.4477 1 1 1h.01c.5523 0 1-.4477 1-1s-.4477-1-1-1H18Z" />

                                <path fill="currentColor" fillRule="evenodd" d="M12 13c.5523 0 1 .4477 1 1v.5858l.4142-.4142c.3905-.3905 1.0237-.3905 1.4142 0 .3905.3905.3905 1.0237 0 1.4142L14.4141 16l.5859.0001c.5523 0 1 .4477 1 1s-.4478 1-1.0001 1L14.4141 18l.4143.4143c.3905.3906.3905 1.0237 0 1.4142-.3906.3906-1.0237.3905-1.4143 0L13 19.4143v.5858c0 .5522-.4477 1-1 1s-1-.4478-1-1v-.5859l-.4143.4142c-.3905.3906-1.02365.3906-1.41417 0-.39053-.3905-.39053-1.0236 0-1.4142L9.58571 18l-.58572.0001c-.55228 0-1.00001-.4477-1.00002-1-.00001-.5523.44769-1 .99998-1L9.58571 16l-.41416-.4141c-.39054-.3905-.39056-1.0237-.00005-1.4142.39052-.3905 1.0237-.3906 1.4142 0l.4143.4142V14c0-.5523.4477-1 1-1Z" clipRule="evenodd" />

                                <path fill="currentColor" d="M9.21869 3.96216c1.18841-.77809 2.61801-1.10041 4.02531-.90756 1.4073.19285 2.6974.88787 3.6327 1.95696.8431.96375 1.3466 2.17293 1.4406 3.44244.6029.16797 1.1584.48908 1.6088.93946C20.6137 10.0811 21 11.0137 21 11.9862c0 .9449-.3677 1.9573-1.0739 2.6636-.6417.6416-1.4561.9281-2.2516.9899-.1439-.2824-.3312-.539-.5532-.761 0-.7677-.2929-1.5355-.8787-2.1213-.5858-.5858-1.3535-.8787-2.1213-.8787-.5429-.5429-1.2929-.8786-2.1213-.8786-.8285 0-1.5785.3358-2.12139.8787-.76778 0-1.53555.2929-2.12133.8788-.58574.5857-.87861 1.3535-.87862 2.1212-.18576.1858-.34727.3958-.47938.6249-.77455-.2033-1.48895-.6091-2.06499-1.1851C3.47996 13.4642 3 12.3055 3 11.0973c0-1.1581.38455-2.34287 1.27157-3.22989.74279-.74279 1.74607-1.18271 2.75928-1.2962.45424-1.06098 1.21293-1.97073 2.18784-2.60905Z" />

                            </svg>

                        )
                        :
                        (
                            <svg className="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.3333 14.6528c.7073 0 1.3856-.2101 1.8857-.7101.5-.5001.781-1.2493.781-1.9565 0-.7073-.281-1.3856-.781-1.8857-.5001-.50007-1.1784-.78102-1.8857-.78102h-.0222c.0133-.14755.0222-.296.0222-.44444-.0033-1.17924-.4328-2.31753-1.2092-3.20508-.7765-.88756-1.8476-1.46455-3.0159-1.62465-1.1683-.1601-2.3551.10749-3.34174.75344-.98658.64596-1.70644 1.62675-2.0269 2.76162-.06223-.00355-.12089-.01866-.184-.01866-.943 0-1.91009.36598-2.57689 1.03277C4.31188 9.24128 4 10.1543 4 11.0973c0 .943.3746 1.8473 1.0414 2.5141.45292.4529 1.01546.7711 1.62527.9285M12 14v3m0 0v3m0-3-2.12134-2.1212M12 17l2.1213 2.1214M12 17H9m3 0h3m-3 0-2.12134 2.1213M12 17l2.1213-2.1213M6 18h.01M18 18h.01" />

                            </svg>

                        )
                }

            </span>

        </button>
    );
};

const NavbarHeader = () => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    const { t } = useTranslation();

    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang);
    };

    const [open, setOpen] = useState(false);

    const themeValue = useSelector((state) => state.navigate.theme)

    const ref = useRef(null);

    const tabs = [
        {
            id: 'home',
            label: t('home'),
            endPoint: '/',
            logo: !(currentNav === "home") ? (
                <svg
                    className="w-[22px] h-[22px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                    />
                </svg>
            ) : (
                <svg className="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                </svg>

            ),
        },
        {
            id: 'about',
            label: t('about'),
            endPoint: '/about',
            logo:
                (currentNav === "about") ?
                    (
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
                        </svg>

                    )
                    :
                    (
                        <svg
                            className="w-[22px] h-[22px] text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    ),
        },
        {
            id: 'blogs',
            label: 'Blogs',
            endPoint: '/blogs',
            logo:
                !(currentNav === "blogs") ?
                    (
                        <svg
                            className="w-[22px] h-[22px] text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="1"
                                d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                    )
                    :
                    (
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clipRule="evenodd" />
                        </svg>
                    )
            ,
        },
    ];


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

        <>
            <header className="w-full z-20 flex items-center style-bg py-2" ref={ref}>

                <div className="container mx-auto px-4">

                    <div className="flex items-center justify-between relative">

                        {/* Logo */}
                        <Logo />
                            
                        <ButtonNavigate tabs={tabs} />

                        {/* Toggle Button for Mobile */}
                        <button
                            onClick={() => setOpen(!open)}
                            id="navbarToggler"
                            className={`
                            ${open && "navbarTogglerActive"} 
                            sm:hidden absolute right-1 top-1/2 transform -translate-y-1/2 
                            z-[71] px-3 py-[6px] rounded-lg 
                            text-black
                            dark:bg-dark-3 dark:text-white mb-2 dark:bg-white
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
                                className="text-sm absolute top-5 flex flex-col items-start justify-start gap-2  sm:hidden shadow-md w-full "
                                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                            >

                                <LanguageDropdown changeLanguage={changeLanguage} />

                                <ThemeToggle />

                                <WhiteRoundedButton titleButton={t('login')} to="/logIn" />

                                <WhiteRoundedButton titleButton={t('register')} to="/Register" />

                            </div>

                        </nav>

                        {/* Boutons et Dropdown (Desktop) */}
                        <div
                            className="hidden sm:flex items-center justify-center gap-3"
                            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                        >

                            <LanguageDropdown changeLanguage={changeLanguage} />

                            <ThemeToggle />

                            <WhiteRoundedButton titleButton={t('login')} to="/logIn" />

                            <WhiteRoundedButton titleButton={t('register')} to="/Register" />

                        </div>

                    </div>

                </div>


            </header>


            <Outlet />
        </>
    );
};

export default NavbarHeader;

const ButtonNavigate = ({ tabs }) => {

    const dispatch = useDispatch();

    return (

        <ul
            className="
                fixed bottom-0 left-0 w-full flex gap-2
                border-0
                sm:items-center
                lg:static lg:flex 
                lg:flex-row 
                lg:w-auto
                lg:justify-between
                dark:bg-dark-2
                px-4 py-0 z-50 
             "
            style={
                {

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }
            }
        >
            {tabs.map((tab) => (

                <li key={tab.id} className="w-full sm:w-auto gap-6 px-1">

                    <NavLink

                        to={tab.endPoint}

                        className={
                            ({ isActive }) =>
                                `w-full text-center items-center flex flex-col lg:flex-row gap-1
                                px-2 py-2
                                transition 
                                ${isActive
                                    ? 'sm:border-t sm:border-b-0 lg:border-b lg:border-t-0 border-gray-300'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-3 hover:rounded-full'}
                                `
                        }

                        onClick={() => dispatch(setCurrentNav(tab.id))}
                    >
                        <>{tab.logo}</>

                        <>{tab.label}</>

                    </NavLink>

                </li>
            ))
        }
        </ul>
    );
};


