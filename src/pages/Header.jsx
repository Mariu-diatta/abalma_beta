import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Logo from "../components/LogoApp";
import { ButtonNavigate } from "../components/Button";
import { ENDPOINTS, getTabsNavigationsItems } from "../utils";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";

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

    // Pages spécifiques
    const isHidden = currentNav === ENDPOINTS.FORGETPSWD;
    const isCentered = currentNav === ENDPOINTS.ABOUT;

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch filtered data when categorySelectedData changes
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

    // Theme handling
    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = localStorage.getItem("theme") || themeValue || (prefersDark ? "dark" : "light");
        document.body.classList.remove("dark", "light");
        document.body.classList.add(theme);
    }, [themeValue]);

    // Scroll header effect
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

    // Sync currentNav with URL
    useEffect(() => {
        if (!currentNav) {
            navigate("/", { replace: true });
        } else navigate(`/${currentNav}`, { replace: true });

    }, [currentNav, navigate, dispatch]);

    return (
        <nav className="sticky top-0 z-50 max-h-[20px] min-h-[20px] bg-none mb-8">

            <header
                id="header"
                className="flex w-full items-center justify-between h-[50px] px-1 bg-white"
                ref={ref}
            >
                <Logo />

                {!isHidden && (
                    <div className={`flex w-full items-center ${isCentered ? "justify-center" : "justify-end"}`}>

                        <span className="hidden md:block">
                            <ButtonNavigate tabs={getTabsNavigationsItems(currentNav, t)} />
                        </span>

                        {/* Lazy-loaded SearchBar */}
                        <Suspense fallback={null}>
                            <SearchBar />
                        </Suspense>

                    </div>
                )}

                <span>
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        id="navbarToggler"
                        className={`sm:hidden z-[71] px-3 py-3 rounded-lg text-black dark:bg-dark-3 dark:text-white focus:outline-none ${open ? "navbarTogglerActive z-[9999]" : ""}`}
                        aria-label="Toggle navigation"
                        aria-expanded={open}
                    >
                        <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-400 my-[6px]" />
                        <span className="block w-4 h-0.5 bg-gray-600 dark:bg-gray-300 my-[6px]" />
                        <span className="block w-2 h-0.5 bg-gray-500 dark:bg-gray-200 my-[6px]" />
                    </button>

                    {/* Lazy-loaded Navigation */}
                    <Suspense fallback={null}>
                        <MoreSheetMobile open={open} onClose={() => setOpen(false)} />
                        <DesktopNav />
                    </Suspense>
                </span>
                
            </header>

            <Outlet />
        </nav>
    );
};

export default NavbarHeader;