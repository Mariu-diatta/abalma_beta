import React from "react";
import AttentionAlertMessage from "../components/AlertMessage";
import { Outlet} from 'react-router-dom';
import HomeLayout from "./HomeLayout";
import ScrollTop from "../components/ButtonScroll";


const FormLayout = ({ children }) => {

    return (

        <HomeLayout>

            <section className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px] bg_home px-2">


                <div className="container mx-auto">

                    <div className="flex flex-wrap text-center">

                        <div className="w-full">

                            <div

                                className="shadow-lg relative mx-auto max-w-[525px] overflow-hidden rounded-lg bg-white px-3 lg:px-10  py-4 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"

                                style={
                                    {
                                        backgroundColor: "var(--color-bg)",
                                        color: "var(--color-text)"
                                    }
                                }
                            >
                               <ScrollTop/>
                            
                               {children}

                            </div>

                        </div>

                    </div>

                </div>

                <Outlet/>

            </section>

            <AttentionAlertMessage />

        </HomeLayout>
    )
}

export default FormLayout;