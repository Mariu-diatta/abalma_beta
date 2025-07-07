import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from 'react-router-dom';
import WhiteRoundedButton from "../components/Button";
import Logo from "../components/LogoApp";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "../slices/navigateSlice";
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

export function LanguageDropdown({ changeLanguage }) {

    const [isOpen, setIsOpen] = useState(false);

    const [selectedLang, setSelectedLang] = useState("Langue");

    // Mise à jour automatique de l'affichage quand la langue change
    useEffect(() => {

        const lang = i18n.language || window.localStorage.i18nextLng || "fr";

        setSelectedLang(

            (lang === "fr") ?

                <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-5 h-4" />

                :

                <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-5 h-4" />

        );

    }, []);

    const handleChangeLanguage = (lang) => {

        changeLanguage(lang);
 
        setSelectedLang(lang === "fr" ? 
            <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-5 h-4" />
            : 
            <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-5 h-4" />
        );

        setIsOpen(false);
    };

    return (

        <div className="relative inline-block text-left z-100">

            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex justify-center w-full rounded-full shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedLang}

                <svg
                    className="ml-2 -mr-1 h-5 w-5"
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

            {isOpen && (

                <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg ring-black ring-opacity-5 style-bg z-50">

                    <div className="py-1">

                        <button
                            onClick={() => handleChangeLanguage("fr")}
                            className="flex gap-2  items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                        >
                            Fr

                            <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-5 h-4" />

                        </button>

                        <button
                            onClick={() => handleChangeLanguage("en")}
                            className="flex  gap-2 items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                        >
                            En

                            <img src="https://flagcdn.com/w40/gb.png" alt="En" className="w-5 h-4" />

                        </button>

                    </div>

                </div>
            )}

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

            className="inline-flex flex-col items-center rounded-full justify-center px-5 m-2 hover:bg-gray-50 dark:hover:bg-gray-800 group"
        >
            <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">

                {
                    (theme === 'dark') ?
                    (

                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                            <path fill="currentColor" d="M5.99997 17c-.55229 0-1 .4477-1 1s.44771 1 1 1h.01c.55228 0 1-.4477 1-1s-.44772-1-1-1h-.01ZM18 17c-.5523 0-1 .4477-1 1s.4477 1 1 1h.01c.5523 0 1-.4477 1-1s-.4477-1-1-1H18Z" />

                            <path fill="currentColor" fill-rule="evenodd" d="M12 13c.5523 0 1 .4477 1 1v.5858l.4142-.4142c.3905-.3905 1.0237-.3905 1.4142 0 .3905.3905.3905 1.0237 0 1.4142L14.4141 16l.5859.0001c.5523 0 1 .4477 1 1s-.4478 1-1.0001 1L14.4141 18l.4143.4143c.3905.3906.3905 1.0237 0 1.4142-.3906.3906-1.0237.3905-1.4143 0L13 19.4143v.5858c0 .5522-.4477 1-1 1s-1-.4478-1-1v-.5859l-.4143.4142c-.3905.3906-1.02365.3906-1.41417 0-.39053-.3905-.39053-1.0236 0-1.4142L9.58571 18l-.58572.0001c-.55228 0-1.00001-.4477-1.00002-1-.00001-.5523.44769-1 .99998-1L9.58571 16l-.41416-.4141c-.39054-.3905-.39056-1.0237-.00005-1.4142.39052-.3905 1.0237-.3906 1.4142 0l.4143.4142V14c0-.5523.4477-1 1-1Z" clip-rule="evenodd" />

                            <path fill="currentColor" d="M9.21869 3.96216c1.18841-.77809 2.61801-1.10041 4.02531-.90756 1.4073.19285 2.6974.88787 3.6327 1.95696.8431.96375 1.3466 2.17293 1.4406 3.44244.6029.16797 1.1584.48908 1.6088.93946C20.6137 10.0811 21 11.0137 21 11.9862c0 .9449-.3677 1.9573-1.0739 2.6636-.6417.6416-1.4561.9281-2.2516.9899-.1439-.2824-.3312-.539-.5532-.761 0-.7677-.2929-1.5355-.8787-2.1213-.5858-.5858-1.3535-.8787-2.1213-.8787-.5429-.5429-1.2929-.8786-2.1213-.8786-.8285 0-1.5785.3358-2.12139.8787-.76778 0-1.53555.2929-2.12133.8788-.58574.5857-.87861 1.3535-.87862 2.1212-.18576.1858-.34727.3958-.47938.6249-.77455-.2033-1.48895-.6091-2.06499-1.1851C3.47996 13.4642 3 12.3055 3 11.0973c0-1.1581.38455-2.34287 1.27157-3.22989.74279-.74279 1.74607-1.18271 2.75928-1.2962.45424-1.06098 1.21293-1.97073 2.18784-2.60905Z" />
                        </svg>

                    )
                    :
                    (
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.3333 14.6528c.7073 0 1.3856-.2101 1.8857-.7101.5-.5001.781-1.2493.781-1.9565 0-.7073-.281-1.3856-.781-1.8857-.5001-.50007-1.1784-.78102-1.8857-.78102h-.0222c.0133-.14755.0222-.296.0222-.44444-.0033-1.17924-.4328-2.31753-1.2092-3.20508-.7765-.88756-1.8476-1.46455-3.0159-1.62465-1.1683-.1601-2.3551.10749-3.34174.75344-.98658.64596-1.70644 1.62675-2.0269 2.76162-.06223-.00355-.12089-.01866-.184-.01866-.943 0-1.91009.36598-2.57689 1.03277C4.31188 9.24128 4 10.1543 4 11.0973c0 .943.3746 1.8473 1.0414 2.5141.45292.4529 1.01546.7711 1.62527.9285M12 14v3m0 0v3m0-3-2.12134-2.1212M12 17l2.1213 2.1214M12 17H9m3 0h3m-3 0-2.12134 2.1213M12 17l2.1213-2.1213M6 18h.01M18 18h.01" />

                        </svg>
                    )
                }
              
            </span>

        </button>
    );
};

const NavbarHeader = () => {

    const { t } = useTranslation();

    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const [open, setOpen] = useState(false);

    const themeValue = useSelector((state) => state.navigate.theme)

    const tabs = [
        { id: 'home', label: t('home'), endPoint: '/' },
        { id: 'about', label: t('about'), endPoint: '/About' },
        { id: 'blog', label: 'Blog', endPoint: '/Blog' },
    ];


    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const saved = localStorage.getItem("theme");
        const theme = saved || themeValue || (prefersDark ? "dark" : "light");

        document.body.classList.remove("dark", "light");
        document.body.classList.add(theme);

    }, [themeValue]);

    return (
        <>
            <header className="absolute left-0 right-0 top-2 z-20 flex w-full items-center justify-between style-bg">

                <div className="container style-bg">

                    <div className="relative -mx-4 flex items-center justify-between ">

                        <div className="w-50 max-w-full px-6">
                            <a href="/" className="block w-full py-2">
                                <Logo />
                            </a>
                        </div>

                        <div className="flex w-full items-center justify-between px-4">

                            <div>

                                <button
                                    onClick={() => setOpen(!open)}
                                    id="navbarToggler"
                                    className={`${open && "navbarTogglerActive"} absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] bg-white-500 focus:ring-0 ring-primary lg:hidden  focus:bg-gray-200`}
                                >
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>

                                </button>

                                <nav

                                    id="navbarCollapse"

                                    className={`style-bg absolute right-4 top-full w-full max-w-[250px] rounded-lg  px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"}`}
                                >
                                    <ul className="block lg:flex">

                                        <ul className="lg:flex md:block">

                                            {
                                                tabs.map(
                                                    (tab) => (

                                                        <li className="me-1" key={tab.id}>

                                                            <NavLink

                                                                to={tab.endPoint}

                                                                className={({ isActive }) =>

                                                                    `inline-block p-2 border-b-2 rounded-t-lg ${isActive

                                                                        ? 'text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500'

                                                                        : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'

                                                                    } flex text-base font-medium text-dark dark:text-white lg:ml-10 lg:inline-flex`
                                                                }
                                                            >
                                                                {tab.label}

                                                            </NavLink>

                                                        </li>
                                                    )
                                                )
                                            }

                                        </ul>

                                    </ul>

                                    <div className="lg:hidden md:hidden justify-end pr-16 sm:flex lg:pr-0 gap-3 style-bg">

                                        <LanguageDropdown changeLanguage={changeLanguage} />

                                        <ThemeToggle />

                                        <WhiteRoundedButton titleButton={t('login')} to="/logIn" />

                                        <WhiteRoundedButton titleButton={t('register')} to="/Register" />

                                    </div>

                                </nav>
                            </div>

                            <div className="hidden sm:flex items-center justify-end gap-2 pr-16 lg:pr-0">

                                <LanguageDropdown changeLanguage={changeLanguage} />

                                <ThemeToggle />

                                <WhiteRoundedButton titleButton={t('login')} to="/logIn" />

                                <WhiteRoundedButton titleButton={t('register')} to="/Register" />
                            </div>

                        </div>

                    </div>

                </div>

            </header>

            <Outlet />
        </>
    );
};

export default NavbarHeader;
