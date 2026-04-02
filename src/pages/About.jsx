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

/* ---------------- PAGE WRAPPER ---------------- */
const About = () => (
    <HomeLayout>
        <AboutContainer />
    </HomeLayout>
);

export default About;

/* ---------------- HOOK ANIMATION ---------------- */
const useRevealOnScroll = (refs) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove(
                            'opacity-0',
                            'translate-y-10',
                            'scale-95'
                        );
                        entry.target.classList.add(
                            'opacity-100',
                            'translate-y-0',
                            'scale-100'
                        );
                        observer.unobserve(entry.target); // 🔥 perf
                    }
                });
            },
            { threshold: 0.2 }
        );

        refs.forEach((ref) => ref.current && observer.observe(ref.current));

        return () => observer.disconnect();
    }, [refs]);
};

/* ---------------- CONTENT ---------------- */
const AboutContainer = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const leftRef = useRef(null);
    const rightRef = useRef(null);

    useRevealOnScroll([leftRef, rightRef]);

    return (
        <section className="overflow-y-auto h-full grid lg:grid-cols-2 gap-10 items-center bg-gradient-to-br from-purple-10 to-blue-50 backdrop-blur-xl p-3 lg:px-10 transition-all duration-500">

            {/* LEFT */}
            <div ref={leftRef} className="grid grid-cols-2 gap-8 opacity-0 translate-y-10 scale-95 transition-all duration-700">

                <div className="flex flex-col gap-8">
                    <HoverImage src={image_1} text={t('about_image_text')} />
                    <HoverImage src={image_2} text={t('about_image_text2')} />
                </div>

                <div className="flex items-center">
                    <div className="rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-500">
                        <HoverImage src={image_3} text={t('about_image_text1')} />
                    </div>
                </div>

            </div>

            {/* RIGHT */}
            <div
                ref={rightRef}
                className="bg-white rounded-xl shadow-xl p-4 opacity-0 translate-y-10 scale-95 transition-all duration-700"
            >
                <div className="flex flex-col gap-5">

                    <TitleCompGen title="Choose Abalma!" />

                    <img
                        src={image_3}
                        alt="about"
                        className="rounded-md w-full h-52 object-cover hover:scale-105 transition duration-500"
                    />

                    <p className="text-sm text-body-color leading-relaxed whitespace-pre-line max-w-3xl">
                        {t('paragraph')}
                    </p>

                    <button
                        onClick={() => {
                            navigate(`/${ENDPOINTS.LOGIN}`);
                            dispatch(setCurrentNav(ENDPOINTS.LOGIN));
                        }}
                        className="fp-btn"
                    >
                        {t('button')}

                    </button>

                </div>
            </div>

        </section>
    );
};