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
                {data.address && (
                    <div className="sc-info-item">
                        <span className="sc-info-icon">📍</span>
                        <div>
                            <p className="sc-info-label">{t("destination")}</p>
                            <p className="sc-info-value">{data.address.city || data.address}</p>
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

// ─── Composant principal ──────────────────────────────────────────────────────
const SendcloudTracking = () => {
    const { t } = useTranslation();

    const [trackingNumber, setTrackingNumber] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCommande, setSelectedCommande] = useState({});
    const [recentSearches, setRecentSearches] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sc_recent') || '[]'); } catch { return []; }
    });

    useEffect(() => {
        if (selectedCommande?.tracking_number) {
            setTrackingNumber(selectedCommande.tracking_number);
        }
    }, [selectedCommande]);


    useEffect(() => {
        if (trackingNumber) {
            setSelectedCommande({ "id": trackingNumber });
        }
    }, [trackingNumber]);

    const handleSearch = useCallback(async () => {

        if (!selectedCommande?.id) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data } = await api.get(API_ENDPOINTS.DELIVERY.TRACKING(selectedCommande?.id));
            setResult(data);

            // Sauvegarder dans l'historique récent
            setRecentSearches(prev => {
                const updated = 1
                localStorage.setItem('sc_recent', selectedCommande?.id);
                return updated;
            });
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                'Numéro de suivi introuvable. Vérifiez et réessayez.'
            );
        } finally {
            setLoading(false);
        }
    }, [selectedCommande]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="sc-root">

            {/* Hero section */}
            <div className="sc-hero">

                <div className="sc-hero-icon">
                    <IconTruck />
                </div>

                <TitleCompGen
                    title={t("tracking_title")}
                />

                <p className="sc-hero-sub">{t("tracking_subtitle")}</p>

            </div>

            {/* Search bar */}
            <div className="sc-search-wrap">
                <div className="sc-search-box">
                    <span className="sc-search-icon"><IconSearch /></span>
                    <input
                        type="text"
                        className="sc-search-input"
                        placeholder={`Ex: ${selectedCommande?.tracking_number || "2"}`}
                        value={selectedCommande?.id}
                        onChange={e => setTrackingNumber(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <button
                        className="sc-search-btn"
                        onClick={(e) => handleSearch()}
                    >
                        {loading ? (
                            <span className="sc-spinner" />
                        ) : (
                            t("TableRecap.searchPlaceholder")
                        )}
                    </button>
                </div>

                {/* Recherches récentes */}
                {recentSearches.length > 0 && !result && !loading && (
                    <div className="sc-recents">
                        <p className="sc-recents-label">{t("recent")}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {recentSearches.map((n, i) => (
                                <button key={i} className="sc-recent-chip" onClick={() => { setTrackingNumber(n); handleSearch(n); }}>
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
                        <TitleCompGenLitle title={t("tracking_empty_title")} />
                        <p className="sc-empty-sub">{t("tracking_empty_subtitle")}</p>
                    </div>
                )}
            </div>

            <CommandesList setDataTracking={setSelectedCommande} />

        </div>
    );
};

export default SendcloudTracking;


const CommandesList = ({ setDataTracking }) => {

    const [commandes, setCommandes] = useState([]);

    const fetchCommandes = async () => {
        try {
            const response = await api.get(API_ENDPOINTS.DELIVERY.COMMANDES);

            // ⚠️ si api.get = axios, pas besoin de .json()
            const data = response.data;

            setCommandes(data.commandes);
        } catch (error) {
            console.error("Erreur fetch commandes:", error);
        }
    };

    const handleSelectCommande = (cmd) => {
        setDataTracking({
            id: cmd.id,
            tracking_number: cmd.tracking_number,
        })
        console.log("Commande sélectionnée :", cmd.id, cmd.tracking_number);
    };

    useEffect(() => {
        fetchCommandes();
    }, []);

    return (
        <div>
            <h2>Liste des commandes</h2>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Commande</th>
                            <th className="p-3">Client</th>
                            <th className="p-3">Suivi</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {commandes.map((cmd) => (
                            <tr key={cmd.id}>
                                <td className="p-3">{cmd.id}</td>
                                <td className="p-3 fw-semibold">{cmd.numero}</td>
                                <td className="p-3">{cmd.client_nom}</td>

                                <td className="p-3">
                                    {cmd.tracking_number ? (
                                        <span className="badge bg-success">
                                            {cmd.tracking_number}
                                        </span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">
                                            En attente
                                        </span>
                                    )}
                                </td>

                                <td className="p-3 text-center">
                                    <button
                                        className="btn btn-outline-primary btn-sm shadow-md rounded-full p-2"
                                        onClick={() => handleSelectCommande(cmd)}
                                    >
                                        Voir détails
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

