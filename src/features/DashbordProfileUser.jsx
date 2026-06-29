import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import UsersContactsList from './ContactUser';
import TablesRecapActivities from './TablesRecapActivities';
import SendcloudTracking from './SendcloudTracking';

const MIN_SWIPE = 50;

const isScrollableX = (el) => {
    while (el && el !== document.body) {
        const { overflowX } = window.getComputedStyle(el);
        if (el.scrollWidth > el.clientWidth && (overflowX === 'auto' || overflowX === 'scroll')) return true;
        el = el.parentElement;
    }
    return false;
};

// ─── Icônes onglets ───────────────────────────────────────────────────────────

const IconDashboard = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M3 3h7v9H3zM3 16h7v5H3zM14 12h7v8h-7zM14 3h7v5h-7z" />
    </svg>
);

const IconContacts = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconTracking = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
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

    const tabs = useMemo(() => [
        { id: 'dashboard', label: t('Dashboard.dashboard'), icon: <IconDashboard /> },
        { id: 'contacts',  label: t('Dashboard.contacts'),  icon: <IconContacts />  },
        { id: 'tracking',  label: 'Suivi colis',           icon: <IconTracking />  },
    ], [t]);

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
            case 'tracking':
                return <SendcloudTracking />;
            default:
                return null;
        }
    };

    return (
        <div className="dtabs-root" >
            {/* Nav tabs améliorée */}
            <nav className="dtabs-nav-wrap" role="tablist" aria-label="Onglets principaux">
                <div ref={navRef} className="dtabs-nav">
                    {pillStyle.width > 0 && (
                        <span className="dtabs-pill" style={{ left: pillStyle.left, width: pillStyle.width }} aria-hidden="true" />
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
                            className={`dtabs-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="dtabs-btn-icon" aria-hidden="true">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Dots mobile */}
            <div className="dtabs-dots" aria-hidden="true">
                {tabs.map((tab) => (
                    <span key={tab.id} className={`dtabs-dot ${activeTab === tab.id ? 'active' : ''}`} />
                ))}
            </div>

            {/* Contenu */}
            <section
                id={`${activeTab}-panel`}
                role="tabpanel"
                aria-labelledby={`${activeTab}-tab`}
                className="dtabs-panel"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div key={activeTab} className="dtabs-panel-inner">
                    {renderContent(activeTab)}
                </div>
            </section>
        </div>
    );
};

export default Tabs;
