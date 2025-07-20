import React from 'react'
import HomeLayout from '../layouts/HomeLayout';
import { useTranslation } from 'react-i18next';



const About = () => {
    return (
        <HomeLayout>
            < AboutContainer />
        </HomeLayout>
    )
}

export default About;


const AboutContainer = () => {

    const { t } = useTranslation();


    return (

        <>
            <section className="style-bg overflow-hidden pt-20 pb-12 lg:pt-[120px] lg:pb-[90px]  dark:bg-dark style-bg">

                <div className="container mx-auto style-bg">

                    <div className="flex flex-wrap items-center justify-between -mx-4 style-bg">

                        <div className="w-full px-4 lg:w-6/12">

                            <div className="flex items-center -mx-3 sm:-mx-4 style-bg">

                                <div className="w-full px-3 sm:px-4 xl:w-1/2 style-bg">

                                    <div className="py-3 sm:py-4">

                                        <img
                                            src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-1.jpg"
                                            alt=""
                                            className="w-full rounded-2xl shadow-sm"
                                        />

                                    </div>

                                    <div className="py-3 sm:py-4">

                                        <img
                                            src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-2.jpg"
                                            alt=""
                                            className="w-full rounded-2xl shadow-sm"
                                        />

                                    </div>

                                </div>

                                <div className="w-full px-3 sm:px-4 xl:w-1/2 style-bg">

                                    <div className="relative z-10 my-4 style-bg">

                                        <img
                                            src="https://cdn.tailgrids.com/assets/images/marketing/about/about-01/image-3.jpg"
                                            alt=""
                                            className="w-full rounded-2xl shadow-sm"
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="w-full px-4 lg:w-1/2 xl:w-5/12 style-bg shadow-lg text-sm">
                            <div className="mt-10 lg:mt-0">
                                <span className="block mb-4 text-lg font-semibold text-primary ">
                                    {t("title")}
                                </span>
                                <h2 className="mb-5 text-3xl font-bold text-dark dark:text-white sm:text-[40px]/[48px]">
                                    {t('subtitle')}
                                </h2>
                                <p className="mb-5 text-base text-body-color dark:text-dark-6 text-md">
                                    {t('paragraph1')}
                                </p>
                                <p className="mb-8 text-base text-body-color dark:text-dark-6 text-md">
                                    {t('paragraph2')}
                                </p>
                                <a
                                    href="/login"
                                    className="inline-flex items-center justify-center py-3 text-base font-medium text-center text-white border border-transparent rounded-md px-7 bg-primary hover:bg-opacity-90"
                                >
                                    {t('button')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

