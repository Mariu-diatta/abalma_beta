import React from 'react'
import NavbarHeader from '../components/Header';
import Footer from '../pages/Footer';

const HomeLayout = ({children}) => {

    return (
        <div className="d-flex flex-coulumn">
            <NavbarHeader />
            <>{children}  </ >
            <Footer/>
        </div>
    );
};

export default HomeLayout;