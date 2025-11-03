import React, { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateLang } from '../slices/navigateSlice';

function LanguageDropdown() {

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

        <div className="relative inline-block text-left rounded-lg py-0 mx-2">

            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="flex justify-center items-center  px-1 h-8  text-xs  text-gray-700 hover:bg-gray-50 rounded-lg"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {selectedLang}

                {/*<svg*/}
                {/*    className="w-5 h-5 "*/}
                {/*    xmlns="http://www.w3.org/2000/svg"*/}
                {/*    viewBox="0 0 20 20"*/}
                {/*    fill="currentColor"*/}
                {/*>*/}
                {/*    <path*/}
                {/*        fillRule="evenodd"*/}
                {/*        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"*/}
                {/*        clipRule="evenodd"*/}
                {/*    />*/}

                {/*</svg>*/}
                <span className={`transition-transform duration-100 ${selectedLang ? "-scale-y-100" : ""}`}>

                    <svg className="w-6 h-8 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                    </svg>

                </span>

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

export default LanguageDropdown;