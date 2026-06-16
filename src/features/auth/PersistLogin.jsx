import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../slices/authSlice";
import api from "../../services/Axios";
import LoadingCard from "../../components/LoardingSpin";

const PersistLogIn = () => {
    localStorage.clear()
    sessionStorage.clear()
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        let isMounted = true;

        const refreshSession = async () => {
            try {
                // 🔥 si déjà connecté → on skip l'appel API
                if (user) {
                    setLoading(false);
                    return;
                }

                const res = await api.post("refresh/");

                if (res?.data?.access_token && res?.data?.user) {
                    dispatch(login(res.data.user));
                }

            } catch (err) {
                console.log("No active session");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        refreshSession();

        return () => {
            isMounted = false;
        };
    }, [dispatch, user]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <LoadingCard />
            </div>
        );
    }

    return <Outlet />;
};

export default PersistLogIn;