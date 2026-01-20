// TestimonialCarousel.jsx
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
    const [testimonials, setTestimonials] = useState([])
    const length = testimonials.length;

    // autoplay
    useEffect(() => {

        try {
            api.get("/content/testmony/").then(
                resp => {
                    setTestimonials(resp.data)
                }
            ).catch(
                err=> {
                    console.log(err?.message)
                }
            )
        } catch (err) {

        } finally {
        }

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
        timerRef.current = setTimeout(() => {
            goNext();
        }, autoplayInterval);
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

    // keyboard nav
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
            className="relative w-full max-w-3xl mx-auto mb-[10dvh]"
            onMouseEnter={stopTimer}
            onMouseLeave={() => autoplay && startTimer()}
        >
            {/* Slides */}
            <div className="overflow-hidden translate-x-0 transition-all duration-1000 ease-in-out shadow-lg">

                <div
                    className="flex transition-transform duration-500 ease-out "
                    style={{ transform: `translateX(-${index * 100}%)` }}
                    aria-live="polite"
                >
                    {
                        testimonials?.map(

                            (t, index) => (

                                <article
                                    key={index}
                                    className="w-full flex-shrink-0  rounded-xl shadow-lg rounded-lg"
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${t?.prenom}`}
                                >
                                    <div className="flex items-center gap-4 justify-center py-8 ">

                                        <div className="flex-shrink-0">

                                            <img
                                                src={t?.image || t?.photo_url}
                                                alt={t?.prenom}
                                                className="w-16 h-16 rounded-full"
                                            />

                                        </div>

                                        <div>

                                            <p className="text-gray-700 text-base leading-relaxed mb-4">
                                                {t?.content}
                                            </p>

                                            <div className=" flex text-sm">

                                                <p className="font-medium text-gray-900">{t?.prenom}</p> 

                                                {t?.is_fournisseur && <p className="text-gray-500">✔️</p>} 

                                            </div>

                                            <div className=" flex text-sm">
                                                <p className="font-medium text-gray-900">{t?.profession}</p>
                                            </div>

                                        </div>

                                    </div>

                                </article>
                            )
                        )

                    }

                </div>
            </div>

            {/* Prev / Next buttons */}
            <button
                onClick={() => { stopTimer(); goPrev(); }}
                aria-label="Précédent"
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" transform="rotate(180 10 10)" />
                </svg>

            </button>

            <button
                onClick={() => { stopTimer(); goNext(); }}
                aria-label="Suivant"
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>

            </button>

            {/* Dots / Pagination */}
            <div className="mt-1 flex justify-center gap-3 hidden">

                {
                    testimonials?.map((_, i) => (

                            <button
                                key={i}
                                onClick={() => { stopTimer(); goTo(i); }}
                                className={`w-3 h-3 rounded-full transition-all ${i === index ? "scale-125 bg-indigo-600" : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                aria-label={`Aller au témoignage ${i + 1}`}
                                aria-current={i === index ? "true" : "false"}
                            />
                        )
                    )
                }

            </div>

        </div>
    );
}
