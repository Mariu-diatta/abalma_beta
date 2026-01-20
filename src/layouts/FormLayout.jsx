import React from "react";
import AttentionAlertMessage from "../components/AlertMessage";
import { Outlet } from "react-router-dom";
import HomeLayout from "./HomeLayout";
import ScrollTop from "../components/ButtonScroll";

const FormLayout = ({ children }) => {

    return (

        <HomeLayout>

            <ScrollTop />

            <section className="bg-gray-1 py-5 dark:bg-dark lg:py-[120px] bg_home px-2">

                <div className="container mx-auto">

                    <div className="flex flex-wrap text-center">

                        <div className="w-full">

                            <div
                                className="
                                  relative mx-auto max-w-[525px] overflow-hidden
                                  rounded-xl
                                  bg-white px-3 py-2 text-center
                                  sm:px-12 md:px-[60px] lg:px-10
                                  dark:bg-dark-2
                                  shadow-xl shadow-black/10
                                  hover:shadow-2xl hover:shadow-black/20
                                  transition-shadow duration-300
                                "
                                style={{
                                    backgroundColor: "var(--color-bg)",
                                    color: "var(--color-text)",
                                }}
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
