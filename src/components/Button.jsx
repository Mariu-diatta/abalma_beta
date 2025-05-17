import React from "react";
import { NavLink } from "react-router-dom";

const WhiteRoundedButton = ({ titleButton, to }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `mb-2 border rounded-full inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium transition-all duration-200
         ${isActive
                    ? 'bg-[#1B44C8] border-[#1B44C8] text-white'
                    : 'bg-primary border-primary text-grey hover:bg-[#1B44C8] hover:border-[#1B44C8]'
                }`
            }
        >
            {titleButton}
        </NavLink>
    );
};

export default WhiteRoundedButton;
