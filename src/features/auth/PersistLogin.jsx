import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";

const getNewToken = async (refreshToken_) => {

    try {

        const response = await api.post("refresh/", { refresh: refreshToken_ });

        const accessToken = response.data;

        if (accessToken) {

            localStorage.setItem("token", accessToken?.access);

            return accessToken;
        }

        return null;

    } catch (error) {

        console.error("Erreur lors du rafraîchissement du token :", error);

        return null;
    }
};

const isRealReload = () => {

    const [entry] = performance.getEntriesByType("navigation");

    return entry?.type === "reload";
};

const PersistLogIn = () => {

    const [isLoading, setIsLoading] = useState(isRealReload());

    const dispatch = useDispatch();

    useEffect(() => {

        const verifyRefreshToken = async () => {

            try {

                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) return;

                const newTokens = await getNewToken(refreshToken);

                if (!newTokens?.access) return;

                const response = await api.get("about/me/");

                dispatch(login(response.data));

            } catch (error) {

                console.error("Échec du rafraîchissement ou de la récupération utilisateur :", error);

            } finally {

                setIsLoading(false);
            }
        };

        if (isRealReload()) {

            verifyRefreshToken();
        }

    }, [dispatch]);

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
