import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../services/Axios";
import { login, updateCompteUser } from "../../slices/authSlice";
import LoadingCard from "../../components/LoardingSpin";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const PersistLogIn = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await api.get("/me/")               
                dispatch(login(res.data.client));
                dispatch(updateCompteUser(res?.data?.compte));
            } catch (err) {
                console.log("Not authenticated");
            } finally {
                setLoading(false);
            }
        };

        loadUser();

    }, [dispatch, navigate]);

    if (loading) {
        return <LoadingCard />;
    }

    return <Outlet />;
};

export default PersistLogIn;