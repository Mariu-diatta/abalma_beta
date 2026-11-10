import React, { useState, useCallback, useEffect } from 'react';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { useTranslation } from 'react-i18next';
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';

// ─── Icônes ───────────────────────────────────────────────────────────────────

const IconPackage = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
    </svg>
);

const IconTruck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 13 4 4L19 7" />
    </svg>
);

const IconClock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M12 6v6l4 2" />
    </svg>
);

const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
            d="m10.29 3.86-8.16 14.14a2 2 0 0 0 1.71 3h16.32a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" />
    </svg>
);

const IconCopy = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

// ─── Statuts Sendcloud ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    'Processing':        { label: 'En préparation', color: '#64748b', bg: '#f1f5f9', step: 0 },
    'Announced':         { label: 'Annoncé',        color: '#6366f1', bg: '#eef2ff', step: 1 },
    'At sorting center': { label: 'Centre de tri',   color: '#f59e0b', bg: '#fffbeb', step: 2 },
    'In transit':        { label: 'En transit',      color: '#3b82f6', bg: '#eff6ff', step: 3 },
    'Out for delivery':  { label: 'En livraison',    color: '#8b5cf6', bg: '#f5f3ff', step: 4 },
    'Delivered':         { label: 'Livré',           color: '#10b981', bg: '#ecfdf5', step: 5 },
    'Cancelled':         { label: 'Annulé',          color: '#ef4444', bg: '#fef2f2', step: 0 },
    'Failure':           { label: 'Échec',           color: '#ef4444', bg: '#fef2f2', step: 0 },
    'Return':            { label: 'Retour',          color: '#f97316', bg: '#fff7ed', step: 0 },
};

const STEPS = [
    { label: 'Annoncé',      icon: IconPackage },
    { label: 'Centre de tri',icon: IconClock   },
    { label: 'En transit',   icon: IconTruck   },
    { label: 'En livraison', icon: IconTruck   },
    { label: 'Livré',        icon: IconCheck   },
];

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ w = '100%', h = 14, r = 8, style = {} }) => (
    <div className="sc-skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const SkeletonCard = () => (
    <div className="sc-result-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Skeleton w="40%" h={20} />
            <Skeleton w="22%" h={26} r={99} />
        </div>
        <div className="sc-steps-bar">
            {STEPS.map((_, i) => (
                <div key={i} className="sc-step-item">
                    <Skeleton w={36} h={36} r="50%" style={{ flexShrink: 0 }} />
                    <Skeleton w={60} h={10} />
                </div>
            ))}
        </div>
        {[80, 65, 50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <Skeleton w={32} h={32} r={8} style={{ flexShrink: 0 }} />
                <Skeleton w={`${w}%`} h={11} />
            </div>
        ))}
    </div>
);

// ─── Timeline event ───────────────────────────────────────────────────────────
const TimelineEvent = ({ event, isLast }) => {
    const cfg = STATUS_CONFIG[event.status] || { color: '#64748b', bg: '#f8fafc' };
    return (
        <div className="sc-timeline-item">
            <div className="sc-timeline-dot-col">
                <div className="sc-timeline-dot" style={{ background: cfg.bg, borderColor: cfg.color }}>
                    <span style={{ color: cfg.color, lineHeight: 1 }}>
                        <IconClock />
                    </span>
                </div>
                {!isLast && <div className="sc-timeline-line" />}
            </div>
            <div className="sc-timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <span className="sc-event-label">{event.message || event.status}</span>
                    <span className="sc-event-date">{event.timestamp ? new Date(event.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                {event.location && (
                    <span className="sc-event-location">📍 {event.location}</span>
                )}
            </div>
        </div>
    );
};

// ─── Result card ──────────────────────────────────────────────────────────────
const parseAddress = (raw) => {
    try {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return parsed?.city || parsed?.adresse || '';
    } catch {
        return typeof raw === 'string' ? raw : '';
    }
};

const TrackingResult = ({ data }) => {

    const [copied, setCopied] = useState(false);
    const statusCfg = STATUS_CONFIG[data.status] || { label: data.status, color: '#64748b', bg: '#f8fafc', step: 0 };
    const currentStep = statusCfg.step;
    const { t } = useTranslation();

    const copyTracking = () => {
        navigator.clipboard.writeText(data.tracking_number || '').then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="sc-result-card">
            {/* Header */}
            <div className="sc-result-header">
                <div>
                    <p className="sc-result-carrier">{data.carrier || 'Transporteur'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h2 className="sc-result-tracking">{data.tracking_number}</h2>
                        <button className="sc-copy-btn" onClick={copyTracking} title="Copier">
                            {copied ? <IconCheck /> : <IconCopy />}
                        </button>
                    </div>
                </div>
                <span className="sc-status-badge" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                    {statusCfg.label}
                </span>
            </div>

            {/* Barre de progression */}
            {currentStep > 0 && (
                <div className="sc-steps-bar">
                    {STEPS.map((step, idx) => {
                        const stepNum = idx + 1;
                        const done = currentStep >= stepNum;
                        const active = currentStep === stepNum;
                        return (
                            <React.Fragment key={idx}>
                                <div className="sc-step-item">
                                    <div className={`sc-step-circle ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                                        {done ? <IconCheck /> : <span>{stepNum}</span>}
                                    </div>
                                    <span className={`sc-step-label ${active ? 'active' : ''}`}>{step.label}</span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`sc-step-connector ${currentStep > stepNum ? 'done' : ''}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {/* Infos colis */}
            <div className="sc-info-grid">
                {data.parcel_items?.weight && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">⚖️</span>
                        <div>
                            <p className="sc-info-label">{t("weight")}</p>
                            <p className="sc-info-value">{data.parcel_items.weight} kg</p>
                        </div>
                    </div>
                )}
                {data.carrier && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">🚚</span>
                        <div>
                            <p className="sc-info-label">{t("carrier")}</p>
                            <p className="sc-info-value">{data.carrier}</p>
                        </div>
                    </div>
                )}
                {data.expected_delivery && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">📅</span>
                        <div>
                            <p className="sc-info-label">{t("estimated_delivery")}</p>
                            <p className="sc-info-value">{new Date(data.expected_delivery).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>
                    </div>
                )}
                {data.tracking_url && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">🔗</span>
                        <div>
                            <p className="sc-info-label">{t('tracking_link', 'Suivi transporteur')}</p>
                            <a className="sc-info-value underline" href={data.tracking_url} target="_blank" rel="noopener noreferrer">
                                {t('tracking_open', 'Ouvrir le suivi')}
                            </a>
                        </div>
                    </div>
                )}
                {data.address && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">📍</span>
                        <div>
                            <p className="sc-info-label">{t("destination")}</p>
                            <p className="sc-info-value">{parseAddress(data.address)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Timeline */}
            {data.tracking && data.tracking.length > 0 && (
                <div className="sc-timeline-section">
                    <h3 className="sc-timeline-title">{t("tracking_history")}</h3>
                    <div className="sc-timeline">
                        {data.tracking.map((event, i) => (
                            <TimelineEvent key={i} event={event} isLast={i === data.tracking.length - 1} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Liste des commandes (acheteur ou vendeur) ────────────────────────────────
const CommandesList = ({ onSelect, selectedId }) => {
    const { t } = useTranslation();
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;

        api.get(API_ENDPOINTS.DELIVERY.COMMANDES)
            .then(({ data }) => { if (!cancelled) setCommandes(data?.commandes ?? []); })
            .catch(() => { if (!cancelled) setFailed(true); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    if (loading) return <Skeleton h={120} r={12} style={{ marginTop: 24 }} />;

    return (
        <section className="mt-8">
            <TitleCompGenLitle title={t('tracking_orders_title', 'Mes commandes')} />

            {failed && (
                <p className="mt-3 text-sm text-red-500">
                    {t('tracking_orders_error', 'Impossible de charger vos commandes.')}
                </p>
            )}

            {!failed && commandes.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">
                    {t('tracking_orders_empty', 'Aucune commande pour le moment.')}
                </p>
            )}

            {commandes.length > 0 && (
                <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="p-3">{t('tracking_col_order', 'Commande')}</th>
                                <th className="p-3">{t('tracking_col_client', 'Client')}</th>
                                <th className="p-3">{t('tracking_col_status', 'Statut')}</th>
                                <th className="p-3">{t('tracking_col_number', 'N° de suivi')}</th>
                                <th className="p-3 text-center">{t('tracking_col_action', 'Action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {commandes.map((cmd) => {
                                const cfg = STATUS_CONFIG[cmd.shipping_status] || STATUS_CONFIG.Processing;
                                return (
                                    <tr key={cmd.id} className={String(cmd.id) === String(selectedId) ? 'bg-indigo-50' : ''}>
                                        <td className="p-3 font-semibold text-gray-800">
                                            {cmd.numero}
                                            <span className="ml-2 text-[11px] font-medium text-gray-400">
                                                {cmd.role === 'seller' ? t('tracking_role_sale', 'Vente') : t('tracking_role_purchase', 'Achat')}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-600">{cmd.client_nom}</td>
                                        <td className="p-3">
                                            <span className="sc-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {cmd.tracking_number || (
                                                <span className="text-xs text-amber-600">{t('tracking_pending', 'En attente')}</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                type="button"
                                                className="rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => onSelect(cmd.id)}
                                            >
                                                {t('tracking_details', 'Voir détails')}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const RECENT_KEY = 'sc_recent';
const MAX_RECENT = 5;

const readRecent = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        return Array.isArray(stored) ? stored.slice(0, MAX_RECENT) : [];
    } catch {
        return [];
    }
};

const SendcloudTracking = () => {
    const { t } = useTranslation();

    // La recherche se fait par identifiant de COMMANDE (route `commande/<id>/tracking/`).
    // Avant, choisir une commande déjà expédiée remplaçait cet identifiant par le n° de
    // suivi du transporteur, ce qui appelait une URL inexistante (404).
    const [commandeId, setCommandeId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentSearches, setRecentSearches] = useState(readRecent);

    const handleSearch = useCallback(async (id) => {
        const target = String(id ?? '').trim();
        if (!target) return;

        setCommandeId(target);
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data } = await api.get(API_ENDPOINTS.DELIVERY.TRACKING(target));
            setResult(data);

            setRecentSearches((prev) => {
                const next = [target, ...prev.filter((n) => n !== target)].slice(0, MAX_RECENT);
                try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* stockage indisponible */ }
                return next;
            });
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                t('tracking_not_found', 'Commande introuvable. Vérifiez le numéro et réessayez.')
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    return (
        <div className="sc-root px-1" style={{ paddingTop: '10dvh' }}>

            {/* Hero section */}
            <div className="sc-hero">
                <div className="sc-hero-icon">
                    <IconTruck />
                </div>

                <TitleCompGen title={t('tracking_title')} />

                <p className="sc-hero-sub">{t('tracking_subtitle')}</p>
            </div>

            {/* Search bar */}
            <div className="sc-search-wrap">
                <div className="sc-search-box">
                    <span className="sc-search-icon"><IconSearch /></span>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="sc-search-input"
                        placeholder="Ex: 12"
                        value={commandeId}
                        onChange={(e) => setCommandeId(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(commandeId); }}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        type="button"
                        className="sc-search-btn"
                        onClick={() => handleSearch(commandeId)}
                    >
                        {loading ? <span className="sc-spinner" /> : t('TableRecap.searchPlaceholder')}
                    </button>
                </div>

                {/* Recherches récentes */}
                {recentSearches.length > 0 && !result && !loading && (
                    <div className="sc-recents">
                        <p className="sc-recents-label">{t('recent')}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {recentSearches.map((n) => (
                                <button key={n} type="button" className="sc-recent-chip" onClick={() => handleSearch(n)}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Résultats */}
            <div className="sc-results">
                {loading && <SkeletonCard />}

                {error && !loading && (
                    <div className="sc-error-card">
                        <span style={{ color: '#ef4444' }}><IconAlert /></span>
                        <p>{error}</p>
                    </div>
                )}

                {result && !loading && <TrackingResult data={result} />}

                {!result && !loading && !error && (
                    <div className="sc-empty-state">
                        <div className="sc-empty-icon border-0">📦</div>
                        <TitleCompGenLitle title={t('tracking_empty_title')} />
                        <p className="sc-empty-sub">{t('tracking_empty_subtitle')}</p>
                    </div>
                )}
            </div>

            <CommandesList onSelect={handleSearch} selectedId={commandeId} />
        </div>
    );
};

export default SendcloudTracking;
