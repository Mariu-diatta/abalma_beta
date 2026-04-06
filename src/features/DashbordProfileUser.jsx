import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import UsersContactsList from './ContactUser';
import TablesRecapActivities from './TablesRecapActivities';

const MIN_SWIPE = 50;

const isScrollableX = (el) => {
    while (el && el !== document.body) {
        const { overflowX } = window.getComputedStyle(el);
        if (el.scrollWidth > el.clientWidth && (overflowX === 'auto' || overflowX === 'scroll')) return true;
        el = el.parentElement;
    }
    return false;
};

const Tabs = () => {
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [productsTrasactionBought, setProductsTrasactionBought] = useState([]);
    const [productsTrasactionSell, setProductsTrasactionSell] = useState([]);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

    const navRef = useRef(null);
    const btnRefs = useRef([]);

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const ignoreSwipe = useRef(false);

    const tabs =useMemo(()=> [
        { id: 'dashboard', label: t('Dashboard.dashboard') },
        { id: 'contacts', label: t('Dashboard.contacts') },
    ],[t]);

    // Mesure la pill après que le DOM soit peint
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
    }, [activeTab, tabs]);

    useEffect(() => {
        api.get('product/fournisseur/transaction/')
            .then(({ data }) => setProductsTrasactionBought(data))
            .catch(() => { });
    }, []);

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

    const onTouchStart = (e) => {
        if (isScrollableX(e.target)) { ignoreSwipe.current = true; return; }
        ignoreSwipe.current = false;
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = null;
    };
    const onTouchMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; };
    const onTouchEnd = () => {
        if (ignoreSwipe.current || touchStartX.current === null || touchEndX.current === null) return;
        const dist = touchStartX.current - touchEndX.current;
        if (Math.abs(dist) < MIN_SWIPE) return;
        if (dist > 0 && currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
        if (dist < 0 && currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Rendu du contenu via switch plutôt que par objet (évite d'instancier tous les composants)
    const renderContent = (activeTab) => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <TablesRecapActivities
                        productsTrasactionBought={productsTrasactionBought}
                        setProductsTrasactionBought={setProductsTrasactionBought}
                        productsTrasactionSell={productsTrasactionSell}
                        setProductsTrasactionSell={setProductsTrasactionSell}
                    />
                );
            case 'contacts':
                return <UsersContactsList />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="tabs-root" style={{ width: '100%', paddingTop: 20 }}>

                <nav className="tabs-nav-wrap mt-8 md:mt-0" role="tablist" aria-label="Onglets principaux">
                    <div ref={navRef} className="tabs-nav">
                        {pillStyle.width > 0 && (
                            <span
                                className="tabs-pill"
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
                                className={`tabs-btn${activeTab === tab.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="tabs-dots" aria-hidden="true">
                    {tabs.map((tab) => (
                        <span key={tab.id} className={`tabs-dot${activeTab === tab.id ? ' active' : ''}`} />
                    ))}
                </div>

                <section
                    id={`${activeTab}-panel`}
                    role="tabpanel"
                    aria-labelledby={`${activeTab}-tab`}
                    className="tabs-panel"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div key={activeTab} className="tabs-panel-inner">
                        {renderContent(activeTab)}
                    </div>
                </section>

            </div>
        </>
    );
};

export default Tabs;