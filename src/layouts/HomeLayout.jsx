import React, { useEffect } from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';

const HomeLayout = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.user);
    const currentCompteUser = useSelector((state) => state.auth.compteUser);

    useEffect(

        () => {
            if (currentUser && currentCompteUser) { navigate("/account_home", { replace: true }); dispatch(setCurrentNav("account_home")) }
        }
    )
    return (

        <div

            className="items-start justify-center d-flex flex-coulumn style-bg  mr-1 ms-1 mb-5"

            style={

                {
                    marginBottom:"30px"
                }
            }
        >
            <NavbarHeader />

            <>{children}  </ >

            <Footer />

        </div>
    );
};

export default HomeLayout;