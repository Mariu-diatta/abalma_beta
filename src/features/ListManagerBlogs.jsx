import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import { formatISODate } from "../utils";
import LoadingCard from "../components/LoardingSpin";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap');

  .mbl * { font-family: 'Figtree', sans-serif; box-sizing: border-box; }

  /* Root */
  .mbl-root { width: 100%; padding: 8px 4px 40px; }

  /* Toolbar */
  .mbl-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .mbl-heading {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  .mbl-heading-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 99px;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    color: #fff;
    font-size: .7rem;
    font-weight: 700;
  }

  /* Recherche */
  .mbl-search-wrap { position: relative; }
  .mbl-search {
    padding: 8px 13px 8px 34px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    font-family: 'Figtree', sans-serif;
    font-size: .875rem;
    color: #0f172a;
    outline: none;
    width: 220px;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .mbl-search:focus {
    border-color: #f59e0b;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(245,158,11,.12);
  }
  .mbl-search-icon {
    position: absolute;
    left: 10px; top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  /* Grille de cartes */
  .mbl-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Carte blog */
  @keyframes mbl-card-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mbl-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid #f1f5f9;
    background: #fff;
    box-shadow: 0 1px 6px rgba(15,23,42,.05);
    transition: box-shadow .18s, border-color .18s, transform .18s;
    animation: mbl-card-in .25s ease both;
  }
  .mbl-card:hover {
    box-shadow: 0 6px 20px rgba(245,158,11,.1);
    border-color: #fde68a;
    transform: translateY(-1px);
  }

  /* Contenu de la carte */
  .mbl-card-body { flex: 1; min-width: 0; }
  .mbl-card-title {
    font-size: .9rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mbl-card-excerpt {
    font-size: .8rem;
    color: #64748b;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .mbl-card-date {
    font-size: .7rem;
    color: #94a3b8;
    font-weight: 500;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Bouton supprimer */
  .mbl-delete-btn {
    flex-shrink: 0;
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid #fee2e2;
    background: #fef2f2;
    color: #ef4444;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s, border-color .15s, transform .12s;
  }
  .mbl-delete-btn:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: #fff;
    transform: scale(1.08);
  }
  .mbl-delete-btn:active { transform: scale(.94); }

  /* État vide */
  .mbl-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 50px 20px;
    color: #94a3b8;
    text-align: center;
  }
  .mbl-empty-icon {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: #fef3c7;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
  }
  .mbl-empty-title { font-size: .95rem; font-weight: 600; color: #64748b; }
  .mbl-empty-sub   { font-size: .8rem; }

  /* Skeleton */
  @keyframes mbl-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .mbl-skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 800px 100%;
    animation: mbl-shimmer 1.4s ease infinite;
    border-radius: 8px;
  }
  .mbl-skeleton-card {
    display: flex;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid #f1f5f9;
    background: #fafafa;
    margin-bottom: 10px;
  }

  /* Pagination */
  .mbl-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
    padding: 10px 4px;
    border-top: 1px solid #f1f5f9;
  }
  .mbl-page-info {
    font-size: .78rem;
    color: #94a3b8;
    font-weight: 500;
  }
  .mbl-page-info strong { color: #f59e0b; }
  .mbl-page-btns { display: flex; gap: 4px; }
  .mbl-page-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .15s, border-color .15s;
  }
  .mbl-page-btn:hover:not(:disabled) { background: #fef3c7; border-color: #fde68a; }
  .mbl-page-btn:disabled { opacity: .35; cursor: not-allowed; }
`;

// ─── Squelette ────────────────────────────────────────────────────────────────
const SkeletonList = () => (
    <div>
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mbl-skeleton-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="mbl-skeleton" style={{ height: 13, width: '55%' }} />
                    <div className="mbl-skeleton" style={{ height: 10, width: '80%' }} />
                    <div className="mbl-skeleton" style={{ height: 10, width: '30%' }} />
                </div>
                <div className="mbl-skeleton" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
            </div>
        ))}
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const MyBlogsList = () => {
    const { t } = useTranslation();
    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [triggerdBtnId, setTriggerdBtnId] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 5;

    // ── Fetch blogs ──
    useEffect(() => {
        if (!currentUser?.id) return;
        setLoading(true);
        api.get('byOwnerUser/')
            .then(({ data }) => setBlogs(data?.data ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [currentUser?.id]);

    // ── Suppression ──
    const handleDelete = async (blog) => {
        if (!window.confirm(t('delete_blog_confirm'))) return;
        setTriggerdBtnId(blog?.id);
        setLoadingDelete(true);
        try {
            await api.delete(`/blogs/${blog.id}/`);
            setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDelete(false);
            setTriggerdBtnId(null);
        }
    };

    // ── Filtrage ──
    const filteredBlogs = useMemo(() =>
        blogs.filter((b) => {
            const q = searchTerm.toLowerCase();
            return (
                b?.title_blog?.toLowerCase().includes(q) ||
                b?.blog_message?.toLowerCase().includes(q)
            );
        }),
        [blogs, searchTerm]
    );

    // ── Pagination ──
    const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedBlogs = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredBlogs.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBlogs, safePage]);

    // Reset page à la recherche
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // ── Rendu ──
    return (
        <>
            <style>{styles}</style>
            <div className="mbl mbl-root">

                {/* Toolbar */}
                <div className="mbl-toolbar">
                    <h2 className="mbl-heading">
                        ✍️ {t('blog.myBlogs')}
                        {!loading && (
                            <span className="mbl-heading-badge">{filteredBlogs.length}</span>
                        )}
                    </h2>

                    <div className="mbl-search-wrap">
                        <span className="mbl-search-icon">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder={t('Search')}
                            className="mbl-search"
                            aria-label="Rechercher un blog"
                        />
                    </div>
                </div>

                {/* Contenu */}
                {loading ? (
                    <SkeletonList />
                ) : paginatedBlogs.length === 0 ? (
                    <div className="mbl-empty">
                        <div className="mbl-empty-icon">📭</div>
                        <p className="mbl-empty-title">
                            {searchTerm ? `Aucun résultat pour "${searchTerm}"` : t('blogNone')}
                        </p>
                        <p className="mbl-empty-sub">
                            {searchTerm ? 'Essayez un autre terme de recherche' : 'Créez votre premier article !'}
                        </p>
                    </div>
                ) : (
                    <div className="mbl-grid">
                        {paginatedBlogs.map((blog, i) => (
                            <div
                                key={blog?.id}
                                className="mbl-card"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="mbl-card-body">
                                    <p className="mbl-card-title">{blog?.title_blog}</p>
                                    <p className="mbl-card-excerpt">{blog?.blog_message}</p>
                                    <p className="mbl-card-date">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 2v3m8-3v3M3 9h18M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
                                        </svg>
                                        {formatISODate(blog?.created_at)}
                                    </p>
                                </div>

                                {loadingDelete && triggerdBtnId === blog?.id ? (
                                    <LoadingCard />
                                ) : (
                                    <button
                                        type="button"
                                        className="mbl-delete-btn"
                                        onClick={() => handleDelete(blog)}
                                        aria-label={t('delete')}
                                        title={t('delete')}
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredBlogs.length > ITEMS_PER_PAGE && (
                    <div className="mbl-pagination">
                        <p className="mbl-page-info">
                            Page <strong>{safePage}</strong> / {totalPages}
                            <span style={{ marginLeft: 8, color: '#cbd5e1' }}>·</span>
                            <span style={{ marginLeft: 8 }}>{filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}</span>
                        </p>
                        <div className="mbl-page-btns">
                            <button
                                type="button"
                                className="mbl-page-btn"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                aria-label="Page précédente"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="mbl-page-btn"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                aria-label="Page suivante"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBlogsList;