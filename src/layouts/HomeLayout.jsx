import React from 'react'
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';

const HomeLayout = ({children}) => {

    return (
        <div className="items-center justify-center d-flex flex-coulumn style-bg overflow-x-hidden ">
            <NavbarHeader/>
            <>{children}  </ >
            <Footer/>
        </div>
    );
};

export default HomeLayout;