import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from "../../slices/navigateSlice";
import LoadingCard from "../../components/LoardingSpin";

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


const PersistLogIn = () => {

    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const dispatch = useDispatch();

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

                dispatch(setCurrentNav("/account_home"));

                navigate("/account_home", {replace:true})

            } catch (error) {

                console.error("Échec du rafraîchissement ou de la récupération utilisateur :", error);

            } finally {

                setIsLoading(false);
            }
        };

        if (isLoading) {

            verifyRefreshToken();
        }

    });

    if (isLoading) {

        return (

            <div style={{ textAlign: "center", marginTop: "2rem" }}>

                <LoadingCard/>

            </div>
        );
    }

    return <Outlet />;
};

export default PersistLogIn;
