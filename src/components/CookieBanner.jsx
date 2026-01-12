import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CookieBanner = () => {

    const [visible, setVisible] = useState(false); // bannière affichée
    const [consentGiven, setConsentGiven] = useState(false); // a accepté ou pas
    const { t } = useTranslation();

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (consent === "accepted") {
            setConsentGiven(true);
        } else {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setConsentGiven(true);
        setVisible(false);
    };

    const toggleBanner = () => {
        setVisible((prev) => !prev);
    };

    // Si l'utilisateur a accepté → plus rien ne s'affiche
    if (consentGiven) return null;

    return (
        <>
            {/* Bannière cookies */}
            {visible && (
                <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
                    <div
                        className="bg-gray-100 p-4 rounded-t-lg shadow-lg max-w-3xl w-full mx-2 transition-all duration-500"
                        style={{
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)",
                        }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">

                            <div className="flex-1">

                                <p>
                                    {t("cookie_banner.text1")}{" "}
                                    <a href="/politique-confidentialite" className="underline">
                                        {t("cookie_banner.text2")}
                                    </a>
                                </p>

                                <p className="text-xs dark:text-gray-400 mt-1">
                                    &copy; 2025 <strong>Abalma</strong>{" "}
                                    {t("footer_toutDroit")}
                                </p>

                            </div>

                            <div className="flex gap-2">

                                <button
                                    onClick={acceptCookies}
                                    className="hover:bg-blue-200 bg-blue-100 px-4 py-1 rounded-full"
                                >
                                    {t("cookie_banner.text3")}
                                </button>

                                <button
                                    onClick={toggleBanner}
                                    className="bg-red-100 hover:bg-red-200 px-4 py-1 rounded-full"
                                >
                                    {t("cookie_banner.text4")}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bouton flottant Cookies si la bannière est masquée */}
            {
                (!visible && !consentGiven) && (
                    <button
                        onClick={toggleBanner}
                        className="hidden h-7 fixed top-2 right-1/2 z-40 bg-blue-100 hover:bg-blue-200 px-4 py-1 rounded-full shadow-sm flex items-center justify-center gap-2 z-0"
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8.65692 9.41494h.01M7.27103 13h.01m7.67737 1.9156h.01M10.9999 17h.01m3.178-10.90671c-.8316.38094-1.8475.22903-2.5322-.45571-.3652-.36522-.5789-.82462-.6409-1.30001-.0574-.44-.0189-.98879.1833-1.39423-1.99351.20001-3.93304 1.06362-5.46025 2.59083-3.51472 3.51472-3.51472 9.21323 0 12.72793 3.51471 3.5147 9.21315 3.5147 12.72795 0 1.5601-1.5602 2.4278-3.5507 2.6028-5.5894-.2108.008-.6725.0223-.8328.0157-.635.0644-1.2926-.1466-1.779-.633-.3566-.3566-.5651-.8051-.6257-1.2692-.0561-.4293.0145-.87193.2117-1.26755-.1159.20735-.2619.40237-.4381.57865-1.0283 1.0282-2.6953 1.0282-3.7235 0-1.0282-1.02824-1.0282-2.69531 0-3.72352.0977-.09777.2013-.18625.3095-.26543" />
                        </svg>

                        <p>Cookies</p>

                    </button>
                )
            }
        </>
    );
};

export default CookieBanner;
