import React from 'react'
import { useTranslation } from 'react-i18next';
import image from '../assets/image.jpg'
import GridLayoutProduct from '../features/GridLayoutProducts';
import Testimonial from '../components/AbalmaActivities';
import TitleCompGen from '../components/TitleComponentGen';


const HomeContain = () => {

    const { t } = useTranslation();

    return (

        <>

            <div className="mx-auto max-w-screen-md text-center lg:mb-2  mt-8 pt-2">

                <TitleCompGen title={t('homePan.title')} />

                <p className="font-light text-gray-500 sm:text-md dark:text-gray-400 w-full  text-center">
                    {t("homePan.content")}
                </p>

            </div>

            <GridLayoutProduct />

            <div className="animate-in m-0 relative pb-6 mt-6 dark:bg-dark lg:pt-[150px] style-bg bg_home shadow-sm rounded-lg -mx-4 flex flex-wrap hidden">


                <div className="w-full px-4 lg:w-5/12">

                    <div className="hero-content">

                        <div className="shadow-sm px-1 animate-trains translate-y-0 transition-all duration-1000 ease-in-out mt-[10px] rounded-md hidden">

                            <h4 className="mb-2  !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[20px] xl:text-2xl mt-6">
                                {t("homePage.headline")}
                            </h4>

                            <p className="mb-8 max-w-[480px] text-sm text-body-color dark:text-dark-6">
                                {t("homePage.subheadline")}
                            </p>

                        </div>

                        <ul className="flex flex-wrap items-center hidden">

                            <li>
                              
                                <button
                                    onClick={()=>alert("L'application sera bientôt disponible")}
                                    className="cursor-pointer inline-flex items-center justify-center px-5 py-3 text-center text-base font-medium text-[#464646] hover:text-primary dark:text-white"
                                >
                                    <span className="mr-2">

                                        <svg
                                            width="24"
                                            height="25"
                                            viewBox="0 0 24 25"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle cx="12" cy="12.6152" r="12" fill="#3758F9" />

                                            <rect
                                                x="7.99893"
                                                y="14.979"
                                                width="8.18182"
                                                height="1.63636"
                                                fill="white"
                                            />

                                            <rect
                                                x="11.2717"
                                                y="7.61523"
                                                width="1.63636"
                                                height="4.09091"
                                                fill="white"
                                            />

                                            <path
                                                d="M12.0898 14.1606L14.9241 11.0925H9.25557L12.0898 14.1606Z"
                                                fill="white"
                                            />

                                        </svg>

                                    </span>

                                    {t("homePage.downloadApp")}

                                </button>

                            </li>

                        </ul>

                    </div>

                </div>


                <div className="hidden px-4 lg:block lg:w-1/12"></div>


                <div className="w-full px-2 lg:w-6/12 sticky top-10 self-start hidden">

                    <div className="lg:ml-auto lg:text-right">

                        <div className="relative z-10 inline-block pt-2 lg:pt-0 mb-[80px]">

                            <h1 className="text-md font-medium text-gray-500 text-center dark:text-white mb-3 var(--color-text)">
                                {t('text_home_picture')}
                            </h1>

                            <img
                                src={image}
                                alt="hero"
                                className=" lg:ml-auto shadow-xl rounded-lg transition-transform duration-300 hover:scale-105 App-logo "
                            />

                        </div>

                    </div>

                </div>

            </div>

            <Testimonial/>
        </>
    );
};


export default HomeContain;


