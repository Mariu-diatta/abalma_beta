import React from 'react'
import Footer from '../pages/Footer';
import NavbarHeader from '../pages/Header';

const HomeLayout = ({children}) => {

    return (

        <div

            className="items-center justify-center d-flex flex-coulumn style-bg overflow-x-hidden mr-1 ms-1 mb-5"

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