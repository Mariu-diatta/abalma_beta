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
                                    <div className="flex mb-3 text-yellow-400">
                                        {"★★★★★".split("").map((_, idx) => (
                                            <span key={idx}>★</span>
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
                                        className={`h-2 rounded-full transition-all duration-300 ${i === index
                                                ? "w-6 bg-green-300"
                                                : "w-2 bg-grey-500"
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