import React, { useState, useRef, useLayoutEffect, useMemo } from 'react';
import ListProductShoppingCart from '../features/ListProductShoppingCart';
import ProductsRecapTable from '../features/ProductRecaptable';
import MyProductList from '../features/MyProductsList';
import MyBlogsList from '../features/ListManagerBlogs';
import { useTranslation } from 'react-i18next';
import { MODE } from '../utils';
import CashTransaction from './CashTransactions';


// ─── Composant ────────────────────────────────────────────────────────────────
const TablesRecapActivities = ({
    productsTrasactionBought,
    setProductsTrasactionBought,
    productsTrasactionSell,
    setProductsTrasactionSell,
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('listProductShoppingCart');
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

    const navRef = useRef(null);
    const btnRefs = useRef([]);

    const tabs =useMemo(()=> [
        {
            id: 'listProductShoppingCart', label: t('tableEntries.selectedProducts'),
            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                  </svg>
        },
        {
            id: 'productsRecapBought', label: t('TableRecap.title'),
            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 18h14M5 18v3h14v-3M5 18l1-9h12l1 9M16 6v3m-4-3v3m-2-6h8v3h-8V3Zm-1 9h.01v.01H9V12Zm3 0h.01v.01H12V12Zm3 0h.01v.01H15V12Zm-6 3h.01v.01H9V15Zm3 0h.01v.01H12V15Zm3 0h.01v.01H15V15Z" />
                  </svg>
        },
        {
            id: 'productsRecapSell', label: t('MySales'),
            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z" />
                  </svg>
        },
        {
            id: 'cashTransaction', label: t('transactionByCash'),
            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                  </svg>
        },
        {
            id: 'myProductList', label: t('myProducts'),
            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                  </svg>
        },
        {
            id: 'myBlogsList', label: t('blog.myBlogs'), 

            icon: <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd" />
                  </svg>
            },
    ],[t]);

    // ── Mesure de la pill après paint ──
    useLayoutEffect(() => {
        const id = requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                const idx = tabs.findIndex((tab) => tab.id === activeTab);
                const btn = btnRefs.current[idx];
                const nav = navRef.current;
                if (!btn || !nav) return;
                const nr = nav.getBoundingClientRect();
                const br = btn.getBoundingClientRect();
                setPillStyle({ left: br.left - nr.left, width: br.width });
            })
        );
        return () => cancelAnimationFrame(id);
    }, [tabs,activeTab]);

    // ── Rendu du contenu (switch évite d'instancier tous les composants) ──
    const renderContent = () => {
        switch (activeTab) {
            case 'listProductShoppingCart':
                return <ListProductShoppingCart />;
            case 'productsRecapBought':
                return (
                    <ProductsRecapTable
                        products={productsTrasactionBought}
                        setProductsTrasaction={setProductsTrasactionBought}
                        title={t('TableRecap.title')}
                        mode={MODE.BUY}
                    />
                );
            case 'productsRecapSell':
                return (
                    <ProductsRecapTable
                        products={productsTrasactionSell}
                        setProductsTrasaction={setProductsTrasactionSell}
                        title={t('MySales')}
                        mode={MODE.SELL}
                    />
                );
            case 'cashTransaction':
                return <CashTransaction />;
            case 'myProductList':
                return <MyProductList />;
            case 'myBlogsList':
                return <MyBlogsList />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="tra-root">

                {/* Header */}
                <div className="tra-header">
                    <h1 className="tra-title">{t('Dashboard.welcomeTitle')}</h1>
                    <p className="tra-subtitle">{t('Dashboard.welcomeText')}</p>
                </div>

                {/* Navigation tabs */}
                <div className="tra-nav-outer">
                    <div className="tra-nav-scroll">
                        <div ref={navRef} className="tra-nav">
                            {/* Pill glissante */}
                            {pillStyle.width > 0 && (
                                <span
                                    className="tra-pill"
                                    style={{ left: pillStyle.left, width: pillStyle.width }}
                                    aria-hidden="true"
                                />
                            )}

                            {tabs.map((tab, idx) => (
                                <button
                                    key={tab.id}
                                    ref={(el) => { btnRefs.current[idx] = el; }}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`${tab.id}-panel`}
                                    id={`${tab.id}-tab`}
                                    className={`tra-btn${activeTab === tab.id ? ' active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span aria-hidden="true">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dots mobile */}
                <div className="tra-dots" aria-hidden="true">
                    {tabs.map((tab) => (
                        <span
                            key={tab.id}
                            className={`tra-dot${activeTab === tab.id ? ' active' : ''}`}
                        />
                    ))}
                </div>

                {/* Contenu */}
                <div className="tra-panel-wrap">
                    <section
                        key={activeTab}
                        id={`${activeTab}-panel`}
                        role="tabpanel"
                        aria-labelledby={`${activeTab}-tab`}
                    >
                        <div className="tra-panel-inner">
                            {renderContent()}
                        </div>
                    </section>
                </div>

            </div>
        </>
    );
};

export default TablesRecapActivities;