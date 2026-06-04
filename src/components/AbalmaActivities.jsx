import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import TitleCompGen from "./TitleComponentGen";

// ─── SVGs ─────────────────────────────────────────────────────────────────────
const Illustration1 = () => (
    <svg viewBox="0 0 627 499" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
    <svg viewBox="0 0 506 575" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
    <svg viewBox="0 0 364 485" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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

// ─── Icônes badges ────────────────────────────────────────────────────────────
const IconGrowth = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5m0 0h-3.207M20 9v3.207" />
    </svg>
);

const IconSecurity = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
    </svg>
);

const IconEngagement = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
    </svg>
);

// ─── Variants d'animation ─────────────────────────────────────────────────────
const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const visualVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.95 }),
};

// ─── Composant principal ──────────────────────────────────────────────────────
const ServicesPlatforms = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            icon: <IconGrowth />,
            name: "Croissance Digitale",
            subtitle: "Solutions Marketing Abalma",
            details: t("serviceHome.detail_1"),
            accent: "#4f46e5",
            visual: <Illustration1 />,
        },
        {
            icon: <IconSecurity />,
            name: "Cybersécurité",
            subtitle: "Services de Sécurité Abalma",
            details: t("serviceHome.detail_2"),
            accent: "#7c3aed",
            visual: <Illustration2 />,
        },
        {
            icon: <IconEngagement />,
            name: "Engagement Client",
            subtitle: "Services Premium Abalma",
            details: t("serviceHome.detail_3"),
            accent: "#0ea5e9",
            visual: <Illustration3 />,
        },
    ];

    const total = slides.length;
    const slide = slides[current];

    const goTo = useCallback((next) => {
        setDirection(next > current ? 1 : -1);
        setCurrent((next + total) % total);
    }, [current, total]);

    const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
    const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

    // Auto-avance
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => goTo(current + 1), 5000);
        return () => clearInterval(timer);
    }, [current, isPaused, goTo]);

    return (
        <section
            className="relative py-20 max-w-6xl mx-auto px-4"
            aria-label="Activités et services"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Header */}
            <div className="mb-14 text-center">
                <TitleCompGen title={t("Nos activités")} />
            </div>

            {/* Carte principale */}
            <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden">

                {/* Barre accent colorée */}
                <motion.div
                    className="absolute top-0 left-0 h-1 rounded-t-3xl"
                    animate={{ backgroundColor: slide.accent, width: `${((current + 1) / total) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">

                    {/* ── Panneau texte ── */}
                    <div className="relative flex flex-col justify-between p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">

                        {/* Numéro discret */}
                        <span className="absolute top-8 right-8 text-[11px] font-mono text-gray-300 tracking-widest">
                            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </span>

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex flex-col gap-6"
                            >
                                {/* Badge + titre */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-md"
                                            style={{ backgroundColor: slide.accent }}
                                        >
                                            {slide.icon}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug">
                                                {slide.name}
                                            </h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {slide.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Séparateur */}
                                    <motion.div
                                        className="h-px w-12 rounded-full"
                                        style={{ backgroundColor: slide.accent }}
                                        initial={{ scaleX: 0, originX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    />
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                                    {slide.details}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                            {/* Dots */}
                            <div className="flex gap-2" aria-label="Navigation des slides">
                                {slides.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        aria-label={`Aller au slide ${i + 1}`}
                                        aria-current={i === current}
                                        onClick={() => goTo(i)}
                                        className="transition-all duration-300 rounded-full"
                                        style={{
                                            width: i === current ? 24 : 8,
                                            height: 8,
                                            backgroundColor: i === current ? slide.accent : "#e5e7eb",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Flèches */}
                            <div className="flex gap-2">
                                <motion.button
                                    type="button"
                                    onClick={goPrev}
                                    aria-label="Précédent"
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m15 19-7-7 7-7" />
                                    </svg>
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={goNext}
                                    aria-label="Suivant"
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m9 5 7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* ── Panneau visuel ── */}
                    <div
                        className="relative flex items-center justify-center p-8 lg:p-10 overflow-hidden"
                        aria-hidden="true"
                    >
                        {/* Fond décoratif */}
                        <motion.div
                            className="absolute inset-0 opacity-40"
                            animate={{ backgroundColor: `${slide.accent}08` }}
                            transition={{ duration: 0.6 }}
                        />
                        <div
                            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20"
                            style={{ backgroundColor: slide.accent }}
                        />

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={visualVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="relative z-10 w-full max-w-xs"
                            >
                                {slide.visual}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Tabs rapides en bas */}
            <div className="flex gap-3 mt-6 flex-wrap justify-center">
                {slides.map((s, i) => (
                    <motion.button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-200"
                        style={i === current ? {
                            backgroundColor: s.accent,
                            borderColor: s.accent,
                            color: "#fff",
                        } : {
                            backgroundColor: "#fff",
                            borderColor: "#e5e7eb",
                            color: "#6b7280",
                        }}
                    >
                        <span style={i !== current ? { color: s.accent } : {}}>
                            {s.icon}
                        </span>
                        {s.name}
                    </motion.button>
                ))}
            </div>
        </section>
    );
};

export default ServicesPlatforms;