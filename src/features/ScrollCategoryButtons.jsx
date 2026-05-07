
import React, { useEffect, useMemo, useState } from 'react';
import { useRef, } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch} from 'react-redux';
import { LIST_CATEGORIES_KEYS } from '../utils';
import { updateCurrentButtonCategoryHover } from '../slices/navigateSlice';
import HoverCategoryProductDisplay from './ProductSpecificPopovViews';
import ListButtonsCategories from './ListButtonsCategories';
import bg_image from '../assets/bg_image_.jpg'
import TitleCompGen from '../components/TitleComponentGen';

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

        () => LIST_CATEGORIES_KEYS?.map((cat) => t(`ListItemsFilterProduct.${cat}`)),

        [t]
    );

    const panelRef = useRef(null);

    const [productSpecificHandler, setProductSpecificHandler] = useState(null);

    const [activateButtonCategory, setActivateButtonCategory] = useState(null);



    useEffect(() => {

        if (productSpecificHandler) {

            setActiveBtnOver(productSpecificHandler);

            dispatch(updateCurrentButtonCategoryHover(productSpecificHandler))
        }

    }, [productSpecificHandler, setActiveBtnOver, dispatch]);

    return (

        <>

            <ListButtonsCategories

                categories={categories}

                setProductSpecificHandler={setProductSpecificHandler}

                setActiveCategory={setActiveCategory}

                setActivateButtonCategory={setActivateButtonCategory}

                activateButtonCategory={activateButtonCategory}

            />

            {/* ========= HERO / Intro ========= */}
            <section className="max-w-screen-md mx-auto text-center mb-10 relative w-full px-2 text-[10px] md:text-[15px] translate-y-0 transition-all duration-1000 ease-in-out">

                <header>

                    <div
                        className={`
                            inset-0 bg-cover bg-center blur-xl scale-110 `}
                        style={{
                            backgroundImage: `url(${bg_image})`,
                        }}
                    />

                    <div className="m-auto text-center">
                        <TitleCompGen title={t('homePan.title')} />
                    </div>

                    <p className="text-gray-600 text-md">
                        {t('homePan.content')}
                    </p>

                </header>
            </section>

            <main>

                <HoverCategoryProductDisplay
                    products={products}
                    openModal={openModal}
                    owners={owners}
                    panelRef={panelRef}
                />

            </main>

        </>
    );
};

export default ScrollableCategoryButtons;

