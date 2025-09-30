import React, { useEffect, useState } from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import ScrollTop, { ButtonScrollTopDown } from '../components/ButtonScroll';

const HomeLayout = ({ children }) => {

    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.user);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        if (currentUser) {

            dispatch(setCurrentNav('account-home'));

            setIsConnected(true);
        }

    }, [currentUser, dispatch]);

    if (isConnected) {

        return <Navigate to="/account-home" replace />;
    }

    return (

        <div

            className=" d-flex flex-column items-start justify-between style-bg mx-1 mb-5"

            style={
                { marginBottom: '30px' }
            }
        >
        

            <NavbarHeader />

            <ScrollTop />

            <ButtonScrollTopDown>
                {children}
            </ButtonScrollTopDown>

            <Footer />

        </div>
    );
};

export default HomeLayout;
