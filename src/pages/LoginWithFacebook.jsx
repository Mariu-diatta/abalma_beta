import React, { useEffect, useState } from "react";
import api from "../services/Axios";

const FACEBOOK_APP_ID = "1571047877939987";

const sendFacebookTokenToDjango = async (accessToken) => {
    try {
        const { data } = await api.post(
            "/api/auth/facebook/",
            {
                access_token: accessToken,
            }
        );

        console.log("Connexion Django réussie :", data);

    } catch (error) {
        console.error(
            "Erreur Django :",
            error.response?.data || error
        );
    }
};

export default function FacebookLogin() {
    const [facebookReady, setFacebookReady] = useState(false);

    useEffect(() => {
        // Déjà chargé
        if (window.FB) {
            setFacebookReady(true);
            return;
        }

        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: "v23.0",
            });

            setFacebookReady(true);
        };

        const script = document.createElement("script");

        script.src = "https://connect.facebook.net/fr_FR/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";

        document.body.appendChild(script);

        return () => {
            // On ne supprime pas le SDK Facebook
            // car il peut être utilisé ailleurs.
        };
    }, []);

    const loginWithFacebook = () => {
        if (!window.FB) {
            console.error("Facebook SDK non chargé.");
            return;
        }

        window.FB.login(
            (response) => {
                console.log("Réponse Facebook :", response);

                if (!response.authResponse) {
                    console.log("Connexion Facebook annulée.");
                    return;
                }

                const accessToken =
                    response.authResponse.accessToken;

                sendFacebookTokenToDjango(accessToken);
            },
            {
                scope: "public_profile,email",
            }
        );
    };

    return (
        <button
            type="button"
            onClick={loginWithFacebook}
            disabled={!facebookReady}
            className="w-full m-auto border border-gray-200 py-2 md:py-1.5 md:w-full flex items-center justify-center gap-1 rounded-sm bg-blue-50 hover:bg-blue-100 px-1 text-white"
        >
            <span className="font-bold text-xl">f</span>

            <span>
                {facebookReady
                    ? "Continuer avec Facebook"
                    : "Chargement de Facebook..."}
            </span>
        </button>
    );
}