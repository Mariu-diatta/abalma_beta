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
                className="w-30 h-auto sm:w-30 sm:h-auto  object-contain transition-transform duration-300 p-1 hover:scale-110 scale-100"  
            />

        </div>
    );
};

export default Logo;
