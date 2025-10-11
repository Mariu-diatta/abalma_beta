import React from "react";
import logoApp from "../assets/logoApp.jpg";

const Logo = () => {

    return (

        <>

            <img
                src={logoApp}
                alt="Logo Abalma"
                className="w-30 object-contain transition-transform duration-300 p-1 hover:scale-110 scale-100"  
            />

        </>
    );
};

export default Logo;
