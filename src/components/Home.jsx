import React from 'react'
import SingleImage from '../components/Image';

const HomeContain = () => {

    return (
        <>

            <div className="m-5 relative pb-[110px] pt-[120px] dark:bg-dark lg:pt-[150px] style-bg">

                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 lg:w-5/12">
                            <div className="hero-content">
                                <h4 className="mb-5 text-4xl font-bold !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                                    Faites passer vos biens au premier plan.
                                </h4>
                                <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                                    Donnez une seconde vie a vos biens (matériels, vêtements, jouets, ...) grâce a Abalma.
                                </p>
                                <ul className="flex flex-wrap items-center">
                                    <li>
                                        <a
                                            href="/#"
                                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white hover:bg-blue-dark lg:px-7"
                                        >
                                            Get Started
                                        </a>
                                    </li>
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
                                            Download App
                                        </button>
                                    </li>
                                </ul>
                                <div className="clients pt-16">
                                    <h6 className="mb-6 flex items-center text-xs font-normal text-body-color dark:text-dark-6">
                                        Ils nous font confiance
                                        <span className="ml-3 inline-block h-px w-8 bg-body-color"></span>
                                    </h6>

                                    <div className="flex items-center space-x-4">
                                        <SingleImage
                                            href="#"
                                            imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/ayroui.svg"
                                        />

                                        <SingleImage
                                            href="#"
                                            imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/graygrids.svg"
                                        />

                                        <SingleImage
                                            href="#"
                                            imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/uideck.svg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden px-4 lg:block lg:w-1/12"></div>
                        <div className="w-full px-4 lg:w-6/12">
                            <div className="lg:ml-auto lg:text-right">
                                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                                    <img
                                        src="https://cdn.tailgrids.com/assets/images/marketing/hero/hero-image-01.png"
                                        alt="hero"
                                        className="max-w-full lg:ml-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};


export default HomeContain;