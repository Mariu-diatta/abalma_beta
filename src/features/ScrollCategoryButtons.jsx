
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useDispatch} from 'react-redux';
import { LIST_CATEGORIES } from '../utils';
import { updateCurrentButtonCategoryHover } from '../slices/navigateSlice';
import HoverCategoryProductDisplay from './ProductSpecificPopovViews';
import ListButtonsCategories from './ListButtonsCategories';

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

            <main>

                <HoverCategoryProductDisplay
                    products={products}
                    openModal={openModal}
                    owners={owners}
                    panelRef={panelRef}
                />

            </main>

            <section

                className=" w-full mb-0 sticky top-[10dvh] z-5  py-[0dvh] md:py-0 lg:py-0 bg-none mb-0"
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

                    <ListButtonsCategories

                        categories={categories}

                        setProductSpecificHandler={setProductSpecificHandler}

                        setActiveCategory={setActiveCategory}

                        setActivateButtonCategory={setActivateButtonCategory}

                        activateButtonCategory={activateButtonCategory}

                    />

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

            </section>

        </>
    );
};

export default ScrollableCategoryButtons;

