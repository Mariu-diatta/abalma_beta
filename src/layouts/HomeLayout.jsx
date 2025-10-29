import React, { useEffect} from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import ScrollTop, { ButtonScrollTopDown } from '../components/ButtonScroll';

const HomeLayout = ({ children }) => {

    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {

        if (currentUser) {

            dispatch(setCurrentNav('account-home'));
        }

    }, [currentUser, dispatch]);

    if (currentUser) {

        return <Navigate to="/account-home" replace />;
    }

    return (

        <div className=" d-flex flex-column items-start justify-between style-bg mx-1 mb-[30px]" >

            <NavbarHeader />

            <div className="mt-[20px]">

                <ScrollTop />

                <ButtonScrollTopDown>
                    {children}
                </ButtonScrollTopDown>

                <Footer />

            </div>

        </div>
    );
};

export default HomeLayout;
