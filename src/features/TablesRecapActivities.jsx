import React, { useEffect, useRef, useState } from 'react';
import ListProductShoppingCart from '../features/ListProductShoppingCart';
import ProductsRecapTable from '../features/ProductRecaptable';
import MyProductList from '../features/MyProductsList';
import MyBlogsList from '../features/ListManagerBlogs';
import TitleCompGen from '../components/TitleComponentGen';
import { useTranslation } from 'react-i18next';
import { MODE } from '../utils';

const TablesRecapActivities = ({ 
    productsTrasactionBought, 
    setProductsTrasactionBought,
    productsTrasactionSell,
    setProductsTrasactionSell
}) => {

    const { t } = useTranslation();

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);


    const [handleButton, setHandleButton] = useState(null);

    const buttons = [
        { id: "Button1", label: t("tableEntries.selectedProducts") },
        { id: "Button3", label: t("myProducts") },
        { id: "Button2", label: t("TableRecap.title") },
        { id: "Button5", label: t("MySales") },
        { id: "Button4", label: t("blog.myBlogs") },
    ];

    useEffect(() => {

        if (!handleButton) return;

        const refsMap = {
            Button1: ref1,
            Button2: ref2,
            Button3: ref3,
            Button4: ref4,
            Button5: ref5,
        };

        const targetRef = refsMap[handleButton];

        targetRef?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

    }, [handleButton]);

    return (
        <div className="fixed absolute w-[98dvw] md:w-[80dvw] sm:rounded-lg style-bg scrollbor_hidden pb-6 overflow-y-auto h-full">

            {/* Title */}
            <div className="mb-6 text-center style_bg">

                <TitleCompGen title={t('Dashboard.welcomeTitle')} />

                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto style_bg">

                    {t('Dashboard.welcomeText')}

                </p>

            </div>

            {/* Buttons */}
            <div className="flex gap-4 py-3 w-full overflow-x-auto overflow-y-hidden">

                {
                    buttons?.map(({ id, label }) => (

                            <button
                                key={id}
                                onClick={() => setHandleButton(id)}
                                className={`shadow-lg whitespace-nowrap cursor-pointer rounded-full px-3 py-1 hover:bg-blue-50
                                ${ (handleButton === id) ? "bg-blue-50" : "bg-gray-50"}`}
                            >
                                {label}

                            </button>
                        )
                    )
                }

            </div>

            {/* Content */}
            <div className="relative overflow-y-auto min-h-[70dvh] w-auto scrollbor_hidden mb-[30dvh] pb-[30dvh] gap-7">

                <div ref={ref1} />
                <ListProductShoppingCart />

                <div ref={ref2} />
                <ProductsRecapTable
                    products={productsTrasactionBought}
                    setProductsTrasaction={setProductsTrasactionBought}
                    title={t('TableRecap.title')}
                    mode={MODE.BUY}
                />

                <div ref={ref5} />
                <ProductsRecapTable
                    products={productsTrasactionSell}
                    setProductsTrasaction={setProductsTrasactionSell}
                    title={t("MySales")}
                    mode={MODE.SELL}
                />

                <div ref={ref3} />
                <MyProductList />

                <div ref={ref4} />
                <MyBlogsList />

            </div>

        </div>
    );
};

export default TablesRecapActivities;
