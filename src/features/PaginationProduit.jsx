import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationProduit = ({ products = [] }) => {
    const scrollRef = useRef(null);

    // Fonction pour scroller horizontalement
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === "left"
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: "smooth",
            });
        }
    };

    if (!products.length) return null;

    return (
        <div className="relative group w-full px-4 py-6">

            {/* Flèche Gauche */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Conteneur des Produits */}
            <div
                ref={scrollRef}
                className="
                    flex 
                    gap-6 
                    overflow-x-auto 
                    scroll-smooth
                    /* CENTRAGE MAGIQUE ICI */
                    justify-start md:justify-center 
                    /* -------------------- */
                    pb-4 
                    px-4
                    no-scrollbar
                    snap-x 
                    snap-mandatory
                    w-full
                  "
            >
                {products.map((product, index) => {
                    const image = product?.variants?.[0]?.image;
                    const name = product?.name || `Produit ${index + 1}`;

                    return (
                        <div
                            key={index}
                            className="
                                flex-shrink-0 w-48 md:w-56 
                                snap-start group/item 
                                cursor-pointer
                              "
                        >
                            {/* Card Image */}
                            <div className="rounded-full relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 aspect-square flex items-center justify-center transition-all duration-300 group-hover/item:shadow-xl group-hover/item:border-blue-200">
                                <img
                                    src={image}
                                    alt={name}
                                    className="
                                        w-full h-full object-container m-2 
                                        transition-transform duration-500  
                                        group-hover/item:scale-110
                                      "
                                />
                                {/* Overlay au survol */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Flèche Droite */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Style CSS pour cacher la scrollbar (Inline ou dans votre CSS) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  `}}
            />
        </div>
    );
};

export default PaginationProduit;