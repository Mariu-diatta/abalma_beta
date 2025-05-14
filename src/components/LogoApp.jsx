import logoApp from '../assets/logoApp.jpg';
import React from 'react';

const Logo = () => {
    return (
        <img
            src={logoApp}
            alt="logo"
            className="w-24 sm:w-28 md:w-32 lg:w-30 xl:w-30 dark:hidden"
        />
    );
};

export default Logo;