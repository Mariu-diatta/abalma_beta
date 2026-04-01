import React, { useEffect, useState, useRef } from "react";
import api from "../services/Axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import OwnerAvatar from "../components/OwnerProfil";


// ─── Filtre options ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ['Tous', 'Online'];

// ─── Squelette de chargement ──────────────────────────────────────────────────
const SkeletonGrid = () => (
    <div className="ucl-grid">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ucl-skeleton-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="ucl-skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="ucl-skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="ucl-skeleton" style={{ height: 10, width: '40%' }} />
                </div>
            </div>
        ))}
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const UsersContactsList = () => {
    const { t } = useTranslation();
    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // ── Fetch contacts ──
    useEffect(() => {
        api.get('clients/othersClients/')
            .then(({ data }) => setUsers(data?.other_clients ?? []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // ── Fermeture dropdown au clic extérieur ──
    useEffect(() => {
        if (!isDropdownOpen) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isDropdownOpen]);

    // ── Filtrage ──
    const normalized = searchTerm.toLowerCase();
    const filteredUsers = users.filter((user) => {
        if (user?.id === currentUser?.id) return false;
        const matchSearch =
            user.nom?.toLowerCase().includes(normalized) ||
            user.email?.toLowerCase().includes(normalized) ||
            user.prenom?.toLowerCase().includes(normalized);
        const matchStatus = statusFilter === 'Tous' || user?.is_connected;
        return matchSearch && matchStatus;
    });

    // ── Rendu ──
    return (
        <>
            <div className="scrollbor_hidden ucl ucl-root ">

                {/* Titre */}
                <h2 className="ucl-heading">
                    <span className="ucl-heading-icon">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 6H5m2 3H5m2 3H5m2 3H5m2 3H5m11-1a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                        </svg>
                    </span>
                    {t('ParamText.title')}
                </h2>

                {/* Toolbar */}
                <div className="ucl-toolbar">
                    {/* Filtre dropdown */}
                    <div className="ucl-filter-wrap" ref={dropdownRef}>
                        <button
                            type="button"
                            className={`ucl-filter-btn ${statusFilter !== 'Tous' ? 'has-filter' : ''}`}
                            onClick={() => setIsDropdownOpen((p) => !p)}
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M7 12h10m-6 6h2" />
                            </svg>
                            {statusFilter === 'Tous' ? t('ParamText.filterAll') : statusFilter}
                            <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="ucl-dropdown" role="listbox">
                                {STATUS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        role="option"
                                        aria-selected={statusFilter === opt}
                                        className={`ucl-dropdown-item ${statusFilter === opt ? 'active' : ''}`}
                                        onClick={() => { setStatusFilter(opt); setIsDropdownOpen(false); }}
                                    >
                                        {opt === 'Online' && (
                                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                        )}
                                        {opt === 'Tous' ? t('ParamText.filterAll') : opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Barre de recherche */}
                    <div className="ucl-search-wrap">
                        <span className="ucl-search-icon">
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ucl-search"
                            placeholder={t('ParamText.searchPlaceholder')}
                            aria-label="Rechercher un contact"
                        />
                    </div>
                </div>

                {/* Compteur */}
                {!loading && (
                    <p className="ucl-count">
                        <strong>{filteredUsers.length}</strong> contact{filteredUsers.length !== 1 ? 's' : ''}
                        {statusFilter !== 'Tous' && ` · ${statusFilter}`}
                        {searchTerm && ` · "${searchTerm}"`}
                    </p>
                )}

                {/* Contenu */}
                {loading ? (
                    <SkeletonGrid />
                ) : filteredUsers.length === 0 ? (
                    <div className="ucl-empty">
                        <div className="ucl-empty-icon">🔍</div>
                        <p className="ucl-empty-title">{t('no_contacts')}</p>
                        <p className="ucl-empty-sub">
                            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : 'Aucun contact disponible'}
                        </p>
                    </div>
                ) : (
                    <div className="ucl-grid">
                        {filteredUsers.map((user, i) => (
                            <div
                                key={user?.id ?? i}
                                className="ucl-card"
                                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
                            >
                                <OwnerAvatar owner={user} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <p className="ucl-card-name">
                                        {user?.prenom} {user?.nom}
                                    </p>
                                    {user?.description && (
                                        <p className="ucl-card-desc">
                                            {user.description.length > 35
                                                ? `${user.description.slice(0, 35)}…`
                                                : user.description}
                                        </p>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default UsersContactsList;