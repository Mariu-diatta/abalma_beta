import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import TitleCompGen from "./TitleComponentGen";

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */

const IconGrowth = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            d="M4 4.5V19a1 1 0 0 0 1 1h15M7 14l4-4 4 4 5-5" />
    </svg>
);

const IconSecurity = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
    </svg>
);

const IconEngagement = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            d="M13.213 9.787a3.39 3.39 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794" />
    </svg>
);

/* ─────────────────────────────────────────────
   SLIDES CONFIG (clean & scalable)
───────────────────────────────────────────── */

const getSlides = (t) => [
    {
        icon: IconGrowth,
        name: "Croissance Digitale",
        subtitle: "Solutions Marketing Abalma",
        details: t("serviceHome.detail_1"),
        accent: "#4f46e5",
    },
    {
        icon: IconSecurity,
        name: "Cybersécurité",
        subtitle: "Services de Sécurité Abalma",
        details: t("serviceHome.detail_2"),
        accent: "#7c3aed",
    },
    {
        icon: IconEngagement,
        name: "Engagement Client",
        subtitle: "Services Premium Abalma",
        details: t("serviceHome.detail_3"),
        accent: "#0ea5e9",
    },
];

/* ─────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────── */

const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

const visualVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.95 }),
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

const ServicesPlatforms = () => {
    const { t } = useTranslation();

    const slides = useMemo(() => getSlides(t), [t]);

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);

    const total = slides.length;
    const current = slides[index];

    const goTo = useCallback((next) => {
        setDirection(next > index ? 1 : -1);
        setIndex((next + total) % total);
    }, [index, total]);

    const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
    const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

    /* autoplay */
    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => goNext(), 5000);
        return () => clearInterval(id);
    }, [goNext, paused]);

    return (
        <section
            className="relative py-20 max-w-6xl mx-auto px-4 w-full md:w-1/2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="mb-14 text-center">
                <TitleCompGen title={t("Nos activités")} />
            </div>

            <div className="relative rounded-3xl bg-white border border-gray-100 shadow-md overflow-hidden">

                {/* Accent bar */}
                <motion.div
                    className="absolute top-0 left-0 h-1"
                    animate={{
                        backgroundColor: current.accent,
                        width: `${((index + 1) / total) * 100}%`
                    }}
                />

                <div className="">

                    {/* ───────── TEXT PANEL ───────── */}
                    <div className="relative p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-10 h-10 flex items-center justify-center rounded-xl text-white"
                                        style={{ background: current.accent }}
                                    >
                                        {React.createElement(current.icon)}
                                    </span>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {current.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {current.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {current.details}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* NAV */}
                        <div className="flex justify-between items-center mt-10">
                            <div className="flex gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: i === index ? 24 : 8,
                                            background: i === index ? current.accent : "#e5e7eb"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={goPrev} className="btn">‹</button>
                                <button onClick={goNext} className="btn">›</button>
                            </div>
                        </div>

                    </div>

                    {/* ───────── VISUAL PANEL ───────── */}
                    <div className="hidden relative flex items-center justify-center p-8 overflow-hidden">

                        <motion.div
                            className="absolute inset-0 opacity-30"
                            animate={{ backgroundColor: `${current.accent}10` }}
                        />

                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={index}
                                custom={direction}
                                variants={visualVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.45 }}
                                className="relative w-full max-w-xs"
                            >
                                {/* SVG placeholder */}
                                <div className="w-full h-64 bg-gray-100 rounded-xl" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesPlatforms;