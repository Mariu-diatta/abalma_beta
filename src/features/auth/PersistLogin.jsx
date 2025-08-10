import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from "../../slices/navigateSlice";

const getNewToken = async (refreshToken_) => {

    try {

        const response = await api.post("refresh/", { refresh: refreshToken_ });

        const accessToken = response.data;

        if (accessToken) {

            localStorage.setItem("token", accessToken?.access);

            console.log("REFRESH LE TOKEN POUR UNE RECONNEXION", accessToken)

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

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const currentVavigate = useSelector((state) => state.navigate.currentNav);

    useEffect(() => {

        const verifyRefreshToken = async () => {

            try {

                const refreshToken = localStorage.getItem("refresh");

                if (!refreshToken) return;

                const newTokens = await getNewToken(refreshToken);

                console.log("USER CONNEXEION REFRESH", newTokens?.access)

                if (!newTokens?.access) return;

                const response = await api.get("about/me/");

                console.log("USER CONNEXEION", response?.data)

                dispatch(login(response.data));

                dispatch(setCurrentNav(currentVavigate));

                navigate(`/${currentVavigate}`, {replace:true})

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
