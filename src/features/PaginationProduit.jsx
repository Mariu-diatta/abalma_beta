import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getRandomRotation = () => {
    const rotations = [-3, -2, -1.5, -1, 0.5, 1, 1.5, 2, 2.5, 3];
    return rotations[Math.floor(Math.random() * rotations.length)];
};

const PaginationProduit = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [rotations, setRotations] = useState([]);

    // Générer les rotations initiales aléatoires
    useEffect(() => {
        setRotations(products.map(() => getRandomRotation()));
    }, [products]);

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

    const handleEnter = (index) => {
        // Scroll pour révéler l'item si partiellement caché
        const el = itemRefs.current[index];
        const track = scrollRef.current;
        if (el && track) {
            const elRect = el.getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            const overflowRight = elRect.right - trackRect.right;
            const overflowLeft = trackRect.left - elRect.left;
            if (overflowRight > 0) track.scrollBy({ left: overflowRight + 24, behavior: "smooth" });
            else if (overflowLeft > 0) track.scrollBy({ left: -(overflowLeft + 24), behavior: "smooth" });
        }
        setActiveIndex(index);
    };

    const handleLeave = (index) => {
        // Nouvelle rotation aléatoire au retour
        setRotations((prev) => {
            const next = [...prev];
            next[index] = getRandomRotation();
            return next;
        });
        setActiveIndex(null);
    };

    useEffect(() => {
        const observers = [];
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => el.classList.add("fan-visible"), i * 60);
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
            <div className="relative group w-full py-6">

                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                    ref={scrollRef}
                    className="fan-track flex overflow-x-auto scroll-smooth pt-14 pb-4 px-4 items-end"
                    style={{ gap: 0 }}
                >
                    {products.map((product, index) => {
                        const image = product?.variants?.[0]?.image;
                        const name = product?.name || `Produit ${index + 1}`;
                        const isActive = activeIndex === index;
                        const rot = rotations[index] ?? 0;

                        return (
                            <div
                                key={index}
                                ref={(el) => (itemRefs.current[index] = el)}
                                className={`fan-item flex-shrink-0 cursor-pointer relative ${isActive ? "fan-active" : "fan-visible"}`}
                                style={{
                                    width: "11rem",
                                    marginLeft: index === 0 ? "0" : "-2.5rem",
                                    zIndex: isActive ? 10 : 1,
                                    transformOrigin: "bottom center",
                                    // Active : monte et se redresse / Repos : rotation aléatoire
                                    transform: isActive
                                        ? "translateY(-18px) scale(1.06) rotate(0deg)"
                                        : `rotate(${rot}deg)`,
                                }}
                                onMouseEnter={() => handleEnter(index)}
                                onMouseLeave={() => handleLeave(index)}
                                onClick={() => handleEnter(index)}
                            >
                                <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center transition-shadow duration-300 hover:shadow-xl">
                                    <img
                                        src={image}
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