import React, { useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "../utils";

const randomRot = () => (Math.random() - 0.5) * 6; // Entre -3deg et +3deg

const PaginationProduit = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const rotationsRef = useRef([]); // Stocké en ref, pas en state → pas de re-render

    // Init des rotations
    useEffect(() => {
        rotationsRef.current = products.map(() => randomRot());
        applyRotations();
    }, [products]);

    // Applique directement les rotations via le DOM, sans re-render React
    const applyRotations = () => {
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const rot = rotationsRef.current[i] ?? 0;
            el.style.transform = `rotate(${rot}deg)`;
            el.style.zIndex = "1";
        });
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            scrollRef.current.scrollTo({
                left: direction === "left"
                    ? scrollLeft - clientWidth * 0.6
                    : scrollLeft + clientWidth * 0.6,
                behavior: "smooth",
            });
        }
    };

    const revealItem = (el, track) => {
        if (!el || !track) return;
        const elRect = el.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const overflowRight = elRect.right - trackRect.right;
        const overflowLeft = trackRect.left - elRect.left;
        if (overflowRight > 0) track.scrollBy({ left: overflowRight + 24, behavior: "smooth" });
        else if (overflowLeft > 0) track.scrollBy({ left: -(overflowLeft + 24), behavior: "smooth" });
    };

    const handleEnter = useCallback((index) => {
        const el = itemRefs.current[index];
        if (!el) return;

        // Révéler si partiellement caché
        revealItem(el, scrollRef.current);

        // Monter au premier plan immédiatement via DOM
        el.style.transform = "translateY(-18px) scale(1.06) rotate(0deg)";
        el.style.zIndex = "10";
        el.querySelector(".fan-label").style.opacity = "1";
    }, []);

    const handleLeave = useCallback((index) => {
        const el = itemRefs.current[index];
        if (!el) return;

        // Nouvelle rotation aléatoire tirée MAINTENANT, appliquée immédiatement
        const newRot = randomRot();
        rotationsRef.current[index] = newRot;

        el.style.transform = `rotate(${newRot}deg)`;
        el.style.zIndex = "1";
        el.querySelector(".fan-label").style.opacity = "0";
    }, []);

    useEffect(() => {
        const observers = [];
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            el.classList.add("fan-visible");
                            el.style.transform = `rotate(${rotationsRef.current[i] ?? 0}deg)`;
                        }, i * 60);
                        obs.unobserve(el);
                    }
                },
                { threshold: 0.2 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [products]);

    if (!products.length) return null;

    return (
        <>

            <div className="relative group w-full py-2">

                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                    ref={scrollRef}
                    className="fan-track flex overflow-x-auto scroll-smooth pt-10 pb-4 px-4 items-end"
                    style={{ gap: 0 }}
                >
                    {products.map((product, index) => {
                        const image = product?.variants?.[0]?.image;
                        const name = product?.name || `Produit ${index + 1}`;

                        return (
                            <div
                                key={index}
                                ref={(el) => (itemRefs.current[index] = el)}
                                className="fan-item flex-shrink-0 cursor-pointer relative"
                                style={{
                                    width: "11rem",
                                    marginLeft: index === 0 ? "0" : "-2.5rem",
                                    transformOrigin: "bottom center",
                                }}
                                onMouseEnter={() => handleEnter(index)}
                                onMouseLeave={() => handleLeave(index)}
                                onClick={() => handleEnter(index)}
                            >
                                <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center transition-shadow duration-300 hover:shadow-xl">
                                    <img
                                        src={getMediaUrl(image)}
                                        alt={name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <p className="fan-label text-center text-xs text-gray-500 mt-2 truncate px-1">
                                    {name}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </>
    );
};

export default PaginationProduit;