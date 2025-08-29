
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { updateCategorySelected } from '../slices/navigateSlice';
import { useDispatch } from 'react-redux';
import ImageGallery from './ImageGallery';
import Carousel from './CarrouselProducts';
import ImageGalleryPan from './ImageGalleryPanel';

const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory, products }) => {

    const { t } = useTranslation();

    const dispatch = useDispatch()

    const categories = useMemo(
        () =>
            [
                "All",
                "JOUET",
                "HABITS",
                "MATERIELS_INFORMATIQUES",
                "CAHIERS",
                "SACS",
                "LIVRES",
                "ELECTROMENAGER",
                "TELEPHONIE",
                "ACCESSOIRES",
                "SPORT",
                "JEUX_VIDEO",
                "MEUBLES",
                "VEHICULES",
                "FOURNITURES_SCOLAIRES",
                "DIVERS",
            ].map((cat) => t(`ListItemsFilterProduct.${cat}`)),
        [t]
    );

    const scrollRef = useRef(null);
    const panelRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [btnId, setBtnId] = useState(false);
    const [btnOver, setBtnOver] = useState(null);

    const updateButtonsVisibility = useCallback(() => {

        const container = scrollRef.current;

        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setShowLeft(scrollLeft > 0);

        setShowRight(scrollLeft + clientWidth < scrollWidth - 1);

    }, []);

    const scroll = useCallback(

        (direction) => {

            scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
        },
        []
    );

    useEffect(() => {

        const container = scrollRef.current;

        if (!container) return;

        updateButtonsVisibility();

        container.addEventListener("scroll", updateButtonsVisibility);

        window.addEventListener("resize", updateButtonsVisibility);

        return () => {

            container.removeEventListener("scroll", updateButtonsVisibility);

            window.removeEventListener("resize", updateButtonsVisibility);
        };

    }, [updateButtonsVisibility]);

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (panelRef.current && !panelRef.current.contains(e.target) && !scrollRef.current.contains(e.target)) {

                setBtnId(false);
            }
        };

        document.addEventListener("dblclick", handleClickOutside);

        return () => document.removeEventListener("dblclick", handleClickOutside);

    }, []);

    useEffect(() => {

        if (btnOver) {

            setActiveCategory(btnOver);

            dispatch(updateCategorySelected({ query: "", category: activeCategory }))
        }

    }, [btnOver, setActiveCategory, dispatch, activeCategory]);

    return (
        <>
            <div
                ref={panelRef}
                className={`${btnId && products?.length ? "flex gap-2 bg-grey-9000 shadow-lg rounded-md h-70 lg:h-70 w-full" : "hidden"}`}
            >
                <div style={{ flex: 2 }} className="hidden lg:block">
                    <ImageGallery imagesEls={products} />
                </div>

                <div style={{ flex: 3 }}>
                    <Carousel products={products} />
                </div>

                <div style={{ flex: 2 }}>
                    <ImageGalleryPan imagesEls={products} />
                </div>
            </div>

            <div className="relative w-full mb-4 sticky top-[50px] z-[7] ">

                {showLeft && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}

                <div ref={scrollRef} className="overflow-x-auto px-10 scrollbor_hidden_ ">
                    <div className="flex py-2">
                        {categories?.map((cat) => (
                            <button
                                key={cat}
                                onMouseEnter={() => setBtnId(true)}
                                onMouseOver={() => setBtnOver(cat)}
                                onClick={() => setActiveCategory(cat.replace(" ", "_"))}
                                className={`z-2 whitespace-nowrap px-4  py-2 rounded-full text-sm transition ${activeCategory === cat
                                    ? "bg-blue-400 text-white"
                                    : "text-blue-700 border border-blue-300 hover:bg-blue-300 hover:text-white scale-80 hover:scale-300"
                                    }`}
                            >
                                {cat.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {showRight && (

                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />

                    </button>
                )}
            </div>
        </>
    );
};

export default ScrollableCategoryButtons;