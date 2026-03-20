import React from "react";
import AttentionAlertMessage from "../components/AlertMessage";
import { Outlet } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import ScrollTop from "../components/ButtonScroll";

const FormLayout = ({ children }) => {

    return (

        <HomeLayout>

            <ScrollTop />

            <section className="bg-gray-1 px-2">

                <div className="container mx-auto">

                    <div className="flex flex-wrap justify-center text-center">

                        <div className="w-full max-w-[525px]">

                            <div
                                className="
                                    relative overflow-hidden rounded-xl
                                    px-4 sm:px-10 md:px-14 lg:px-10
                                    backdrop-blur-md bg-white/80 
                                    shadow-xl shadow-black/10
                                    hover:shadow-2xl hover:shadow-black/20
                                    transition-all duration-300
                                "
                            >
                                {children}

                            </div>

                        </div>

                    </div>

                </div>

                <Outlet />

            </section>

            <AttentionAlertMessage />

        </HomeLayout>
    );
};

export default FormLayout;
