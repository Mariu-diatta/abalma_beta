import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";
import { CONSTANTS, ENDPOINTS, removeAccents } from "../utils";
import { useTranslation } from 'react-i18next';


const WhiteRoundedButton = ({ titleButton, to }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isRegister = titleButton === t(ENDPOINTS.REGISTER);

    const baseClasses = `
    whitespace-nowrap
    inline-flex items-center justify-center
    rounded-full
    px-4 py-1
    text-[14px]
    font-normal
    transition-all duration-200
    border
  `;

    const defaultClasses = isRegister
        ? `
        bg-gradient-to-br from-purple-50 to-blue-100
        hover:from-purple-100 hover:to-blue-200
        border-gray-200
      `
        : `
        bg-white
        hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-100
        border-t sm:border-b-0 lg:border-b lg:border-t-0
        border-gray-100
      `;

    const activeClasses = `
    bg-[#1B44C8]
    border-[#1B44C8]
    text-white
    shadow-md
  `;

    return (

        <NavLink

            to={`/${to}`}

            className={({ isActive }) =>`
              ${baseClasses}
              ${defaultClasses}
              ${isActive ? activeClasses : "text-gray-700 dark:text-gray-200"}
              dark:bg-dark
            `
            }

            onClick={() => dispatch(setCurrentNav(to))}
        >
            {titleButton}

        </NavLink>
    );
};


export default WhiteRoundedButton;

export const ButtonNavigate = ({ tabs }) => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const currentNav = useSelector(state => state.navigate.currentNav);

    return (

        <section>

            <ul
                className="
                    fixed bottom-0 left-0 w-full flex gap-2  md:rounded-full lg:rounded-full  rounded-none bg-white/80  lg:bg-transparent md:bg-transparent
                    border-0
                    sm:items-center
                    lg:static lg:flex 
                    lg:flex-row 
                    lg:w-auto
                    justify-between
                    dark:bg-dark-2
                    px-4 z-10 
                    mx-0
                 "
            >

            {
                tabs?.map((tab) => (

                        <li key={tab.id} className="w-full sm:w-auto gap-6 px-1 ">

                            {
                                !((
                                    (tab.label === CONSTANTS.ABOUT) ||
                                    (removeAccents(tab.label) === removeAccents(t('about'))) ||
                                    (tab.label === CONSTANTS.BLOGS)) && ((currentNav === ENDPOINTS.LOGIN) ||
                                    (currentNav === ENDPOINTS.REGISTER))) &&

                                <NavLink

                                    to={tab.endPoint}

                                    className={({ isActive }) =>
                                        `
                                            whitespace-nowrap text-center w-full text-center items-center flex flex-col lg:flex-row gap-1 text-[12px] md:text-[14px] rounded-full
                                            px-1 
                                            transition
                                            border-t sm:border-b-0 lg:border-b lg:border-t-0
                                            ${isActive
                                            ? 'border-gray-100 rounded-lg'
                                            : 'border-transparent text-gray-100 dark:text-gray-700 hover:bg-blue-50 dark:hover:bg-dark-3 hover:rounded-full hover:bg-gradient-to-br from-purple-0 to-blue-50 hover:bg-gradient-to-br hover:from-purple-50 '
                                        }
                                        `
                                    }

                                    onClick={() => dispatch(setCurrentNav(tab.id))}
                                >
                                    <>{tab.logo}</>

                                    <>{tab.label}</>

                                </NavLink>
                            }


                    </li>

                    )
                )
            }

            </ul>

        </section>
    );
};


export const ButtonSimple = ({
    title,
    onHandleClick = () => { },
    type = "submit",
    className = "w-auto flex items-center m-auto cursor-pointer rounded-full border border-blue-100 bg-blue-0 px-5 py-2 text-base  text-white-900 transition bg-gradient-to-br from-purple-0 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 px-2 "
}) => {


    return (

        <button
            className={className}
            onClick={onHandleClick}
            type={type}
        >

            {title}

        </button>
    )
}