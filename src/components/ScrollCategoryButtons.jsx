
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { updateCategorySelected } from '../slices/navigateSlice';
import { useDispatch } from 'react-redux';
import ProductSpecifiViews from './ProductSpecificPopovViews';
import { LIST_CATEGORIES } from '../utils';

const ScrollableCategoryButtons = ({
    activeCategory,
    setActiveCategory,
    setActiveBtnOver,
    products,
    openModal,
    owners,
   }) => {

    const { t } = useTranslation();

    const dispatch = useDispatch()

    const categories = useMemo(

        () => LIST_CATEGORIES.map((cat) => t(`ListItemsFilterProduct.${cat}`)),

        [t]
    );

    const scrollRef = useRef(null);

    const panelRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);

    const [showRight, setShowRight] = useState(false);

    const [btnId, setBtnId] = useState(false);

    const [productSpecificHandler, setProductSpecificHandler] = useState(null);

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

        if (btnId) {

            setActiveCategory(activeCategory);

            dispatch(updateCategorySelected({ query: "", category: activeCategory }))
        }

    }, [btnId, dispatch, activeCategory, setActiveCategory]);

    useEffect(() => {

        if (productSpecificHandler) {

            setActiveBtnOver(productSpecificHandler);

            dispatch(updateCategorySelected({ query: "", category: productSpecificHandler }))
        }

    }, [productSpecificHandler, setActiveBtnOver, dispatch]);

    return (
        <>
            <ProductSpecifiViews products={products} openModal={openModal} owners={owners} btnId={btnId} panelRef={panelRef}/>

            <div

                className="relative w-full mb-4 sticky top-[50px] z-[7] bg-white"

                style={{

                    backgroundColor: "var(--color-bg)",

                    color: "var(--color-text)"
                }}
            >

                {
                    showLeft && (
                        <button

                            className="absolute left-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"

                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />

                        </button>
                    )
                }

                <div ref={scrollRef} className="overflow-x-auto px-10 scrollbor_hidden_ ">

                    <div className="flex py-2 gap-1">

                        {
                            categories?.map((cat) => (
                                <button
                                    key={cat}
                                    onMouseEnter={() => setBtnId(true)}
                                    onMouseOver={() => setProductSpecificHandler(cat.replace(" ", "_"))}
                                    onClick={() => {
                                        setActiveCategory(cat.replace(" ", "_"));
                                    }}
                                    className={`z-2 whitespace-nowrap px-4  py-2 rounded-full text-sm transition  hover:bg-gradient-to-br hover:from-purple-400 ${(activeCategory.replace(" ", "_")).toLowerCase() === (cat.replace(" ", "_")).toLowerCase()
                                        ? "bg-blue-400 text-white bg-gradient-to-br from-purple-300 to-blue-300" //
                                        : "text-blue-700 border border-blue-300 hover:bg-blue-300 hover:text-white scale-100 hover:scale-110"
                                        }`}
                                >
                                    {cat.replace("_", " ")}
                                </button>
                            ))
                        }

                    </div>

                </div>

                {
                    showRight && (

                        <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-5 bg-white p-2 shadow rounded-full"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />

                        </button>
                    )
                }
            </div>
        </>
    );
};

export default ScrollableCategoryButtons;