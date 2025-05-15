import React from 'react'
import NavbarHeader from '../components/Header';
import Footer from '../pages/Footer';

const HomeLayout = ({children}) => {

    return (
        <container className="d-flex flex-coulumn">
            <NavbarHeader />
            <>{children}  </ >
            <Footer/>
        </container>
    );
};

export default HomeLayout;