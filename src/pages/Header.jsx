import React, { useEffect, useState, useRef } from "react";
import { Outlet } from 'react-router-dom';
import { ButtonNavigate } from "../components/Button";
import Logo from "../components/LogoApp";
import {  useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { ENDPOINTS, getTabsNavigationsItems } from "../utils";
import SearchBar from "../components/BtnSearchWithFilter";
import api from "../services/Axios";
import MobileNav from "../features/FooterMobileNav";
import DesktopNav from "../features/FooterDeskTopNav";



const NavbarHeader = () => {

    const currentNav = useSelector(state => state.navigate.currentNav);

    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const themeValue = useSelector((state) => state.navigate.theme)

    const ref = useRef(null);

    const shouldShowNav = (currentNav === ENDPOINTS.LOGIN || currentNav === ENDPOINTS.REGISTER);

    const isHidden = currentNav === ENDPOINTS.FORGETPSWD;

    const isCentered = currentNav === ENDPOINTS.ABOUT;

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

    useEffect(

        () => {

                let lastScroll = 0;

                const header = document.getElementById("header");

                window.addEventListener("scroll", () => {

                    const currentScroll = window.scrollY;

                    if (currentScroll < lastScroll) {
                        // Scrolling UP
                        header.classList.remove("bg-none");

                        header.classList.add("bg-white-50", "shadow-none");

                    } else {

                        // Scrolling DOWN
                        header.classList.remove("bg-white-50", "shadow-none");

                        header.classList.add("bg-none");
                    }

                    lastScroll = currentScroll;
                });
        }

    )

    return (

        <nav className="sticky top-0 z-50 max-h-[20px] min-h-[20px] bg-none mt-0"  >

            <header

                id="header"

                className="flex w-full items-center justify-between  h-[50px] px-1  bg-white/80"

                ref={ref}

            >
                {/* Logo */}
                <Logo />

                {
                    (isHidden) ?
                    null
                    :
                    <div
                        className={`flex w-full items-center ${isCentered ? "justify-center" : "justify-end"}`}
                    >
                        <ButtonNavigate tabs={getTabsNavigationsItems(currentNav, t)} />

                        <SearchBar />

                    </div>
                }

                {
                    (shouldShowNav) ?
                    null
                    :
                    (
                        <span>
                            {/* Toggle Button for Mobile */}
                            <button
                                onClick={() => setOpen(prev => !prev)}
                                id="navbarToggler"
                                className={`
                                    sm:hidden z-[71] px-3 py-3 rounded-lg
                                    text-black dark:bg-dark-3 dark:text-white
                                    focus:outline-none
                                    ${open ? "navbarTogglerActive" : ""}
                               `}
                                aria-label="Toggle navigation"
                                aria-expanded={open}
                            >
                                <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-400 my-[6px]" />
                                <span className="block w-4 h-0.5 bg-gray-600 dark:bg-gray-300 my-[6px]" />
                                <span className="block w-2 h-0.5 bg-gray-500 dark:bg-gray-200 my-[6px]" />
                            </button>

                            {/* Navigation */}
                            <MobileNav open={open} />

                            <DesktopNav />

                        </span>
                    )
                }

            </header>

            <Outlet />

        </nav>
    );
};

export default NavbarHeader;



