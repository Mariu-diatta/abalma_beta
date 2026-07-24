import React from "react";
import { useDispatch} from "react-redux";
import { NavLink } from "react-router-dom";
import { setCurrentNav } from "../slices/navigateSlice";
import { ENDPOINTS} from "../utils";
import { useTranslation } from 'react-i18next';


const WhiteRoundedButton = ({ titleButton, to, children = null }) => {

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

    const defaultClasses = isRegister? `
        bg-indigo-200  shadow-lg
        hover:from-purple-100 hover:to-indigo-200
        border border-gray-200
        `
        : `
        bg-white shadow-lg
        hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-100
        border-t sm:border-b-0 lg:border-b lg:border-t-0
        border border-gray-100
      `;

    const activeClasses = `
    bg-[#1B44C8]
    border-[#1B44C8]
    text-white
    shadow-md
  `;

    return (
         <>
            <NavLink

                to={`/${to}`}

                className={({ isActive }) =>`
                  ${baseClasses}
                  ${defaultClasses}
                  ${isActive ? activeClasses : "text-gray-700"}
               `
                }

                onClick={() => dispatch(setCurrentNav(to))}
            >
                {titleButton}

            </NavLink>
            {children}
         </>
    );
};

export default WhiteRoundedButton;

export const WhiteRoundedButtonSignInRegister = ({ titleButton,  children = null, onClick = null }) => {

    const { t } = useTranslation();

    const isRegister = titleButton === t(ENDPOINTS.REGISTER);

    // Classes de base plus modernes
    const baseClasses = `
        whitespace-nowrap
        inline-flex items-center justify-center
        rounded-full
        px-6 py-2
        text-[14px]
        font-semibold
        transition-all duration-300
    `;

    // Design plus e-commerce (ombres douces et gradients)
    const defaultClasses = isRegister
        ? `bg-[#6366f1] text-white shadow-lg shadow-indigo-200 hover:bg-[#4f46e5] border-none`
        : `bg-white text-gray-700 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/30`;

    // Rendu conditionnel : si onClick existe, c'est un bouton de modale, sinon c'est un lien
    const renderButton = () => {
            return (
                <button
                    type="button"
                    onClick={onClick}
                    className={`${baseClasses} ${defaultClasses}`}
                >
                    {titleButton}
                </button>
            );
    };

    return (
        <>
            {renderButton()}
            {children}
        </>
    );
};

export const ButtonNavigate = ({ tabs }) => {

    const dispatch = useDispatch();

    return (

        <section className="w-full">

            <ul
                className="
                    w-full flex gap-2  md:rounded-full lg:rounded-full  rounded-none bg-white/80  lg:bg-transparent md:bg-transparent
                    border-0
                    md:static md:flex 
                    md:flex-row 
                    md:w-auto
                    justify-between
                    items-center
                    px-2 z-10 
                    mx-0
                 "
            >

            {
                tabs?.map((tab) => (

                    <li key={tab.id} className={`${tab.id ? "w-full sm:w-auto gap-6 px-1":"hidden md:block"}`}>

                            {
                               
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
                                            : 'border-transparent text-gray-100 dark:text-gray-700 hover:bg-indigo-50 dark:hover:bg-dark-3 hover:rounded-full hover:bg-gradient-to-br from-purple-0 to-indigo-50 hover:bg-gradient-to-br hover:from-purple-50 hover:py-1.5 '
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
    className = "w-auto flex items-center m-auto cursor-pointer rounded-full border border-indigo-100 bg-blue-0 px-5 py-2 text-base  text-white-900 transition bg-gradient-to-br from-purple-0 to-indigo-100 hover:bg-gradient-to-br hover:from-purple-100 px-2 "
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