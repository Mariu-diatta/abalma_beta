
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TitleCompGen from "./TitleComponentGen";

// ─── SVGs allégés ─────────────────────────────────────────────────────────────
const Illustration1 = () => (
    <svg viewBox="0 0 627 499" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-visual-svg">
        <rect x="178" y="73" width="292" height="212" rx="8" fill="#e4e2fb" />
        <rect x="290" y="195" width="107" height="70" rx="4" fill="#F9FAFB" />
        <path fillRule="evenodd" clipRule="evenodd" d="M329.792 213.68C330.168 212.642 329.63 211.495 328.592 211.119C327.553 210.743 326.407 211.28 326.031 212.319L316.075 239.819C315.699 240.857 316.236 242.004 317.275 242.38C318.313 242.756 319.46 242.219 319.836 241.18L329.792 213.68ZM312.926 215.112C313.737 215.862 313.788 217.127 313.039 217.939L304.721 226.949L313.039 235.96C313.788 236.771 313.737 238.037 312.926 238.786C312.114 239.535 310.849 239.484 310.099 238.673L301.156 228.984C300.095 227.835 300.095 226.063 301.156 224.914L310.099 215.225C310.849 214.414 312.114 214.363 312.926 215.112ZM333.738 215.112C332.926 215.862 332.876 217.127 333.625 217.939L341.942 226.949L333.625 235.96C332.876 236.771 332.926 238.037 333.738 238.786C334.55 239.535 335.815 239.484 336.564 238.673L345.508 228.984C346.568 227.835 346.568 226.063 345.508 224.914L336.564 215.225C335.815 214.414 334.55 214.363 333.738 215.112Z" fill="#e4e2fb" />
        <rect x="290" y="100" width="107" height="70" rx="4" fill="#F9FAFB" />
        <rect x="456" y="432" width="78" height="67" rx="4" fill="#4f46e5" />
        <rect x="406" y="420" width="230" height="18" rx="4" fill="#F9FAFB" />
        <circle cx="510" cy="370" r="30" fill="#f1f0fd" />
        <rect x="0" y="178" width="212" height="183" rx="8" fill="#f1f0fd" />
        <rect x="24" y="202" width="60" height="48" rx="4" fill="#e4e2fb" />
        <rect x="96" y="218" width="48" height="8" rx="4" fill="#e4e2fb" />
        <rect x="24" y="262" width="60" height="48" rx="4" fill="#e4e2fb" />
    </svg>
);

const Illustration2 = () => (
    <svg viewBox="0 0 506 575" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-visual-svg">
        <rect x="23" y="0" width="248" height="521" rx="40" fill="#f1f0fd" />
        <rect x="116" y="20" width="62" height="14" rx="7" fill="#4f46e5" fillOpacity=".2" />
        <rect x="84" y="414" width="126" height="32" rx="16" fill="#4f46e5" />
        <rect x="115" y="427" width="65" height="6" rx="3" fill="#e4e2fb" fillOpacity=".5" />
        <rect x="52" y="123" width="191" height="180" rx="12" fill="#F9FAFB" />
        <rect x="78" y="136" width="36" height="48" rx="4" fill="#e4e2fb" />
        <rect x="134" y="152" width="48" height="6" rx="3" fill="#e4e2fb" />
        <rect x="200" y="152" width="24" height="6" rx="3" fill="#e4e2fb" />
        <rect x="78" y="196" width="36" height="48" rx="4" fill="#e4e2fb" />
        <rect x="134" y="212" width="48" height="6" rx="3" fill="#e4e2fb" />
        <rect x="98" y="293" width="96" height="8" rx="4" fill="#e4e2fb" />
        <rect x="227" y="148" width="135" height="120" rx="12" fill="#4f46e5" />
        <rect x="235" y="206" width="96" height="6" rx="3" fill="#b9b6f5" />
        <rect x="235" y="218" width="72" height="6" rx="3" fill="#b9b6f5" />
        <circle cx="337" cy="249" r="20" fill="#e4e2fb" />
        <rect x="356" y="524" width="68" height="4" rx="2" fill="#4f46e5" />
        <rect x="280" y="524" width="68" height="4" rx="2" fill="#4f46e5" />
    </svg>
);

const Illustration3 = () => (
    <svg viewBox="0 0 364 485" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-visual-svg">
        <rect x="0" y="277" width="92" height="21" rx="6" fill="#b9b6f5" />
        <rect x="13" y="298" width="7" height="186" rx="3.5" fill="#f1f0fd" />
        <rect x="74" y="298" width="7" height="186" rx="3.5" fill="#f1f0fd" />
        <rect x="124" y="0" width="240" height="138" rx="8" fill="#f1f0fd" />
        <circle cx="196" cy="69" r="40" fill="none" stroke="#e4e2fb" strokeWidth="18" />
        <path d="M196 29 A40 40 0 0 1 236 69" stroke="#F9FAFB" strokeWidth="18" strokeLinecap="round" />
        <circle cx="293" cy="69" r="40" fill="none" stroke="#e4e2fb" strokeWidth="18" />
        <path d="M253 69 A40 40 0 1 1 293 109" stroke="#F9FAFB" strokeWidth="18" strokeLinecap="round" />
        <rect x="219" y="428" width="21" height="56" rx="6" fill="#f1f0fd" />
        <rect x="250" y="396" width="21" height="88" rx="6" fill="#f1f0fd" />
        <rect x="281" y="366" width="21" height="118" rx="6" fill="#f1f0fd" />
        <rect x="312" y="341" width="21" height="143" rx="6" fill="#f1f0fd" />
        <rect x="110" y="232" width="224" height="4" rx="2" fill="#f1f0fd" />
        <rect x="100" y="229" width="233" height="8" rx="4" fill="#f1f0fd" />
        <rect x="64" y="428" width="140" height="56" rx="8" fill="#4f46e5" />
        <rect x="139" y="428" width="66" height="56" rx="8" fill="#4f46e5" />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
const ServicesPlatforms = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            details: t('serviceHome.detail_1'),
            badge: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207" />
            </svg>,

            name: "Croissance Digitale",
            position: "Solutions Marketing Abalma",
            visual: <Illustration1 />,
        },
        {
            reviewAlt: "lineicon",
            details: t('serviceHome.detail_2'),
            badge: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
            </svg>
,
            name: "Cybersécurité",
            position: "Services de Sécurité Abalma",
            visual: <Illustration2 />,
        },
        {
            reviewAlt: "lineicon",
            badge: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
            </svg>,
            details: t('serviceHome.detail_3'),
            name: "Engagement Client",
            position: "Services Premium Abalma",
            visual: <Illustration3 />,
        },
    ];

    const total = slides.length;

    const goPrev = useCallback(() =>
        setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1)),
        [total]);

    const goNext = useCallback(() =>
        setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1)),
        [total]);

    const slide = slides[current];

    return (
        <>
            <section className="sp-root sp-section" aria-label="Activités et services">

                {/* Header */}
                <div className="sp-header">
                    <TitleCompGen
                        title={t("Nos activités")}
                    />
                </div>

                {/* Carte slider */}
                <div className="sp-card-wrap">
                    <div className="sp-card" key={current}>

                        {/* Panneau texte */}
                        <div className="sp-card-text">
                            <div className='flex gap-3'>
                                <span className="sp-card-badge">{slide.badge}</span>
                                <div>
                                    <h3 className="sp-card-name">{slide.name}</h3>
                                </div>
                            </div>
                            <div className="sp-divider" />
                            <p className="sp-card-details">{slide.details}</p>

                        </div>

                        {/* Panneau visuel */}
                        <div className="sp-card-visual" aria-hidden="true">
                            {slide.visual}
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="sp-progress" aria-hidden="true">
                        <div
                            className="sp-progress-fill"
                            style={{ width: `${((current + 1) / total) * 100}%` }}
                        />
                    </div>

                    {/* Dots + nav */}
                    <div className="flex flex-col items-center">
                        <div className="sp-dots" aria-label="Navigation des slides">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Aller au slide ${i + 1}`}
                                    aria-current={i === current}
                                    className={`sp-dot ${i === current ? 'active' : 'inactive'}`}
                                    onClick={() => setCurrent(i)}
                                />
                            ))}
                        </div>

                        <div className="sp-nav">
                            <button type="button" className="sp-nav-btn" onClick={goPrev} aria-label="Précédent">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m15 19-7-7 7-7" />
                                </svg>
                            </button>
                            <button type="button" className="sp-nav-btn" onClick={goNext} aria-label="Suivant">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 5 7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                    </div>

                </div>

            </section>
        </>
    );
};

export default ServicesPlatforms;