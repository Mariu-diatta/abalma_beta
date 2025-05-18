import React, { useState } from "react";
import Logo from "./LogoApp";
import WhiteRoundedButton from "./Button";
import { Outlet, NavLink } from 'react-router-dom';

const NavbarHeader = () => {

    const [open, setOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('home');

    const tabs = [
        { id: 'home', label: 'Home', endPoint: '/' },
        { id: 'about', label: 'About', endPoint: '/About' },
        { id: 'blog', label: 'Blog', endPoint: '/Blog' },
    ];

    return (

         <>
            <header className={` absolute left-0 right-0 top-2  z-20 flex w-full items-center justify-between `}>
                <div className="container">
                    <div className="relative -mx-4 flex items-center justify-between">
                        <div className="w-50 max-w-full px-6">
                            <a href="/#" className="block w-full py-2">
                                <Logo/>
                            </a>
                        </div>
                        <div className="flex w-full items-center justify-between px-4">
                            <div>
                                <button
                                    onClick={() => setOpen(!open)}
                                    id="navbarToggler"
                                    className={`${open && "navbarTogglerActive"
                                        } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] bg-white-500 focus:ring-0 ring-primary lg:hidden  focus:bg-gray-200`}
                                >
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-grey border-1"></span>
                                </button>

                                <nav
                                    id="navbarCollapse"
                                    className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"
                                        } `}
                                >
                                    <ul className="block lg:flex">
                                        <ul className="lg:flex md:block">
                                            {tabs.map((tab) => (
                                                <li className="me-2" key={tab.id} role="presentation">
                                                    <NavLink
                                                        to={tab.endPoint}
                                                        className={({ isActive }) =>
                                                            `inline-block p-2 border-b-2 rounded-t-lg ${isActive
                                                                ? 'text-purple-600 border-purple-600 dark:text-purple-500 dark:border-purple-500'
                                                                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                                            } flex text-base font-medium text-dark dark:text-white lg:ml-10 lg:inline-flex`
                                                        }
                                                        role="tab"
                                                    >
                                                        {tab.label}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </ul>
                                    <div className="lg:hidden md:hidden justify-end pr-16 sm:flex lg:pr-0 gap-2">
                                        {/*<NavLink*/}
                                        {/*    to="/logIn"*/}
                                        {/*    className="px-3 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"*/}
                                        {/*>*/}
                                        <WhiteRoundedButton titleButton={"Se connecter"} to="/logIn" />

                                        {/*</NavLink>*/}

                                        {/*<NavLink*/}
                                        {/*    to="/Register"*/}
                                        {/*    className="rounded-lg bg-primary px-2 py-3 text-dark font-medium text-grey hover:bg-opacity-90"*/}
                                        {/*>*/}
                                        <WhiteRoundedButton titleButton={"Creer un compte"} to="/Register" />

                                        {/*</NavLink>*/}
                                    </div>
                                </nav>
                            </div>
                            <div className="hidden  justify-end pr-16 sm:flex lg:pr-0 gap-2">
                                {/*<NavLink*/}
                                {/*    to="/logIn"*/}
                                {/*    className="px-3 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"*/}
                                {/*>*/}
                                    <WhiteRoundedButton titleButton={"Se connecter"} to="/logIn" />

                                {/*</NavLink>*/}

                                {/*<NavLink*/}
                                {/*    to="/Register"*/}
                                {/*    className="rounded-lg bg-primary px-2 py-3 text-dark font-medium text-grey hover:bg-opacity-90"*/}
                                {/*>*/}
                                    <WhiteRoundedButton titleButton={"Creer un compte"} to="/Register" />
           
                                {/*</NavLink>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    );
};

export default NavbarHeader;



