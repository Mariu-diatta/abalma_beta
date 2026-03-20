import React from "react";
import TitleCompGen from "../components/TitleComponentGen";
import { useTranslation } from 'react-i18next';
import { services } from "../utils";

const ServicesSection = () => {

    const { t } = useTranslation();

    return (

        <section className="bg-none translate-y-5 transition-all duration-1000 ease-in-out">

            <div className="py-2 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">

                {/* Header */}
                <div className="m-auto text-center">
                    <TitleCompGen title={t('Services')} />
                </div>

                {/* Grid */}
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0 py-5">

                    {
                        services?.map((service, index) => (

                                <div key={index} className="text-center items-center  bg-white/30 rounded-xl p-5 shadow-sm h-full">

                                    <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-blue-100 m-auto text-2xl">
                                        {service.icon}
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold ">
                                        {t(`${service.key}.title`)}
                                    </h3>

                                    <p className="text-gray-500 "> 
                                        {t(`${service.key}.description`)}
                                    </p>

                                </div>
                            )
                        )
                    }

                </div>

            </div>
        </section>
    );
};

export default ServicesSection;