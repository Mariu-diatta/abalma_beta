import React from 'react'
import NavbarHeader from '../components/Header';
import Home from '../components/Home';

const HomeLayout = ({children}) => {

    return (
        <container className="d-flex flex-coulumn">
            <NavbarHeader />
            <>{ children }  </ >
        </container>
    );
};

export default HomeLayout;