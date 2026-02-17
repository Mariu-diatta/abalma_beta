import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/Axios";

export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [testimonials, setTestimonials] = useState([]);
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);
    const containerRef = useRef(null);

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
        setIndex((i) => (i + 1) % length);
    }, [length]);

    const goPrev = useCallback(() => {
        setIndex((i) => (i - 1 + length) % length);
    }, [length]);

    const stopAutoplay = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startAutoplay = useCallback(() => {
        if (!autoplay || length <= 1) return;
        stopAutoplay();
        timerRef.current = setInterval(goNext, autoplayInterval);
    }, [autoplay, autoplayInterval, goNext, length, stopAutoplay]);

    // Autoplay effect
    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, [startAutoplay, stopAutoplay]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "Escape") containerRef.current?.blur();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goNext, goPrev]);

    if (!length) return <p className="text-center py-10">Chargement...</p>;

    return (
        <section
            ref={containerRef}
            aria-label="Témoignages utilisateurs"
            className="
        relative mx-auto mb-[10dvh]
        w-[45dvh] h-auto py-3
        mb:w-[60dvh] mb:h-[60dvh]
        rounded-md flex items-center justify-center
        transition-shadow hover:shadow-xl
      "
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
            onFocus={stopAutoplay}
            onBlur={startAutoplay}
            tabIndex={0}
        >
            <div className="w-full h-full overflow-hidden rounded-md flex items-center justify-center">
                <div
                    className="flex h-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    aria-live="polite"
                >
                    {testimonials.map((t, i) => (
                        <article
                            key={t.id || i}
                            className="w-full h-full flex-shrink-0 flex items-center justify-center px-2 py-2"
                        >
                            <div className="flex items-center gap-4 max-w-md">
                                <img
                                    src={t?.image || t?.photo_url || "/avatar.png"}
                                    alt={t?.prenom || "Avatar"}
                                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="text-left">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {t?.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium mt-2">
                                        <span>{t?.prenom}</span>
                                        {t?.is_fournisseur && (
                                            <span className="text-green-600">✔</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{t?.profession}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
