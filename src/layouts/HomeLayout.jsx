import React from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
//import ScrollTop from '../components/ButtonScroll';

const HomeLayout = ({ children }) => {

    return (

        <>
            <NavbarHeader />

            <main className=" d-flex flex-column items-start justify-between style-bg mx-0 overflow-y-auto h-full scrollbor_hidden pt-[12dvh]" >
                {children}
                <Footer />
            </main>
        </>
    );
};

export default HomeLayout;
