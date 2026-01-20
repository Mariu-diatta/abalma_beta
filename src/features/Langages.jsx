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
                {/*{selectedLang}*/}
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M4.37 7.657c2.063.528 2.396 2.806 3.202 3.87 1.07 1.413 2.075 1.228 3.192 2.644 1.805 2.289 1.312 5.705 1.312 6.705M20 15h-1a4 4 0 0 0-4 4v1M8.587 3.992c0 .822.112 1.886 1.515 2.58 1.402.693 2.918.351 2.918 2.334 0 .276 0 2.008 1.972 2.008 2.026.031 2.026-1.678 2.026-2.008 0-.65.527-.9 1.177-.9H20M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>

                <span className={`transition-transform duration-100 ${selectedLang ? "-scale-y-100" : ""}`}>

                    <svg className="w-6 h-8 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="m8 10 4 4 4-4" />

                    </svg>

                </span>

            </button>


            {
                isOpen && (

                    <div

                        className={` absolute right-0 w-28 rounded-md z-[30] ring-black ring-opacity-5 ${openDirection === "top" ? "origin-bottom-right mb-2 bottom-full" : "origin-top-right mt-2 top-full"}`}

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        <div className="py-1">

                            <button
                                onClick={() => handleChangeLanguage("fr")}
                                className=" flex justify-between w-full gap-2 items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                Français

                                <img src="https://flagcdn.com/w40/fr.png" alt="Fr" className="w-5 h-4" />

                            </button>

                            <button
                                onClick={() => handleChangeLanguage("en")}
                                className=" flex justify-between w-full  gap-2 items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                English

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