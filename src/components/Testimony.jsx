import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/Axios";

export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);
    const length = testimonials.length;

    // Fetch testimonials
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const resp = await api.get("/content/testmony/");
                setTestimonials(resp.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTestimonials();
    }, []);

    const goNext = useCallback(() => {
        setIndex((prev) => (prev + 1) % length);
    }, [length]);

    const goPrev = useCallback(() => {
        setIndex((prev) => (prev - 1 + length) % length);
    }, [length]);

    const stopAutoplay = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startAutoplay = useCallback(() => {
        if (!autoplay || length <= 1) return;
        stopAutoplay();
        timerRef.current = setInterval(goNext, autoplayInterval);
    }, [autoplay, autoplayInterval, goNext, length]);

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [startAutoplay]);

    if (!length) return null;

    return (
        <section className="relative w-full max-w-3xl mx-auto py-16 px-4">

            {/* Card */}
            <div
                className="relative backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-500"
                onMouseEnter={stopAutoplay}
                onMouseLeave={startAutoplay}
            >
                <div className="overflow-hidden">

                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {
                            testimonials?.map((t, i) => (
                                <div
                                    key={t.id || i}
                                    className="w-full flex-shrink-0 flex flex-col items-center text-center px-4"
                                >
                                    <img
                                        src={t?.image || t?.photo_url || "/avatar.png"}
                                        alt={t?.prenom || "Avatar"}
                                        className="w-20 h-20 rounded-full object-cover shadow-md mb-4"
                                    />

                                    {/* Stars */}
                                    <div className="flex mb-3">
                                        {[...Array(5)].map((_, idx) => (
                                 
                                            <svg key={idx} className={(idx < parseInt(t?.number_stars ?? 0)) ? "w-5 h-5 text-yellow-800" : "text-gray-300"}  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="1" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                                            </svg>

                                        ))}
                                    </div>

                                    <p className="text-gray-700 text-lg italic mb-2 max-w-xl">

                                        {t?.content}

                                    </p>

                                    <h4 className="font-semibold text-gray-900">
                                        {t?.prenom}
                                        {t?.is_fournisseur && (
                                            <span className="text-green-500 ml-2">✔</span>
                                        )}
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        {t?.profession}
                                    </p>

                                </div>
                            ))
                        }

                    </div>

                </div>

                {/* Navigation buttons */}
                {length > 1 && (
                    <>
                        <button
                            onClick={goPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-red-50 to-blue-100 rounded-full p-2 hover:scale-110 transition"
                        >
                            ‹
                        </button>

                        <button
                            onClick={goNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-red-50 to-blue-100 rounded-full p-2 hover:scale-110 transition"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* Dots indicator */}
            {
                (length > 1) && (
                       <div className="flex justify-center gap-2 mt-8">

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

        </section>
    );
}