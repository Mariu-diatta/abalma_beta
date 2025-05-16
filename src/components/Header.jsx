import React, { useState } from "react";
import Logo from "./LogoApp";
import ListItem from "./ListOfItems";
import WhiteRoundedButton from "./Button";
import { Outlet, NavLink } from 'react-router-dom';

const NavbarHeader = () => {

    const [open, setOpen] = useState(false);

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
                                        } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] bg-blue-500 focus:ring-2 ring-primary lg:hidden`}
                                >
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                                    <span className="relative my-[6px] block h-[2px] w-[30px] bg-white"></span>
                                </button>

                                <nav
                                    id="navbarCollapse"
                                    className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"
                                        } `}
                                >
                                    <ul className="block lg:flex">
                                        <ListItem endPoint ="/">Home</ListItem>
                                        {/*<ListItem endPoint="/Payment">Payment</ListItem>*/}
                                        <ListItem endPoint="/About">About</ListItem>
                                        <ListItem endPoint="/Blog">Blog</ListItem>
                                    </ul>
                                </nav>
                            </div>
                            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                                <NavLink
                                    to="/logIn"
                                    className="px-3 py-3 text-base font-medium text-dark hover:text-primary dark:text-white"
                                >
                                    <WhiteRoundedButton titleButton={"Se connecter"} />

                                </NavLink>

                                <NavLink
                                    to="/Register"
                                    className="rounded-lg bg-primary px-2 py-3 text-dark font-medium text-grey hover:bg-opacity-90"
                                >
                                    <WhiteRoundedButton titleButton={"Creer un compte"} />
           
                                </NavLink>
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
