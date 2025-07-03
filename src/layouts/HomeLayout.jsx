import React from 'react'
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';

const HomeLayout = ({children}) => {

    return (
        <div className="d-flex flex-coulumn style-bg">
            <NavbarHeader/>
            <>{children}  </ >
            <Footer/>
        </div>
    );
};

export default HomeLayout;