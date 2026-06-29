import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import { formatISODate } from "../utils";
import LoadingCard from "../components/LoardingSpin";
import { TitleCompGenLitle } from "../components/TitleComponentGen";



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
            <div className="mbl mbl-root">

                {/* Toolbar */}
                <div className="mbl-toolbar">
                    <h2 className="mbl-heading">
                        ✍️ <TitleCompGenLitle title={t('blog.myBlogs')} />
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
                                {searchTerm ? `${t('NoResultBlog')} "${searchTerm}"` : t('blogNone')}
                        </p>
                        <p className="mbl-empty-sub">
                                {searchTerm ? t('tryAnotherSearch') : t('createFirstItem')}
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
                                    <soan className="mbl-card-date">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 2v3m8-3v3M3 9h18M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
                                        </svg>
                                        {formatISODate(blog?.created_at)}
                                    </soan>
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
                        <div className="mbl-page-info">
                            Page <strong>{safePage}</strong> / {totalPages}
                            <span style={{ marginLeft: 8, color: '#cbd5e1' }}>·</span>
                            <span style={{ marginLeft: 8 }}>{filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}</span>
                        </div>
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