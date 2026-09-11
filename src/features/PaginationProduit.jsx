import React, { useRef, useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMediaUrl } from "../utils";

const randomRot = () => (Math.random() - 0.5) * 6;

const CARD_WIDTH_REM = 11;      // largeur d'une carte
const OVERLAP_REM = 1.5;        // chevauchement réduit : ~86% de chaque carte
// reste toujours visible, même non survolée
const STEP_REM = CARD_WIDTH_REM - OVERLAP_REM; // distance réelle entre deux cartes

const PaginationProduit = ({ products = [] }) => {

    const scrollRef = useRef(null);
    const itemRefs = useRef([]);
    const rotationsRef = useRef([]);
    const [activeIndex, setActiveIndex] = useState(null);

    /**
     * Convertit rem -> px en tenant compte de la taille de police racine
     */
    const remToPx = (rem) => {
        const rootFontSize =
            parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return rem * rootFontSize;
    };

    /**
     * Applique la rotation de repos + le z-index par défaut à toutes les cartes
     * (sauf celle actuellement active)
     */
    const applyBaseTransforms =useCallback( () => {
        itemRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === activeIndex) return;

            el.style.transform = `rotate(${rotationsRef.current[i] ?? 0}deg)`;
            // Ordre croissant : chaque carte suivante recouvre légèrement la
            // précédente, mais jamais plus que OVERLAP_REM (~1.5rem sur 11rem).
            el.style.zIndex = String(i + 1);
        });
    }, [activeIndex]);

    /**
     * Initialisation des rotations
     */
    useEffect(() => {
        rotationsRef.current = products.map(() => randomRot());
        requestAnimationFrame(() => {
            applyBaseTransforms();
        });
    }, [products, applyBaseTransforms]);

    /**
     * Navigation boutons — avance/recule d'une carte entière
     */
    const scroll = (direction) => {
        const track = scrollRef.current;
        if (!track) return;

        const step = remToPx(STEP_REM);

        track.scrollBy({
            left: direction === "left" ? -step : step,
            behavior: "smooth",
        });
    };

    /**
     * Vérifie qu'une carte est entièrement visible, la ramène dans le cadre sinon
     */
    const revealItem = (el) => {
        const track = scrollRef.current;
        if (!el || !track) return;

        const item = el.getBoundingClientRect();
        const container = track.getBoundingClientRect();
        const margin = 20;

        if (item.right > container.right) {
            track.scrollBy({ left: item.right - container.right + margin, behavior: "smooth" });
        }
        if (item.left < container.left) {
            track.scrollBy({ left: item.left - container.left - margin, behavior: "smooth" });
        }
    };

    /**
     * Active une carte (hover desktop OU tap mobile) : elle passe entièrement
     * au premier plan, au-dessus de toutes les autres.
     */
    const activateItem = useCallback((index) => {
        const el = itemRefs.current[index];
        if (!el) return;

        revealItem(el);

        el.style.transform = `translateY(-18px) scale(1.08) rotate(0deg)`;
        el.style.zIndex = "50";

        const label = el.querySelector(".fan-label");
        if (label) label.style.opacity = "1";

        setActiveIndex(index);
    }, []);

    /**
     * Désactive une carte et lui redonne sa rotation + son z-index de repos
     */
    const deactivateItem = useCallback((index) => {
        const el = itemRefs.current[index];
        if (!el) return;

        const rotation = randomRot();
        rotationsRef.current[index] = rotation;

        el.style.transform = `rotate(${rotation}deg)`;
        el.style.zIndex = String(index + 1);

        const label = el.querySelector(".fan-label");
        if (label) label.style.opacity = "0";

        setActiveIndex((current) => (current === index ? null : current));
    }, []);

    const handleEnter = useCallback((index) => {
        activateItem(index);
    }, [activateItem]);

    const handleLeave = useCallback((index) => {
        deactivateItem(index);
    }, [deactivateItem]);

    /**
     * Tap sur mobile : bascule active/inactive (pas de hover sur tactile)
     */
    const handleTap = useCallback((index) => {
        setActiveIndex((current) => {
            if (current === index) {
                deactivateItem(index);
                return null;
            }
            if (current !== null) {
                deactivateItem(current);
            }
            activateItem(index);
            return index;
        });
    }, [activateItem, deactivateItem]);

    /**
     * Animation apparition progressive
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
                            el.style.transform = `rotate(${rotationsRef.current[index] ?? 0}deg)`;
                            el.style.zIndex = String(index + 1);
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
                className="absolute left-0 top-1/2 -translate-y-1/2 z-[60] bg-white/90 p-2 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition hidden md:flex"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div
                ref={scrollRef}
                className="fan-track flex justify-end items-center overflow-x-auto w-full scroll-smooth pt-10 pb-4 scrollbar-hidden snap-x snap-mandatory"
                style={{
                    gap: 0,
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
                            className="fan-item snap-center flex-shrink-0 cursor-pointer relative opacity-0 transition-all duration-300 ease-out rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-square hover:shadow-md"
                            style={{
                                width: "11rem",
                                marginLeft: index === 0 ? "0" : `-${OVERLAP_REM}rem`,
                                transformOrigin: "bottom center",
                                zIndex: index + 1,
                            }}
                            onMouseEnter={() => handleEnter(index)}
                            onMouseLeave={() => handleLeave(index)}
                            onTouchStart={() => handleTap(index)}
                            onClick={() => handleTap(index)}
                        >
                            <img
                                src={getMediaUrl(image)}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />

                            <span
                                className="fan-label absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 opacity-0 transition-opacity duration-200"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-[60] bg-white/90 p-2 rounded-full shadow-lg border opacity-0 group-hover:opacity-100 transition hidden md:flex"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default PaginationProduit;