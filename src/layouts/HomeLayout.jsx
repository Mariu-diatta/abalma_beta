import React, { useEffect} from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { setCurrentNav } from '../slices/navigateSlice';
import ScrollTop from '../components/ButtonScroll';
import { ENDPOINTS } from '../utils';

const HomeLayout = ({ children }) => {

    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {

        if (currentUser) {

            dispatch(setCurrentNav(ENDPOINTS.ACCOUNT_HOME));
        }

    }, [currentUser, dispatch]);

    useEffect(

        () => {

            if (currentUser) {

                <Navigate to={`/${ENDPOINTS.ACCOUNT_HOME}`} replace />;
            }

        }, [currentUser]
    )

    return (

        <main className=" d-flex flex-column items-start justify-between style-bg mx-0 mb-[30dvh]" >

            <NavbarHeader />

            <ScrollTop />

            <section className="mt-[5dvh]"> 

                {/*<ButtonScrollTopDown>*/}

                    {children}

                {/*</ButtonScrollTopDown>*/}

                <Footer />

            </section>

        </main>
    );
};

export default HomeLayout;
