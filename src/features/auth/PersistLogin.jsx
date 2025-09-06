import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from "../../slices/navigateSlice";
import LoadingCard from "../../components/LoardingSpin";

const PersistLogIn = () => {

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        const checkSession = async () => {

            const perfEntries = performance.getEntriesByType("navigation");

            try {

                if (perfEntries.length > 0 && perfEntries[0].type === "reload") {

                    const response = await api.post("refresh/");

                    dispatch(login(response.data));
                    dispatch(setCurrentNav("/account_home"));
                    navigate("/account_home", { replace: true });
                }
            } catch (error) {
                console.error("Utilisateur non authentifié :", error);
                // Tu peux rediriger vers /login ici si tu veux
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) {
            checkSession();
        }
    }, [dispatch, isLoading, navigate]);

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <LoadingCard />
            </div>
        );
    }

    return <Outlet />;
};

export default PersistLogIn;
