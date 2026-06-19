import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";
import api from "../services/Axios";
import { useTranslation } from "react-i18next";


const CAT_STYLES = {
    "event": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-100" },
    "promotion": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-100" },
    "advertisement": { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-100" },
    "information": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-100" },
    "urgence": { bg: "bg-red-50", text: "text-red-800", border: "border-red-100" },
};

/* ── hook usePortal ── */
const usePortal = (id = "affiche-portal-root") => {
    const [el, setEl] = useState(null);

    useEffect(() => {
        let node = document.getElementById(id);

        if (!node) {
            node = document.createElement("div");
            node.id = id;
            document.body.appendChild(node);
        }

        setEl(node);
    }, [id]);

    return el;
};

/* ── composant carte affiche ── */
const AfficheCard = ({ affiche, onDelete, onEdit, onNext, current, total, onPrev }) => {

    const style = CAT_STYLES[affiche?.category] ?? CAT_STYLES["Information"];

    const currentUser = useSelector(state => state.auth.user)

    const { t } = useTranslation();

    return (
        <div
            className="
                bg-white
                rounded-3xl
                border border-gray-100
                overflow-hidden
                w-full
                max-w-md
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                animate-[cardEnter_.35s_cubic-bezier(.22,1,.36,1)]
            "
        >

            {/* En-tête modale */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <i className="ti ti-speakerphone text-purple-500 text-lg" />
                    {t('platform_ads')}
                </div>

                <span className="text-xs text-gray-400">
                    {current} / {total}
                </span>
            </div>

            {/* Image */}
            {affiche?.image ? (
                <img src={typeof affiche?.image === "string" ? affiche?.image : URL.createObjectURL(affiche?.image)}
                    alt={affiche.title} className="w-full h-52 object-cover" />
            ) : (
                <div className="w-full h-52 bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center gap-2">
                    <i className="ti ti-photo text-4xl text-purple-300" aria-hidden="true" />
                        <span className="text-sm text-purple-400">{t('image_preview')}</span>
                </div>
            )}

            {/* Corps */}
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between hidden">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
                        {affiche?.category}
                    </span>
                    {affiche?.end_date && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <i className="ti ti-calendar text-sm" aria-hidden="true" />
                            {t('until')} {new Date(affiche?.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    )}
                </div>

                <h2 className="text-base font-medium text-gray-900 leading-snug">{affiche?.title}</h2>

                {affiche?.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">{affiche?.description}</p>
                )}

                {/* Actions */}
                {
                    currentUser &&
                    <div className="grid grid-cols-3 gap-2 pt-1 hidden">
                        <button onClick={onDelete}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-700 hover:bg-red-100 transition-all">
                            <i className="ti ti-trash text-sm" aria-hidden="true" /> {t('delete')}
                        </button>
                        <button onClick={onEdit}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all">
                                <i className="ti ti-edit text-sm" aria-hidden="true" /> {t('edit')}
                        </button>
                        <button onClick={onNext}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-all">
                            <i className="ti ti-clock text-sm" aria-hidden="true" /> {t('later')}
                        </button>
                    </div>
                }

            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-between px-6 pb-5">

                {/* Précédent */}
                <button
                    onClick={onPrev}
                    disabled={total <= 1}
                    className="
                        w-10 h-10
                        rounded-full
                        bg-gray-50
                        border border-gray-200
                        flex items-center justify-center
                        text-gray-500
                        hover:bg-white
                        hover:shadow-md
                        transition-all
                    "
                >
                    <i className="ti ti-chevron-left" />
                </button>

                {/* Dots centrés */}
                <div className="flex items-center gap-2">

                {Array.from({ length: total }).map((_, i) => (

                    <button
                        key={i}
                        className={`
                            transition-all duration-300 rounded-full
                            ${i === current - 1
                                ? "w-8 h-2 bg-purple-500"
                                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                            }
                        `}
                    />
                ))}

                </div>

                {/* Suivant */}
                <button
                    onClick={onNext}
                    disabled={total <= 1}
                    className="
                        w-10 h-10
                        rounded-full
                        bg-purple-50
                        border border-purple-100
                        flex items-center justify-center
                        text-purple-600
                        hover:bg-purple-100
                        hover:shadow-md
                        transition-all
                    "
                >
                    <i className="ti ti-chevron-right" />

                </button>

            </div>

        </div>
    );
};

/* ── composant principal ── */
const AffichePortal = ({  onEdit }) => {
    const portalEl = usePortal();
    const [ads, setAds] = useState([]);
    const [current, setCurrent] = useState(0);
    const [visible, setVisible] = useState(false);
    const [direction, setDirection] = useState("next");
    const { t } = useTranslation();
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const alreadySeen = localStorage.getItem("affiche_seen");

        if (alreadySeen) {
            setVisible(false);
            return;
        }

        const fetchAdvertisements = async () => {

            try {

                const res = await api.get("/advertisements/");

                const filtered = res.data.filter(
                    ad => !localStorage.getItem(`affiche_seen_${ad.id}`)
                );

                setAds(filtered || []);

                if (res.data?.length > 0) {
                    setVisible(true);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchAdvertisements();
    }, []);;

    const handleNext = () => {
        setDirection("next");

        setCurrent((c) =>
            c + 1 >= ads.length ? 0 : c + 1
        );
    };


    const handlePrev = useCallback(() => {
        setCurrent((c) =>
            c === 0
                ? ads.length - 1
                : c - 1
        );
    }, [ads.length]);

    useEffect(() => {
        if (ads.length <= 1) return;

        const timer = setInterval(() => {
            setDirection("next");

            setCurrent((c) =>
                c + 1 >= ads.length ? 0 : c + 1
            );
        }, 6000);

        return () => clearInterval(timer);
    }, [ads.length]);

    const handleDelete = useCallback(() => {
        setAds((prev) => {
            const next = prev.filter((_, i) => i !== current);
            if (next.length === 0) setVisible(false);
            else setCurrent((c) => Math.min(c, next.length - 1));
            localStorage.setItem(`affiche_seen_${ads[current]?.id}`, "true");

            return next;
        });
    }, [current, ads]);


    if (!visible || ads?.length===0) return null;

    return createPortal(
        <div
            role="dialog" aria-modal="true" aria-label={t('platform_posters')}
            className="fixed justify-center md:justify-end inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.1)" }}
            onDoubleClick={() => {
                localStorage.setItem("affiche_seen", "true");
                setVisible(false);
            }}
        >

            <button
                onClick={() => {
                    localStorage.setItem("affiche_seen", "true");
                    setVisible(false);
                }}
                className="
                    absolute
                    w-10 h-10
                    rounded-full
                    bg-purple-50
                    border-0
                    flex items-center justify-center
                    text-purple-600
                    hover:bg-purple-100
                    hover:shadow-md
                    hover:bg-red-300
                    transition-all
                    top-3
                "
            >
                X

            </button>

            <AnimatePresence mode="wait">

                <motion.div
                    key={ads[current]?.id || current}
                    initial={{
                        opacity: 0,
                        x: direction === "next" ? 80 : -80,
                        scale: 0.96,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        x: direction === "next" ? -80 : 80,
                        scale: 0.96,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    <AfficheCard
                        key={ads[current]?.id || current}
                        affiche={ads[current]}
                        current={current + 1}
                        total={ads.length}
                        onDelete={handleDelete}
                        onEdit={() => onEdit?.(ads[current], current)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />

                </motion.div>

            </AnimatePresence>
        </div>,

        portalEl
    );
};

export default AffichePortal;