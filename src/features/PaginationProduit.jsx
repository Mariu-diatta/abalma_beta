import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationProduit = ({ products = [] }) => {
    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(null);

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

    // Scroll pour rendre l'item entièrement visible au clic/survol
    const revealItem = (index) => {
        const el = itemRefs.current[index];
        const track = scrollRef.current;
        if (!el || !track) return;

        const elRect = el.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();

        const overflowRight = elRect.right - trackRect.right;
        const overflowLeft = trackRect.left - elRect.left;

        if (overflowRight > 0) {
            track.scrollBy({ left: overflowRight + 24, behavior: "smooth" });
        } else if (overflowLeft > 0) {
            track.scrollBy({ left: -(overflowLeft + 24), behavior: "smooth" });
        }

        setActiveIndex(index);
    };

    useEffect(() => {
        const observers = [];

        itemRefs.current.forEach((el, i) => {
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            el.classList.add("fan-visible");
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
            <style>{`
        .fan-item {
          opacity: 0;
          transform: translateY(60px) rotate(15deg) scale(0.85);
          transition:
            opacity 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
            transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
            z-index 0s;
          will-change: transform, opacity;
        }
        .fan-item.fan-visible {
          opacity: 1;
        }
        .fan-item:nth-child(odd).fan-visible  { transform: rotate(-2deg); }
        .fan-item:nth-child(even).fan-visible { transform: rotate(1.5deg); }
        .fan-item:nth-child(3n).fan-visible   { transform: rotate(-1deg); }

        .fan-item:hover,
        .fan-item.fan-active {
          transform: translateY(-18px) scale(1.06) rotate(0deg) !important;
          z-index: 10;
        }
        .fan-item:hover .fan-label,
        .fan-item.fan-active .fan-label { opacity: 1; }

        .fan-label {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .fan-track {
          -ms-overflow-style: none;
          scrollbar-width: none;
          /* Centrage si peu d'items */
          justify-content: safe center;
        }
        .fan-track::-webkit-scrollbar { display: none; }
      `}</style>

            <div className="relative group w-full py-6">

                {/* Flèche Gauche */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Track */}
                <div
                    ref={scrollRef}
                    className="fan-track flex overflow-x-auto scroll-smooth pt-14 pb-4 px-4 items-end"
                    style={{ gap: 0 }}
                >
                    {products.map((product, index) => {
                        const image = product?.variants?.[0]?.image;
                        const name = product?.name || `Produit ${index + 1}`;

                        return (
                            <div
                                key={index}
                                ref={(el) => (itemRefs.current[index] = el)}
                                className={`fan-item flex-shrink-0 cursor-pointer relative ${activeIndex === index ? "fan-active" : ""}`}
                                style={{
                                    width: "11rem",
                                    marginLeft: index === 0 ? "0" : "-2.5rem",
                                    zIndex: activeIndex === index ? 10 : 1,
                                    transformOrigin: "bottom center",
                                    transitionDelay: `${index * 0.04}s`,
                                }}
                                onMouseEnter={() => revealItem(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                onClick={() => revealItem(index)}
                            >
                                {/* Card image */}
                                <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center transition-shadow duration-300 hover:shadow-xl">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>

                                {/* Nom au survol */}
                                <p className="fan-label text-center text-xs text-gray-500 mt-2 truncate px-1">
                                    {name}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Flèche Droite */}
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