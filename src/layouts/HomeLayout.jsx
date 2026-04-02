import React from 'react';
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';
import ScrollTop from '../components/ButtonScroll';

const HomeLayout = ({ children }) => {

    return (

        <main className=" d-flex flex-column items-start justify-between style-bg mx-0 overflow-y-auto h-full scrollbor_hidden" >

            <NavbarHeader />

            <ScrollTop />

            <section className="mt-[5dvh]"> 

                {children}

                <Footer />

            </section>

        </main>
    );
};

export default HomeLayout;
