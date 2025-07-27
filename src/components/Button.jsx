import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";

const WhiteRoundedButton = ({ titleButton, to }) => {

    const dispatch = useDispatch();

    return (

        <NavLink

            to={to}

            className={

                ({ isActive }) =>
                    `shadow-lg m-1 dark:bg-dark  border-gray-[0.1px] border-gray-200 rounded-full inline-flex items-center justify-center py-1 px-2 text-center text-xs transition-all duration-200
                 ${isActive
                        ? 'bg-[#1B44C8] border-[#1B44C8] text-white'
                        : 'bg-primary border-primary text-grey hover:bg-[#1B44C8] hover:border-[#1B44C8]'
                    }`
            }
            onClick={() => dispatch(setCurrentNav(to)) }
        >

            {titleButton}

        </NavLink>
    );
};

export default WhiteRoundedButton;
