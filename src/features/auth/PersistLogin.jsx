import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import { setCurrentNav } from "../../slices/navigateSlice";
import api from "../../services/Axios";

/**
 * Vérifie si la navigation est un rechargement de page (F5)
 */
const isRealReload = () => {
    const [entry] = performance.getEntriesByType("navigation");
    return entry?.type === "reload";
};

/**
 * Appelle l'API pour rafraîchir le token
 */
const getNewToken = async (refreshToken) => {
    try {
        const { data } = await api.post("refresh/", { refresh: refreshToken });
        if (data?.access) {
            localStorage.setItem("token", data.access);
            console.log("REFRESH TOKEN OK :", data);
            return data;
        }
        return null;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        return null;
    }
};

const PersistLogIn = () => {
    const [isLoading, setIsLoading] = useState(isRealReload());
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const verifyRefreshToken = useCallback(async () => {

        try {
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                console.warn("Aucun refresh token trouvé.");
                return;
            }

            const newTokens = await getNewToken(refreshToken);
            if (!newTokens?.access) {
                console.warn("Refresh token invalide ou expiré.");
                return;
            }

            const { data: user } = await api.get("about/me/");
            dispatch(login(user));
            dispatch(setCurrentNav("/account_home"));

            navigate("/account_home", { replace: true });

        } catch (error) {
            console.error("Échec du rafraîchissement ou récupération utilisateur :", error);

        } finally {
            setIsLoading(false);
        }
    }, [dispatch, navigate]);

    useEffect(() => {

        if (isRealReload()) {

            verifyRefreshToken();
        }

    }, [verifyRefreshToken]);

    if (isLoading) {

        return (

            <div style={{ textAlign: "center", marginTop: "2rem" }}>

                <p>Chargement...</p>

            </div>
        );
    }

    return <Outlet />;
};

export default PersistLogIn;
