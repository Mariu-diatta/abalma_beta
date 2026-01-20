import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setCurrentNav } from '../slices/navigateSlice';
import HomeLayout from '../layouts/HomeLayout';
import { ENDPOINTS } from '../utils';

import image_1 from '../assets/image_1.jpg';
import image_2 from '../assets/image_2.jpg';
import image_3 from '../assets/image_3.jpg';

import HoverImage from '../components/HoverImage';
import TitleCompGen from '../components/TitleComponentGen';

/* -------------------------------------------------------------------------- */
/*                             PAGE ENTRY WRAPPER                             */
/* -------------------------------------------------------------------------- */

const About = () => (
    <HomeLayout>
        <AboutContainer />
    </HomeLayout>
);

export default About;

/* -------------------------------------------------------------------------- */
/*                               ABOUT CONTENT                                */
/* -------------------------------------------------------------------------- */

const AboutContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const leftSectionRef = useRef(null);
    const rightSectionRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.dataset.visible = "true";
                }
            },
            { threshold: 0.3 }
        );

        if (rightSectionRef.current) {
            observer.observe(rightSectionRef.current);
        }

        return () => observer.disconnect();
    }, []);


    /* --------------------------- ANIM ON SCROLL ---------------------------- */
    useEffect(() => {
        const options = { threshold: 0.2 };
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
        }, options);

        const observedNodes = [leftSectionRef.current, rightSectionRef.current];
        observedNodes.forEach((node) => node && observer.observe(node));

        return () => observer.disconnect();
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                               RENDER PAGE                               */
    /* ---------------------------------------------------------------------- */

    return (
        <main className="overflow-hidden pt-6 pb-3 lg:pt-6 lg:pb-4 dark:bg-dark bg-home animate-fade-in">

            <div className="container mx-auto">

                {/* ================================================================
                   SECTION 1 : IMAGES + TEXTE DE PRÉSENTATION
                ================================================================= */}
                <section className="flex flex-wrap items-start justify-between">

                    {/* --------------------------- LEFT IMAGES --------------------------- */}
                    <div
                        ref={leftSectionRef}
                        className="w-full lg:w-6/12 px-4 py-0 opacity-0 translate-y-10 transition-all duration-700 ease-in-out"
                    >
                        <div className="flex items-center -mx-3 sm:-mx-4">

                            {/* Left column images */}
                            <div className="w-full px-3 sm:px-4 xl:w-1/2 ">

                                {
                                    [
                                        { img: image_1, text: t('about_image_text') },
                                        { img: image_2, text: t('about_image_text2') }
                                    ].map((prod, idx) => (

                                        <div key={idx} className="py-3 sm:py-4">

                                            <HoverImage
                                                src={prod.img}
                                                alt={t(`image_${idx + 1}_alt`)}
                                                text={prod.text}
                                            />

                                        </div>
                                    ))
                                }

                            </div>

                            {/* Right main image */}
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

                    {/* ----------------------- RIGHT CONTENT (TEXT) ---------------------- */}
                    <section
                        ref={rightSectionRef}
                        className="
                            w-full lg:w-1/2 xl:w-5/12 text-sm px-4 mt-6 rounded-lg
                            opacity-0 translate-y-10 scale-95
                            transition-all duration-700 ease-out
                            will-change-transform
                            data-[visible=true]:opacity-100
                            data-[visible=true]:translate-y-0
                            data-[visible=true]:scale-100
                            hover:shadow-xl
                        "
                    >
                        <div className="px-1 flex-col gap-5">

                            <TitleCompGen title={t('title_policy')} />

                            <h2 className="mb-5 text-md sm:text-xl font-medium text-gray-500 dark:text-white">
                                {t('subtitle')}
                            </h2>

                            <p
                                className="
                                    mb-5 text-sm md:text-base text-body-color dark:text-dark-6 
                                    px-1 leading-relaxed whitespace-pre-line max-w-3xl overflow-x-auto scrollbor_hidden
                                "
                            >
                                {t('paragraph')}
                            </p>

                            <button
                                onClick={() => {
                                    navigate(`/${ENDPOINTS.LOGIN}`);
                                    dispatch(setCurrentNav(ENDPOINTS.LOGIN));
                                }}
                                className="cursor-pointer  items-center justify-center py-3 px-7 text-base font-medium text-white bg-primary rounded-full p-2 transition-all duration-300 hover:bg-opacity-90 hover:scale-95"
                            >
                                {t('button')}
                            </button>

                        </div>
                    </section>

                </section>

                {/* ================================================================
                   SECTION 2 : VIDÉO YOUTUBE
                ================================================================= */}
                <section className="py-3 sm:py-2 mb-6">
                    <div className="w-full md:w-1/2 mx-auto rounded-2xl shadow-lg overflow-hidden duration-400 hover:scale-105">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/-T0bnilkHxU"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-64 md:h-96 rounded-2xl shadow-lg"
                        ></iframe>
                    </div>
                </section>

                {/* FUTURE ASIDE SECTION (optionnel)
                <aside>
                    <div>Recommandations, promotions, etc.</div>
                </aside>
                */}

            </div>

        </main>
    );
};
