import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentNav } from '../slices/navigateSlice';
import HomeLayout from '../layouts/HomeLayout';
import image_1 from '../assets/image_1.jpg';
import image_2 from '../assets/image_2.jpg';
import image_3 from '../assets/image_3.jpg';
import HoverImage from '../components/HoverImage';
import TitleCompGen from '../components/TitleComponentGen';

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

    const leftSectionRef = useRef(null);
    const rightSectionRef = useRef(null);

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        'opacity-100',
                        'translate-y-0',
                        'scale-100'
                    );
                    entry.target.classList.remove(
                        'opacity-0',
                        'translate-y-10',
                        'scale-95'
                    );
                }
            });
        }, observerOptions);

        const nodes = [leftSectionRef.current, rightSectionRef.current];
        nodes.forEach((node) => node && observer.observe(node));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="overflow-hidden  pt-6 pb-1 lg:pt-6 lg:pb-3 dark:bg-dark bg-home animate-fade-in">

            <div className="container mx-auto">

                <div className="flex flex-wrap items-start justify-center -mx-4">

                    {/* LEFT SECTION */}
                    <div
                        ref={leftSectionRef}
                        className="py-0 w-full px-4 lg:w-6/12 opacity-0 translate-y-10 transition-all duration-700 ease-in-out"
                    >
                        <div className="flex items-center -mx-3 sm:-mx-4">

                            <div className="w-full px-3 sm:px-4 xl:w-1/2">

                                {[{ img: image_1, text: t('about_image_text') }, { img: image_2, text: t('about_image_text2') }].map((prod, idx) => (
                                    <div key={idx} className="py-3 sm:py-4">
                                        <HoverImage
                                            src={prod?.img}
                                            alt={t(`image_${idx + 1}_alt`)}
                                            text={prod?.text}
                                        />
                                    </div>
                                ))}

                            </div>

                            <div className="w-full px-3 sm:px-4 xl:w-1/2">

                                <div className="relative z-10 my-4">

                                    <HoverImage
                                        src={image_3}
                                        alt={t('image_3_alt')}
                                        text={t('about_image_text1')}
                                    />

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div
                        ref={rightSectionRef}
                        className="w-full text-sm px-4 lg:w-1/2 xl:w-5/12 shadow-sm rounded-lg opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-in-out mt-6 hover:shadow-xl sacle-100 hover:scale-105 "
                    >
                        <div className="lg:mt-0 px-1">
                  
                            <TitleCompGen title={t('title')} />

                            <h2 className="mb-5 text-sm font-medium text-gray-500 dark:text-white sm:text-xl transition-opacity duration-300 ease-in-out">
                                {t('subtitle')}
                            </h2>

                            <p className="mb-5 text-[13px] text-body-color dark:text-dark-6 transition-opacity duration-300 ease-in-out px-1">
                                {t('paragraph1')}
                            </p>

                            <p className="mb-8 text-[13px]  text-body-color dark:text-dark-6 transition-opacity duration-300 ease-in-out">
                                {t('paragraph2')}
                            </p>

                            <button

                                onClick={() => {
                                    navigate('/logIn');
                                    dispatch(setCurrentNav('/logIn'));
                                }}

                                className="inline-flex items-center justify-center py-3 px-7 text-base font-medium text-white rounded-md bg-primary transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:scale-105"
                            >
                                {t('button')}

                            </button>
                        </div>
                    </div>

                </div>

                <div className="py-3 sm:py-2 mb-6 ">

                    <div className="w-full md:w-1/2 mx-auto rounded-2xl shadow-lg overflow-hidden duration-400 scale-100 hover:scale-120">

                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/-T0bnilkHxU" 
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 md:h-96 rounded-2xl shadow-lg transition-transform  ease-in-out hover:shadow-lg"
                        >

                      </iframe>

                    </div>

                </div>

            </div>

        </section>
    );
};
