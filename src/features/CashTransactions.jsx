import { useEffect, useState, useCallback } from 'react';
import api from '../services/Axios';
import CashTransactionCard from './CashTransactionCard';
import { useTranslation } from 'react-i18next';


// ─── Squelette de chargement ──────────────────────────────────────────────────
const SkeletonGrid = () => (
    <div className="ct-grid">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ct-skeleton-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="ct-skeleton" style={{ height: 14, width: '45%' }} />
                    <div className="ct-skeleton" style={{ height: 18, width: '22%', borderRadius: 99 }} />
                </div>
                {[70, 55, 40].map((w, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div className="ct-skeleton" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }} />
                        <div className="ct-skeleton" style={{ height: 10, width: `${w}%` }} />
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <div className="ct-skeleton" style={{ height: 22, width: '30%', borderRadius: 99 }} />
                    <div className="ct-skeleton" style={{ height: 32, width: '30%', borderRadius: 10 }} />
                </div>
            </div>
        ))}
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const CashTransaction = () => {
    const { t } = useTranslation();

    const [transactions, setTransactions] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSearchMode, setIsSearchMode] = useState(false);

    // ── Chargement initial ──
    useEffect(() => {
        setLoading(true);
        api.get('/cashtransaction')
            .then(({ data }) => setTransactions(data))
            .catch((err) => console.error('Erreur liste:', err))
            .finally(() => setLoading(false));
    }, []);

    // ── Recherche ──
    const search = useCallback(async () => {
        const query = searchValue.trim();
        if (!query) return;
        setLoading(true);
        setIsSearchMode(true);
        try {
            const { data } = await api.get(`/cashtransaction/${encodeURIComponent(query)}/`);
            setTransactions(Array.isArray(data) ? data : [data]);
        } catch (err) {
            console.error('Erreur search:', err);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [searchValue]);

    const resetSearch = () => {
        setSearchValue('');
        setIsSearchMode(false);
        setLoading(true);
        api.get('/cashtransaction')
            .then(({ data }) => setTransactions(data))
            .catch((err) => console.error('Erreur reset:', err))
            .finally(() => setLoading(false));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') search();
    };

    // ── Rendu ──
    return (
        <>
            <div className="ct-root ct-wrap">

                {/* Toolbar */}
                <div className="ct-toolbar">
                    <h2 className="ct-title">
                        💵 {t('paymentMode')}
                        {!loading && transactions.length > 0 && (
                            <span className="ct-title-badge">{transactions.length}</span>
                        )}
                    </h2>

                    <div className="ct-search-form" role="search">
                        <div className="ct-search-wrap">
                            <span className="ct-search-icon" aria-hidden="true">
                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </span>
                            <input
                                type="search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t('search')}
                                className="ct-search-input"
                                aria-label={t('search')}
                            />
                        </div>

                        <button type="button" onClick={search} className="ct-search-btn">
                            {t('search') || 'Chercher'}
                        </button>

                        {isSearchMode && (
                            <button
                                type="button"
                                onClick={resetSearch}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1, padding: '4px', flexShrink: 0 }}
                                aria-label="Réinitialiser la recherche"
                                title="Réinitialiser"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Contenu */}
                {loading ? (
                    <SkeletonGrid />
                ) : transactions.length > 0 ? (
                    <div className="ct-grid">
                        {transactions.map((item) => (
                            <CashTransactionCard
                                key={item.id}
                                transaction={item}
                                setSearchTransactionByCode={setTransactions}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="ct-empty">
                        <div className="ct-empty-icon">💸</div>
                        <p className="ct-empty-title">
                            {isSearchMode ? `Aucun résultat pour "${searchValue}"` : t('no_cash_trans')}
                        </p>
                        {isSearchMode && (
                            <p className="ct-empty-sub">
                                <button
                                    type="button"
                                    onClick={resetSearch}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontWeight: 600, fontSize: '.8rem', padding: 0 }}
                                >
                                    Voir toutes les transactions
                                </button>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CashTransaction;