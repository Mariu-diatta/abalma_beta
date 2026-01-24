import React, { useEffect, useRef, useState } from "react";
import api from "../services/Axios";

/**
 * Props:
 *  - testimonials: Array of { id, author, role, text, avatar? }
 *  - autoplay: boolean (default true)
 *  - autoplayInterval: ms (default 5000)
 */
export default function TestimonialCarousel({
    autoplay = true,
    autoplayInterval = 5000,
}) {
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);
    const containerRef = useRef(null);
    const [testimonials, setTestimonials] = useState([]);
    const length = testimonials.length;

    // fetch testimonials
    useEffect(() => {
        api
            .get("/content/testmony/")
            .then((resp) => setTestimonials(resp.data))
            .catch((err) => console.log(err?.message));
    }, []);

    // autoplay
    useEffect(() => {
        if (!autoplay || length <= 1) return;
        startTimer();
        return stopTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, autoplay, length, autoplayInterval]);

    function startTimer() {
        stopTimer();
        timerRef.current = setTimeout(goNext, autoplayInterval);
    }

    function stopTimer() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }

    function goPrev() {
        setIndex((i) => (i - 1 + length) % length);
    }

    function goNext() {
        setIndex((i) => (i + 1) % length);
    }

    function goTo(i) {
        setIndex(i % length);
    }

    // keyboard navigation
    useEffect(() => {
        function onKey(e) {
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "Escape") containerRef.current?.blur();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    return (

        <div
            ref={containerRef}
            className="relative mx-auto mb-[10dvh] mx-auto
                w-[45dvh] h-[45dvh] mb:w-[60dvh] mb:h-[60dvh]
                rounded-full
                bg-gradient-to-br from-purple-50 to-blue-100
                flex items-center justify-center
                hover:rounded-md hover:shadow-lg
            "
            onMouseEnter={stopTimer}
            onMouseLeave={() => autoplay && startTimer()}
        >
            {/* Slides */}
            <div className="w-full h-full overflow-hidden rounded-full  flex items-center justify-center">

                <div
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    aria-live="polite"
                >
                    {
                        testimonials?.map((t, i) => (

                           <article
                                key={i}
                                className="w-full h-full flex-shrink-0
                                           flex items-center justify-center
                                           text-center"
                                role="group"
                                aria-roledescription="slide"
                                aria-label={t?.prenom}
                            >
                                <div className="flex flex-col items-center justify-center gap-4  ">
                                    {console.log(t) }

                                    <img
                                        src={t?.image}
                                        alt={t?.prenom}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />

                                    <p className="text-gray-700 text-sm px-10">
                                        {t?.content}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm">

                                        <p className="font-medium text-gray-900">
                                            {t?.prenom}
                                        </p>

                                        {t?.is_fournisseur && (
                                            <span className="text-gray-500">✔️</span>
                                        )}

                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {t?.profession}
                                    </p>

                                </div>

                            </article>

                            )
                        )

                    }

                </div>
            </div>

            {/* Controls (hidden but kept) */}
            <div className="hidden">
                <button
                    onClick={() => {
                        stopTimer();
                        goPrev();
                    }}
                    aria-label="Précédent"
                />
                <button
                    onClick={() => {
                        stopTimer();
                        goNext();
                    }}
                    aria-label="Suivant"
                />
            </div>

            {/* Pagination dots (hidden but kept) */}
            <div className="hidden">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            stopTimer();
                            goTo(i);
                        }}
                        aria-label={`Aller au témoignage ${i + 1}`}
                        aria-current={i === index}
                    />
                ))}
            </div>
        </div>
    );
}
