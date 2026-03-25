import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/Axios";
import TitleCompGen from "./TitleComponentGen";

export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);

    const length = testimonials.length;

    // 🔥 Nombre d'éléments visibles selon écran
    const getItemsPerView = () => {
        if (window.innerWidth >= 1024) return 4; // desktop
        if (window.innerWidth >= 768) return 2; // tablet
        return 1; // mobile
    };

    const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

    // 🔄 Update responsive
    useEffect(() => {
        const handleResize = () => setItemsPerView(getItemsPerView());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, length - itemsPerView);

    // 📡 Fetch
    useEffect(() => {
        api.get("/content/testmony/")
            .then(resp => setTestimonials(resp.data || []))
            .catch(console.error);
    }, []);

    const goNext = useCallback(() => {
        setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const goPrev = useCallback(() => {
        setIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // ⏱️ Autoplay
    const stopAutoplay = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const startAutoplay = useCallback(() => {
        if (!autoplay || length <= itemsPerView) return;
        stopAutoplay();
        timerRef.current = setInterval(goNext, autoplayInterval);
    }, [autoplay, autoplayInterval, goNext, length, itemsPerView]);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [startAutoplay]);

    if (!length) return null;

    return (
        <section className="relative w-full mx-auto px-1 text-center">

            <TitleCompGen
                title="Ils développent leur activité avec Abalma"
            />

            <div
                className="relative rounded-2xl bg-none"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
            >
                {/* Slider */}
                <div className="overflow-hidden">
                    <div
                        className="flex items-center transition-transform duration-700 ease-in-out gap-2"
                        style={{
                            transform: `translateX(-${(index * 100) / itemsPerView}%)`,
                        }}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id ?? i}
                                style={{ width: `${100 / itemsPerView}%` }}
                                className="flex-shrink-0 py-4"
                            >
                                <div className="rounded-xl p-4 shadow-2xl h-full  bg-white/30">

                                    {/* Avatar */}
                                    <div className="flex items-start justfy-start gap-4">
                                        <img
                                            src={t?.image || t?.photo_url || "/avatar.png"}
                                            alt={t?.prenom || "Avatar"}
                                            className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-md"
                                            loading="lazy"
                                        /> 

                                        <div className="flex flex-col justify-start items-start">

                                            <>
                                                <h4 className="font-semibold">
                                                    {t?.prenom || "Utilisateur"}
                                                </h4>

                                                {t?.profession && (
                                                    <p className="text-sm text-gray-500">
                                                        {t.profession}
                                                    </p>
                                                )}
                                            </>

                                            {/* Content */}
                                            <p className="text-gray-700 italic mb-3">
                                                {t?.content}
                                            </p>

                                            {/* Stars */}
                                            <div className="flex mb-3">
                                                {[...Array(5)].map((_, idx) => (

                                                    <svg
                                                        key={idx}
                                                        className={(idx < parseInt(t?.number_stars ?? 0)) ? "w-6 h-6 text-green-100" : "w-6 h-6 text-yellow-50"}
                                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        fill={(idx < parseInt(t?.number_stars ?? 0)) ? "yellow" : "gray"}
                                                        viewBox="0 0 24 24">
                                                        <path
                                                            stroke="currentColor"
                                                            strokeWidth="0"
                                                            d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                                                    </svg>

                                                ))}
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                {length > itemsPerView && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white shadow rounded-full px-2 py-1"
                        >
                            ‹
                        </button>

                        <button
                            onClick={goNext}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white shadow rounded-full px-2 py-1"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Dots indicator */}
                {
                    (length > 1) && (
                        <div className="flex justify-center gap-2 mt-2">

                            {
                                testimonials?.map((_, i) => (

                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        className={`h-2 rounded-full transition-all duration-300 w-3  ${i === index
                                            ? "w-6 bg-blue-300"
                                            : "w-3 bg-gray-300"
                                            }`}
                                    />
                                )
                                )
                            }

                        </div>
                    )
                }

            </div>


        </section>
    );
}