import React, { useState, useEffect } from "react";

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

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
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>
                Ce site utilise des cookies pour améliorer votre expérience.{" "}
                <a href="/politique-confidentialite" className="underline">
                    En savoir plus
                </a>
            </p>
            <button
                onClick={acceptCookies}
                className="mt-2 md:mt-0 bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded"
            >
                J'accepte
            </button>
        </div>
    );
};

export default CookieBanner;
