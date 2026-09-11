import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "../utils";

const CARD_WIDTH_REM = 11;   // largeur d'une carte
const GAP_REM = 1;           // espace entre deux cartes

const PaginationProduit = ({ products = [] }) => {

    const scrollRef = useRef(null);
    const itemRefs = useRef([]);

    /**
     * Convertit rem -> px en tenant compte de la taille de police racine
     */
    const remToPx = (rem) => {
        const rootFontSize =
            parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return rem * rootFontSize;
    };

    /**
     * Navigation boutons — avance/recule d'une carte entière (+ le gap)
     */
    const scroll = (direction) => {
        const track = scrollRef.current;
        if (!track) return;

        const step = remToPx(CARD_WIDTH_REM + GAP_REM);

        track.scrollBy({
            left: direction === "left" ? -step : step,
            behavior: "smooth",
        });
    };

    /**
     * Animation apparition progressive au scroll
     */
    useEffect(() => {
        const observers = [];

        itemRefs.current.forEach((el, index) => {
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            el.style.opacity = "1";
                            el.style.transform = "translateY(0)";
                        }, index * 50);

                        observer.disconnect();
                    }
                },
                { threshold: 0.15 }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => {
            observers.forEach((obs) => obs.disconnect());
        };
    }, [products]);

    if (!products.length) return null;

    return (
        <div className="relative group w-full py-2 overflow-hidden">

            <button
                onClick={() => scroll("left")}
                aria-label="Précédent"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition hidden md:flex"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div
                ref={scrollRef}
                className="fan-track flex overflow-x-auto w-full scroll-smooth pt-4 pb-4 scrollbar-hidden snap-x snap-mandatory"
                style={{
                    gap: `${GAP_REM}rem`,
                    paddingLeft: "max(1rem, calc((100% - 11rem) / 2))",
                    paddingRight: "max(1rem, calc((100% - 11rem) / 2))",
                    scrollPaddingLeft: "max(1rem, calc((100% - 11rem) / 2))",
                    scrollPaddingRight: "max(1rem, calc((100% - 11rem) / 2))",
                }}
            >
                {products.map((product, index) => {
                    const image = product?.variants?.[0]?.image;
                    const name = product?.name ?? `Produit ${index + 1}`;

                    return (
                        <div
                            key={product.id ?? index}
                            ref={(el) => (itemRefs.current[index] = el)}
                            className="fan-item snap-center flex-shrink-0 cursor-pointer relative opacity-0 transition-all duration-300 ease-out rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square hover:shadow-lg hover:-translate-y-1"
                            style={{
                                width: `${CARD_WIDTH_REM}rem`,
                                transform: "translateY(8px)",
                            }}
                        >
                            <img
                                src={getMediaUrl(image)}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />

                            <span
                                className="fan-label absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1"
                            >
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => scroll("right")}
                aria-label="Suivant"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-2 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition hidden md:flex"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default PaginationProduit;