import React, { useRef, useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import HomeLayout from "../layouts/HomeLayout";
import image_1 from "../assets/image_1.jpg";
import image_2 from "../assets/image_fabrique.jpg";
import image_3 from "../assets/image_3.jpg";
import HoverImage from "../components/HoverImage";
import TitleCompGen from "../components/TitleComponentGen";
import RegisterForm from "./Register";

/* ---------------- PAGE WRAPPER ---------------- */
const About = () => (
    <HomeLayout>
        <AboutContainer />
    </HomeLayout>
);
export default About;

/* ---------------- HOOK ANIMATION ---------------- */
const useRevealOnScroll = (refs, options = {}) => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, ...options }
        );
        refs.forEach((ref) => ref.current && observer.observe(ref.current));
        return () => observer.disconnect();
    }, [refs,options]);
};

/* ---------------- STAT BADGE ---------------- */
const StatBadge = ({ value, label }) => (
    <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/70 border border-gray-100 backdrop-blur-sm shadow-sm">
        <span className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</span>
        <span className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">{label}</span>
    </div>
);

/* ---------------- FEATURE PILL ---------------- */
const FeaturePill = ({ icon, label }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-medium text-purple-700">
        <span className="text-base">{icon}</span>
        {label}
    </span>
);

/* ---------------- CONTENT ---------------- */
const AboutContainer = () => {

    const { t } = useTranslation();

    const heroRef = useRef(null);
    const galleryRef = useRef(null);
    const cardRef = useRef(null);
    const statsRef = useRef(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useRevealOnScroll([heroRef, galleryRef, cardRef, statsRef]);

    const revealStyle = {
        opacity: 0,
        transform: "translateY(32px)",
        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40">

            {/* ── HERO BANNER ── */}
            <div
                ref={heroRef}
                style={{ ...revealStyle, transitionDelay: "0ms" }}
                className="relative overflow-hidden rounded-3xl mx-4 mt-0 lg:mx-10 lg:mt-0"
            >
                <div className="absolute inset-0 overflow-hidden rounded-3xl">

                    <img
                        src={image_3}
                        alt=""
                        aria-hidden
                        className="w-full h-full object-cover scale-105"
                        style={{ filter: "brightness(0.45)" }}
                    />

                    {/* Overlay subtle */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"/>

                </div>

                <div className="relative z-10 px-8 py-14 lg:px-16 lg:py-20 max-w-2xl"> 

                    <TitleCompGen title="Choose Abalma!" className="text-white"/>

                    <p className="mt-4 text-white/70 text-base leading-relaxed">
                        {t("paragraph")}
                    </p>

                    {!showLogin && showRegister &&
                        <RegisterForm
                            onClose={() => setShowRegister(false)}
                            callbackState={() => {
                                setShowLogin(true);      // 1. fermer le login
                                setShowRegister(false); // 2. ouvre le registre
                            }}
                        />
                    }

                    <button
                        onClick={() => setShowRegister(true)}
                        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-purple-50 transition-all duration-300 hover:scale-105 shadow-lg shadow-black/20"
                    >
                        {t("button")}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div
                ref={statsRef}
                style={{ ...revealStyle, transitionDelay: "150ms" }}
                className="flex flex-wrap justify-center gap-4 px-4 mt-8 lg:mt-10"
            >
                <StatBadge value="1" label={t('traduc_years_experience')} />
                <StatBadge value="..." label={t('traduc_satisfied_clients')} />
                <StatBadge value="...%" label={t('traduc_satisfaction_rate')} />
                <StatBadge value="24/7" label={t('traduc_support_available')} />

            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid lg:grid-cols-2 gap-8 px-4 mt-10 mb-10 lg:px-10 items-start">

                {/* LEFT — galerie masonry */}
                <div
                    ref={galleryRef}
                    style={{ ...revealStyle, transitionDelay: "200ms" }}
                    className="grid grid-cols-2 gap-3"
                >
                    {/* Grande image à gauche */}
                    <div className="row-span-2 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 group">
                        <div className="relative h-full min-h-[320px]">
                            <HoverImage src={image_1} text={t("about_image_text")} />
                        </div>
                    </div>

                    {/* Deux images à droite */}
                    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 group">
                        <HoverImage src={image_2} text={t("about_image_text2")} />
                    </div>

                    <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 group">
                        <HoverImage src={image_3} text={t("about_image_text1")} />
                    </div>

                    {/* Feature pills */}
                    <div className="col-span-2 flex flex-wrap gap-2 pt-2">
                        <FeaturePill icon="✦" label={t('traduc_premium_quality')} />
                        <FeaturePill icon="⚡" label={t('traduc_fast_delivery') } />
                        <FeaturePill icon="🛡" label={t('traduc_warranty')} />
                        <FeaturePill icon="🌿" label={t('traduc_eco')} />
                    </div>

                </div>

                {/* RIGHT — content card */}
                <div
                    ref={cardRef}
                    style={{ ...revealStyle, transitionDelay: "350ms" }}
                    className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden"
                >
                    {/* Card header accent */}
                    <div className="h-1.5 bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500" />

                    <div className="p-7 lg:p-9 flex flex-col gap-6">

                        <div>
                            <TitleCompGen title="Choose Abalma!" />
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                                {t("paragraph")}
                            </p>
                        </div>

                        {/* Séparateur décoratif */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs text-gray-300 tracking-widest uppercase">{t('traduc_about')}</span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Liste de valeurs */}
                        <ul className="space-y-3">
                            {[
                                { icon: "◆", text: t('traduc_expertise') },
                                { icon: "◆", text: t('traduc_custom_solutions') },
                                { icon: "◆", text: t('traduc_team')},
                            ].map(({ icon, text }) => (
                                <li key={text} className="flex items-start gap-3 text-sm text-gray-600">
                                    <span className="text-purple-400 mt-0.5 text-xs">{icon}</span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button
                            onClick={() => setShowRegister(true)}
                            className="w-full mt-2 py-3.5 rounded-2xl bg-white/30 text-white text-sm font-medium tracking-wide hover:bg-purple-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/10"
                        >
                            {t("button")}

                        </button>

                        <p className="text-center text-xs text-white/30">
                            {t('traduc_trust')}
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};