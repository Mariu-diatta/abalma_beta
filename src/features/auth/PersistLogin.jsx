import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";

const getNewToken = async (refreshToken) => {

    try {

        const response = await api.post("refresh/", { refresh: refreshToken });

        const { access, refresh } = response.data;

        if (access && refresh) {
            localStorage.setItem("token", access);
            localStorage.setItem("refresh", refresh);
            return { access, refresh };
        }

        return null;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token :", error);
        throw error;
    }
};

const PersistLogIn = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const refreshToken = localStorage.getItem("refresh");
                const userData = localStorage.getItem("config");

                if (!refreshToken) {
                    console.warn("Aucun refresh token trouvé.");
                    return;
                }

                const newTokens = await getNewToken(refreshToken);

                if (newTokens && userData) {
                    dispatch(login(JSON.parse(userData))); // Si config est une string JSON
                    console.log("Token rafraîchi avec succès");
                }
            } catch (error) {
                console.error("Échec du rafraîchissement du token :", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Vérifier uniquement si l'utilisateur a un refresh token
        if (localStorage.getItem("refresh")) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
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
