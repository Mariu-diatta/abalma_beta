import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Logo from "../components/LogoApp";
import { ButtonNavigate } from "../components/Button";
import { ENDPOINTS, getTabsNavigationsItems } from "../utils";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { useScrollVisibility } from "../hooks/useScrollVisibility";

// Lazy load heavy components
const SearchBar = lazy(() => import("../components/BtnSearchWithFilter"));
const MoreSheetMobile = lazy(() => import("../features/FooterMobileNav").then(m => ({ default: m.MoreSheetMobile })));
const DesktopNav = lazy(() => import("../features/FooterDeskTopNav"));


const NavbarHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const ref = useRef(null);
    const currentNav = useSelector(state => state.navigate.currentNav);
    const categorySelectedData = useSelector(state => state.navigate.categorySelectedOnSearch);
    const themeValue = useSelector(state => state.navigate.theme);

    const [open, setOpen] = useState(false);
    const visible = useScrollVisibility();
    // ── tout le reste (isHidden, isCentered, tous les useEffect existants) reste identique ──

    const isHidden = currentNav === ENDPOINTS.FORGETPSWD;
    const isCentered = currentNav === ENDPOINTS.ABOUT;

    useEffect(() => {
        const handleClickOutside = event => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!categorySelectedData?.query) return;

        const fetchFiltered = async () => {
            try {
                await api.get(API_ENDPOINTS.PRODUCTS.HEADER_SEARCH(categorySelectedData.query));
            } catch (e) {
                console.error(e);
            }
        };
        fetchFiltered();
    }, [categorySelectedData]);

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = localStorage.getItem("theme") || themeValue || (prefersDark ? "dark" : "light");
        document.body.classList.remove("dark", "light");
        document.body.classList.add(theme);
    }, [themeValue]);

    // Effet existant INCHANGÉ — gère le fond du header en fonction du sens de scroll
    useEffect(() => {
        let lastScroll = 0;
        const header = document.getElementById("header");

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (!header) return;
            if (currentScroll < lastScroll) {
                header.classList.remove("bg-none");
                header.classList.add("bg-white", "border-b", "border-[#dbdbdb]");
            } else {
                header.classList.remove("bg-white", "border-b", "border-[#dbdbdb]");
                header.classList.add("bg-none");
            }
            lastScroll = currentScroll;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!currentNav) {
            navigate("/", { replace: true });
        } else navigate(`/${currentNav}`, { replace: true });

    }, [currentNav, navigate, dispatch]);

    return (
        <nav className="mb-0">

            <header
                id="header"
                className={`
                flex 
                items-center fixed max-h-[8dvh]
                w-full
                px-3 md:px-6
                top-0
                left-0
                right-0
                z-[9999]
                transition-all
                duration-300
                ease-in-out
                backdrop-blur-md
                shadow-sm
                bg-white
                ${visible ? "translate-y-0 mb-0 " : "-translate-y-full"}`
                }
            >
                <Logo />

                {!isHidden && (
                    <div className={`flex w-full items-center gap-3 ${isCentered ? "justify-center" : "justify-end"}`}>

                        <span className="hidden md:block">
                            <ButtonNavigate tabs={getTabsNavigationsItems(currentNav, t)} />
                        </span>

                        <Suspense fallback={null}>
                            <SearchBar />
                        </Suspense>

                    </div>
                )}

                <span>
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        id="navbarToggler"
                        className={`sm:hidden z-[71] p-2.5 rounded-full text-black dark:bg-dark-3 dark:text-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 ${open ? "navbarTogglerActive z-[9999] bg-gray-100" : ""}`}
                        aria-label="Toggle navigation"
                        aria-expanded={open}
                    >
                        <span className={`block w-6 h-0.5 rounded-full bg-gray-700 dark:bg-gray-400 my-[6px] transition-transform duration-200 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
                        <span className={`block w-4 h-0.5 rounded-full bg-gray-600 dark:bg-gray-300 my-[6px] transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
                        <span className={`block w-2 h-0.5 rounded-full bg-gray-500 dark:bg-gray-200 my-[6px] transition-transform duration-200 ${open ? "-rotate-45 -translate-y-[7px] w-6" : ""}`} />
                    </button>

                    <span className="hidden md:block">
                        <Suspense fallback={null}>
                            <MoreSheetMobile open={open} onClose={() => setOpen(false)} />
                            <DesktopNav />
                        </Suspense>
                    </span>

                </span>

            </header>

            <span className="md:hidden z-[9999] ">
                <Suspense fallback={null}>
                    <MoreSheetMobile open={open} onClose={() => setOpen(false)} />
                </Suspense>
            </span>

            <Outlet />
        </nav>
    );
};

export default NavbarHeader;