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
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';

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
        <section className="grid lg:grid-cols-2 gap-10 items-center bg-gradient-to-br from-purple-10 to-blue-50 backdrop-blur-xl rounded-3xl shadow-xl p-3 lg:px-10 transition-all duration-500">

            {/* ---------------- LEFT (IMAGES) ---------------- */}
            <div>

                <TitleCompGenLitle title="Bienvenue dans la plateforme abalma!!" />

                <div
                    ref={leftSectionRef}
                    className="grid grid-cols-2 gap-8 opacity-0 translate-y-5 transition-all duration-700"
                >
                    {/* Small images */}
                    <div className="flex flex-col gap-8 justify-between  h-full">
                        <HoverImage src={image_1} text={t('about_image_text')} />
                        <HoverImage src={image_2} text={t('about_image_text2')} />
                    </div>

                    {/* Big image */}
                    <div className="flex items-center">
                        <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-500">
                            <HoverImage src={image_3} text={t('about_image_text1')} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- RIGHT (CONTENT CARD) ---------------- */}
            <div
                ref={rightSectionRef}
                className="bg-white rounded-2xl shadow-lg p-2  opacity-0 translate-y-10 scale-95 transition-all duration-700"
            >
                <div className="flex flex-col gap-5">

                    <TitleCompGen title="Choose Abalma!" />

                    <img
                        src={image_3} alt="pt"
                        className="rouded-md w-auto h-50 object-cover transition-transform duration-500 ease-in-out hover:h-full"
                    />

                    <p
                        className="
                                mb-5 text-sm text-body-color  
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
                        className="mt-4 w-fit px-6 py-3 rounded-full bg-blue-100 text-white font-medium shadow-md hover:scale-105 hover:bg-blue-700 transition-all"
                    >
                        {t('button')}
                    </button>

                </div>
            </div>

        </section>
    );
};
