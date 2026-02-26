import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from "../../slices/navigateSlice";
import LoadingCard from "../../components/LoardingSpin";

const PersistLogIn = () => {

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentNav = useSelector((state) => state.navigate.currentNav);
    const navEntries = performance.getEntriesByType("navigation");

    useEffect(

        () => {

            if (navEntries[0].type === "navigate") {

                //console.log("Page was not refreshed");

                return
            }

        }, [navEntries]
    )

    useEffect(() => {

        const checkSession = async () => {

            try {

                const getRefreshToken = await api.post("refresh/");

                if (getRefreshToken?.data?.access_token) {

                    dispatch(setCurrentNav(currentNav));

                    //navigate("/account-home", { replace: true });

                    if (getRefreshToken?.data?.user) dispatch(login(getRefreshToken?.data?.user))
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

    }, [dispatch, isLoading, navigate, currentNav]);

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
