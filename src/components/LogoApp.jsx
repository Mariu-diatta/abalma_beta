import logoApp from '../assets/logoApp.jpg';
import React from 'react';

const Logo = () => {
    return (
        <img
            src={logoApp}
            alt="logo"
            className="w-20 y-10 sm:w-28 md:w-32 lg:w-20 xl:w-20 dark:hidden"
        />
    );
};

export default Logo;