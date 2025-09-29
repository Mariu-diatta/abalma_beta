import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 text-white p-4 z-50 flex flex-col md:flex-row justify-between items-center text-sm ">

            <p>
                {t("cookie_banner.text1")}.{" "}
                <a href="/politique-confidentialite" className="underline">
                    {t("cookie_banner.text2")}
                </a>
            </p>

            <p className="text-sm dark:text-gray-400 mb-1  text-grey">
                &copy; 2025 <strong>Abalma</strong> {t("footer_toutDroit")}
            </p>

            <button
                onClick={acceptCookies}
                className="mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-full"
            >
                {t("cookie_banner.text3")}
            </button>
        </div>
    );
};

export default CookieBanner;
