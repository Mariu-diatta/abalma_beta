import React, { useState } from 'react';
import ListProductShoppingCart from '../features/ListProductShoppingCart';
import ProductsRecapTable from '../features/ProductRecaptable';
import MyProductList from '../features/MyProductsList';
import MyBlogsList from '../features/ListManagerBlogs';
import TitleCompGen from '../components/TitleComponentGen';
import { useTranslation } from 'react-i18next';
import { MODE } from '../utils';
import CashTransaction from './CashTransactions';

const TablesRecapActivities = ({ 
    productsTrasactionBought, 
    setProductsTrasactionBought,
    productsTrasactionSell,
    setProductsTrasactionSell
}) => {

    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('listProductShoppingCart');

    const tabs = [
        { id: 'listProductShoppingCart', label: t('tableEntries.selectedProducts') },
        { id: 'productsRecapBought', label: t('TableRecap.title') },
        { id: 'productsRecapSell', label: t("MySales") },
        { id: 'cashTransaction', label: t("transactionByCash") },
        { id: 'myProductList', label: t("myProducts") },
        { id: 'myBlogsList', label: t("blog.myBlogs") },
    ]

    const tabContent = {

        listProductShoppingCart: <ListProductShoppingCart />,

        productsRecapBought: (
            <ProductsRecapTable
                products={productsTrasactionBought}
                setProductsTrasaction={setProductsTrasactionBought}
                title={t('TableRecap.title')}
                mode={MODE.BUY}
            />
        ),

        productsRecapSell: (
            <ProductsRecapTable
                products={productsTrasactionSell}
                setProductsTrasaction={setProductsTrasactionSell}
                title={t("MySales")}
                mode={MODE.SELL}
            />
        ),

        cashTransaction: <CashTransaction />,

        myProductList: <MyProductList />,

        myBlogsList: <MyBlogsList />,
    };


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
                    tabs?.map(tab => (

                            <button
                                type="button"
                                key={tab?.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls={`${tab.id}-tab`}
                                id={`${tab.id}-tab-button`}
                                onClick={() => setActiveTab(tab.id)}
                                className={`border border-gray-50 whitespace-nowrap cursor-pointer rounded-full px-3 py-1 hover:bg-blue-50
                                ${activeTab === tab.id ? "bg-blue-50" : "bg-gray-50"}`}
                            >

                                {tab?.label}

                            </button>
                        )
                    )
                }

            </div>

            {/* Content */}
            <div className="relative overflow-y-auto min-h-[70dvh] w-auto scrollbor_hidden mb-[30dvh] pb-[30dvh] gap-7">

                <section
                    id={`${activeTab}-tab`}
                    role="tabpanel"
                    aria-labelledby={`${activeTab}-tab-button`}
                    className="style_bg dark:bg-gray-800 rounded-lg h-screan overflow-x-auto z-0"
                >
                    {tabContent[activeTab]}

                </section>

            </div>

        </div>
    );
};

export default TablesRecapActivities;
