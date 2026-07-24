import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "../utils";
import TitleCompGen from "../components/TitleComponentGen";

// ─── Hook mobile ─────────────────────────────────────────────────────────────
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false
    );
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return isMobile;
};

// ─── Carte partagée ───────────────────────────────────────────────────────────
const ServiceCard = ({ service, index, total, t }) => (
    <div className="group relative flex flex-col items-center text-center px-6 py-2 md:py-8 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden h-full">
        {/* Accent hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Barre colorée */}
        <div
            className="absolute top-0 left-0 h-1 w-full rounded-t-2xl"
            style={{ background: `hsl(${220 + (index / total) * 100}, 75%, 60%)` }}
        />

        {/* Numéro */}
        <span className="absolute top-3 left-4 text-xs font-mono text-gray-300">
            {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icône */}
        <div className="relative mb-5 mt-2">
            <div className="absolute inset-0 bg-indigo-100 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-30 blur-md" />
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300 text-2xl shadow-inner">
                {service.icon}
            </div>
        </div>

        {/* Titre */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 tracking-tight leading-snug">
            {t(`${service.key}.title`)}
        </h3>

        {/* Séparateur */}
        <div
            className="h-px mb-3 w-6 group-hover:w-12 transition-all duration-500"
            style={{ background: `hsl(${220 + (index / total) * 100}, 75%, 60%)` }}
        />

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed">
            {t(`${service.key}.description`)}
        </p>
    </div>
);

// ─── Mobile : carousel swipeable ─────────────────────────────────────────────
const MobileCarousel = ({ t }) => {
    const total = services.length;
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const goTo = (next) => {
        const clamped = Math.max(0, Math.min(next, total - 1));
        setDirection(clamped > current ? 1 : -1);
        setCurrent(clamped);
    };

    const handleDragEnd = (_, info) => {
        if (info.offset.x < -50 && current < total - 1) goTo(current + 1);
        else if (info.offset.x > 50 && current > 0) goTo(current - 1);
    };

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
    };

    return (
        <div className="flex flex-col items-center gap-1 w-full px-1 py-2 md:py-5">
            {/* Carte */}
            <div className="relative w-full m-2 min-h-[30dvh]">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={current}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    >
                        <ServiceCard
                            service={services[current]}
                            index={current}
                            total={total}
                            t={t}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2">
                {services.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Service ${i + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width: i === current ? 24 : 8,
                            height: 8,
                            background: i === current
                                ? `hsl(${220 + (i / total) * 100}, 75%, 60%)`
                                : "#e5e7eb",
                        }}
                    />
                ))}
            </div>

            {/* Flèches */}
            <div className="flex gap-3">
                <button
                    onClick={() => goTo(current - 1)}
                    disabled={current === 0}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                    aria-label="Précédent"
                >
                    ←
                </button>
                <button
                    onClick={() => goTo(current + 1)}
                    disabled={current === total - 1}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                    aria-label="Suivant"
                >
                    →
                </button>
            </div>

            {/* Hint swipe */}
            <p className="text-[10px] text-gray-300 tracking-widest uppercase">
                ← glisser →
            </p>
        </div>
    );
};

// ─── Desktop : éventail ───────────────────────────────────────────────────────
const DesktopFan = ({ t }) => {
    const total = services.length;
    const mid = (total - 1) / 2;

    return (
        <div className="relative flex items-end justify-center min-h-[350px] py-5 md:py-15">
            {services.map((service, index) => {
                const offset = index - mid;
                const rotate = offset * 10;
                const translateX = offset * 90;
                const translateY = Math.abs(offset) * 20;

                return (
                    <motion.article
                        key={service?.key ?? index}
                        initial={{ opacity: 0, y: 180, rotate: rotate - 10 }}
                        whileInView={{ opacity: 1, y: 0, rotate }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                        whileHover={{
                            rotate: 0,
                            translateX: 0,
                            translateY: -28,
                            zIndex: 50,
                            scale: 1.06,
                            transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        className="absolute w-56 cursor-pointer"
                        style={{
                            rotate: `${rotate}deg`,
                            translateX: `${translateX}px`,
                            translateY: `${translateY}px`,
                            zIndex: index + 1,
                            transformOrigin: "bottom center",
                        }}
                    >
                        <ServiceCard service={service} index={index} total={total} t={t} />
                    </motion.article>
                );
            })}
        </div>
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const ServicesSection = () => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        <section
            className="relative mb-6 pb-5 mt-2 w-full mx-auto"
            aria-labelledby="services-title"
        >
            <div className="text-center">
                <TitleCompGen title="Nos services" />
            </div>

            {isMobile ? <MobileCarousel t={t} /> : <DesktopFan t={t} />}

        </section>
    );
};

export default ServicesSection;