
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useDispatch} from 'react-redux';
import { LIST_CATEGORIES } from '../utils';
import { updateCurrentButtonCategoryHover } from '../slices/navigateSlice';
import ProductSpecifiViews from './ProductSpecificPopovViews';

const ScrollableCategoryButtons = ({
    setActiveCategory,
    setActiveBtnOver,
    products,
    openModal,
    owners,
   }) => {

    const { t } = useTranslation();

    const dispatch = useDispatch()

    const categories = useMemo(

        () => LIST_CATEGORIES?.map((cat) => t(`ListItemsFilterProduct.${cat}`)),

        [t]
    );

    const scrollRef = useRef(null);

    const panelRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);

    const [showRight, setShowRight] = useState(false);

    const [productSpecificHandler, setProductSpecificHandler] = useState(null);

    const [activateButtonCategory, setActivateButtonCategory] = useState(null);

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

        if (productSpecificHandler) {

            setActiveBtnOver(productSpecificHandler);

            dispatch(updateCurrentButtonCategoryHover(productSpecificHandler))
        }

    }, [productSpecificHandler, setActiveBtnOver, dispatch]);

    return (

        <>
            <ProductSpecifiViews products={products} openModal={openModal} owners={owners} panelRef={panelRef}/>

            <div

                className=" w-full mb-4 sticky top-[45px] z-[7]  mt-[30px] bg-none"

           >

                {
                    showLeft && (
                        <button

                            className="absolute left-0 top-1/2 -translate-y-1/2 z-5 p-2 shadow rounded-full bg-none"

                            style={{

                                backgroundColor: "var(--color-bg)",

                                color: "var(--color-text)"
                            }}

                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />

                        </button>
                    )
                }

                <div
                    ref={scrollRef}

                    className="overflow-x-auto px-10 scrollbor_hidden_ bg-none"
                >

                    <div
                        className="flex py-2 gap-1 bg-none"
                    >

                        {
                            categories?.map((cat) => (

                                <button

                                    key={cat}

                                    onMouseOver={
                                        () => setProductSpecificHandler(cat?.replace("_", ""))
                                    }

                                    style={
                                        {
                                            backgroundColor: "var(--color-bg)",
                                            color: "var(--color-text)"
                                        }
                                    }

                                    onClick={
                                        () => {
                                            setActiveCategory(cat?.replace("_", " "));
                                            setActivateButtonCategory(cat?.replace("_", " "))
                                        }
                                    }

                                    className={`
                                        z-2 whitespace-nowrap px-4  py-1 rounded-full text-sm transition  hover:bg-gradient-to-br hover:from-purple-100 
                                        ${activateButtonCategory?.toLowerCase() === (cat?.replace("_", ""))?.toLowerCase()
                                        ? "bg-blue-50 text-white bg-gradient-to-br from-purple-50 to-blue-100" //
                                        : "text-blue-100 border border-blue-50 hover:bg-blue-100 hover:text-white scale-100 hover:scale-100 hover:shadow-lg"
                                        }`}
                                >
                                    {cat?.replace("_", " ")}

                                </button>
                            ))
                        }

                    </div>

                </div>

                {
                    showRight && (

                        <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-5 p-2 shadow rounded-full"
                            onClick={() => scroll("right")}
                            style={{

                                backgroundColor: "var(--color-bg)",

                                color: "var(--color-text)"
                            }}
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