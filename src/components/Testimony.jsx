import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/Axios";
import TitleCompGen from "./TitleComponentGen";

export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const timerRef = useRef(null);

    const length = testimonials.length;

    // 📱 Responsive
    const getItemsPerView = () => {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    useEffect(() => {
        const handleResize = () => setItemsPerView(getItemsPerView());
        handleResize(); // initial

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, length - itemsPerView);

    // 📡 Fetch data
    useEffect(() => {
        api.get("/content/testmony/")
            .then(res => setTestimonials(res.data || []))
            .catch(console.error);
    }, []);

    const goNext = useCallback(() => {
        setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const goPrev = useCallback(() => {
        setIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    // ⏱ Autoplay
    const stopAutoplay = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
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

            <TitleCompGen title="Ils développent leur activité avec Abalma" />

            <div
                className="relative rounded-2xl"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
            >
                {/* Slider */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-in-out gap-2"
                        style={{
                            transform: `translateX(-${(index * 100) / itemsPerView}%)`,
                        }}
                    >
                        {testimonials.map((t, i) => {
                            const stars = parseInt(t?.number_stars ?? 0, 10);

                            return (
                                <div
                                    key={t.id ?? i}
                                    style={{ width: `${100 / itemsPerView}%` }}
                                    className="flex-shrink-0 py-4"
                                >
                                    <div className="rounded-xl p-4 shadow-xl h-full bg-white/30">

                                        <div className="flex items-start justify-start gap-4">
                                            <img
                                                src={t?.image || t?.photo_url || "/avatar.png"}
                                                alt={t?.prenom || "Avatar"}
                                                className="w-14 h-14 rounded-full object-cover border shadow-md"
                                                loading="lazy"
                                            />

                                            <div className="flex flex-col items-start">

                                                <h4 className="font-semibold">
                                                    {t?.prenom || "Utilisateur"}
                                                </h4>

                                                {t?.profession && (
                                                    <p className="text-sm text-gray-500">
                                                        {t.profession}
                                                    </p>
                                                )}

                                                <p className="text-gray-700 italic my-2">
                                                    {t?.content}
                                                </p>

                                                {/* Stars */}
                                                <div className="flex">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <svg
                                                            key={idx}
                                                            className="w-5 h-5"
                                                            fill={idx < stars ? "gold" : "lightgray"}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M12 2l2.9 6.6 7.1.6-5.3 4.6 1.6 7-6.3-3.7-6.3 3.7 1.6-7L2 9.2l7.1-.6L12 2z" />
                                                        </svg>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
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

                {/* Dots */}
                {length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-blue-400" : "w-3 bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}