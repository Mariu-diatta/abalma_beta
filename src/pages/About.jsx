import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentNav } from '../slices/navigateSlice';
import HomeLayout from '../layouts/HomeLayout';
import image_1 from '../assets/image_1.jpg';
import image_2 from '../assets/image_2.jpg';
import image_3 from '../assets/image_3.jpg';
import image_4 from '../assets/image_4.jpg';


const About = () => {
    return (
        <HomeLayout>
            <AboutContainer />
        </HomeLayout>
    );
};

export default About;

const AboutContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Refs for scroll animation
    const leftSectionRef = useRef(null);
    const rightSectionRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2, // Trigger when 20% of the element is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                    entry.target.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
                }
            });
        }, observerOptions);

        if (leftSectionRef.current) observer.observe(leftSectionRef.current);
        if (rightSectionRef.current) observer.observe(rightSectionRef.current);

        return () => {
            if (leftSectionRef.current) observer.unobserve(leftSectionRef.current);
            if (rightSectionRef.current) observer.unobserve(rightSectionRef.current);
        };
    }, []);

    return (
        <section className="overflow-hidden pt-1 pb-12 lg:pt-[120px] lg:pb-[90px] dark:bg-dark bg-home animate-fade-in">

            <div className="container mx-auto">

                <div className="flex flex-wrap items-center justify-between -mx-4">

                    <div
                        ref={leftSectionRef}
                        className="w-full px-4 lg:w-6/12 opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-in-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100"
                    >
                        <div className="flex items-center -mx-3 sm:-mx-4">

                            <div className="w-full px-3 sm:px-4 xl:w-1/2">

                                <div className="py-3 sm:py-4">
                                    <img
                                        src={image_1}
                                        alt={t('image_1_alt', 'Illustration of Abalma platform')}
                                        className="w-full rounded-2xl shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transform-none"
                                    />
                                </div>

                                <div className="py-3 sm:py-4">

                                    <img
                                        src={image_2}
                                        alt={t('image_2_alt', 'E-commerce growth visual')}
                                        className="w-full rounded-2xl shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transform-none"
                                    />

                                </div>
                            </div>

                            <div className="w-full px-3 sm:px-4 xl:w-1/2">

                                <div className="relative z-10 my-4">

                                    <img
                                        src={image_3}
                                        alt={t('image_3_alt', 'Abalma service showcase')}
                                        className="w-full rounded-2xl shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transform-none"
                                    />

                                </div>

                            </div>

                        </div>
                    </div>

                    <div
                        ref={rightSectionRef}
                        className="w-full px-4 lg:w-1/2 xl:w-5/12 shadow-lg rounded-md opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-in-out hover:shadow-xl motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 mt-6"
                    >
                        <div className="mt-10 lg:mt-0">
                            <span className="block mb-4 text-3xl font-semibold text-primary transition-opacity duration-300 ease-in-out hover:opacity-90">
                                {t('title')}
                            </span>
                            <h2 className="mb-5 text-lg font-medium text-dark dark:text-white sm:text-xl transition-opacity duration-300 ease-in-out">
                                {t('subtitle')}
                            </h2>
                            <p className="mb-5 text-base text-body-color dark:text-dark-6 transition-opacity duration-300 ease-in-out">
                                {t('paragraph1')}
                            </p>
                            <p className="mb-8 text-base text-body-color dark:text-dark-6 transition-opacity duration-300 ease-in-out">
                                {t('paragraph2')}
                            </p>
                            <button
                                onClick={() => {
                                    navigate('/logIn');
                                    dispatch(setCurrentNav('logIn'));
                                }}
                                className="inline-flex items-center justify-center py-3 px-7 text-base font-medium text-white border border-transparent rounded-md bg-primary transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:scale-105 motion-reduce:transform-none"
                            >
                                {t('button')}
                            </button>
                        </div>
                        <div className="py-3 sm:py-4">
                            <img
                                src={image_4}
                                alt={t('image_2_alt', 'E-commerce growth visual')}
                                className="w-full rounded-2xl shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 motion-reduce:transform-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};