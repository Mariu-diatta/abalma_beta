import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";
import { CONSTANTS, ENDPOINTS, removeAccents } from "../utils";
import { useTranslation } from 'react-i18next';


const WhiteRoundedButton = ({ titleButton, to }) => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (

        <NavLink

            to={`/${to}`}

            className={

                ({ isActive }) =>
                    `whitespace-nowrap text-center dark:bg-dark  ${titleButton === t(ENDPOINTS.REGISTER) ? "border border-gray-[0.1px] bg-gradient-to-br from-purple-50 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 " :"border-t sm:border-b-0 lg:border-b lg:border-t-0 hover:bg-gradient-to-br from-purple-50 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 "} border-gray-100 rounded-full inline-flex items-center justify-center px-3 py-1 text-center text-[14px] transition-all duration-200
                 ${isActive
                        ? 'bg-[#1B44C8] border-[#1B44C8] text-white'
                        : 'bg-primary border-primary text-grey hover:bg-blue-50'
                    }`
            }

            onClick={() => dispatch(setCurrentNav(to)) }
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

        <ul
            className="
                fixed bottom-0 left-0 w-full flex gap-2
                border-0
                sm:items-center
                lg:static lg:flex 
                lg:flex-row 
                lg:w-auto
                lg:justify-between
                dark:bg-dark-2
                px-4 z-10 
                mx-1
             "
            style={
                {

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }
            }
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
    );
};


export const ButtonSimple = ({
    title,
    onHandleClick = () => { },
    type = "submit",
    className = "w-auto flex items-center m-auto cursor-pointer rounded-md border border-blue-100 bg-blue-0 px-5 py-2 text-base  text-white-900 transition bg-gradient-to-br from-purple-0 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 px-2 rounded-lg"
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