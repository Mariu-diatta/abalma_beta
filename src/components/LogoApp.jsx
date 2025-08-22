import React from "react";
import logoApp from "../assets/logoApp.jpg";

const Logo = () => {

    return (

        <div
          className="flex items-center space-x-3"
        >

            <img
                src={logoApp}
                alt="Logo Abalma"
                className="w-17 h-17 sm:w-25 sm:h-10 object-contain transition-transform duration-300 p-1"  
            />

        </div>
    );
};

export default Logo;
