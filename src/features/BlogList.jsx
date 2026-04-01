import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BlogCard from './BlogCard';
import BlogDetails from './BlogDetails';
import NoContentComp from '../components/NoContentComp';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  .bl-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

  /* Grille */
  .bl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 8px 4px 60px;
    align-content: start;
  }

  /* Etat vide */
  .bl-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 32px 16px;
    text-align: center;
    grid-column: 1 / -1;
  }
  .bl-empty-text {
    font-family: 'Lora', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: #64748b;
  }

  /* Bouton retour */
  .bl-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: .875rem;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    margin-bottom: 16px;
    transition: background .15s, border-color .15s, transform .12s;
  }
  .bl-back-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateX(-2px);
  }

  /* Animation d'entrée des cartes */
  @keyframes bl-card-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bl-card-wrap {
    animation: bl-card-in .3s ease both;
  }
`;

// ─── Illustration vide (SVG allégé) ──────────────────────────────────────────
const EmptyIllustration = () => (
    <svg
        width="220" height="160"
        viewBox="0 0 806 593"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ opacity: .75 }}
    >
        <path d="M39 69H707L707 587C707 590.314 704.314 593 701 593H45.9886C42.6793 593 39.9949 590.321 39.9886 587.011L39 69Z" fill="#f1f0fd" />
        <path d="M40 56.0003C39.9998 52.6865 42.6862 50 46 50L702.001 50C705.314 50 708.001 52.6863 708.001 56V69H40.0006L40 56.0003Z" fill="#e4e2fb" />
        <circle cx="55" cy="59" r="7" fill="#fff" opacity=".7" />
        <circle cx="69" cy="59" r="7" fill="#fff" opacity=".7" />
        <circle cx="83" cy="59" r="7" fill="#fff" opacity=".7" />
        <path d="M219.521 341.196C218.681 344.401 220.686 347 224 347H380.306C383.619 347 386.986 344.401 387.826 341.196L409.673 257.804C410.512 254.599 408.507 252 405.193 252H248.887C245.574 252 242.207 254.599 241.367 257.804L219.521 341.196Z" fill="#e4e2fb" />
        <rect x="263" y="279" width="112" height="8" rx="4" fill="#f1f0fd" />
        <rect x="259" y="295" width="100" height="8" rx="4" fill="#f1f0fd" />
        <rect x="255" y="311" width="88" height="8" rx="4" fill="#f1f0fd" />
        <path fillRule="evenodd" clipRule="evenodd" d="M164.036 191C162.912 191 162 191.912 162 193.036V232.744C162 233.869 162.912 234.781 164.036 234.781H176.763V240.98C176.763 241.748 177.58 242.239 178.258 241.88L191.668 234.781H270.943C272.068 234.781 272.979 233.869 272.979 232.744V193.036C272.979 191.912 272.068 191 270.943 191H164.036Z" fill="#e4e2fb" />
        <rect x="173" y="204" width="80" height="4" rx="2" fill="#fff" />
        <rect x="173" y="213" width="56" height="4" rx="2" fill="#fff" opacity=".6" />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
const BlogList = ({ blogs }) => {
    const { t } = useTranslation();

    const [viewMore, setViewMore] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const handleClicked = useCallback((viewDetail, blog) => {
        setViewMore(viewDetail);
        setSelectedBlog(blog);
    }, []);

    const isEmpty = !blogs || blogs.length === 0;

    // Vue détail
    if (viewMore && selectedBlog) {
        return (
            <>
                <style>{styles}</style>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '16px 8px' }}>
                    <button
                        type="button"
                        className="bl-back-btn"
                        onClick={() => handleClicked(false, null)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                        </svg>
                        {t('back') || 'Retour'}
                    </button>
                    <BlogDetails blog={selectedBlog} onClose={handleClicked} />
                </div>
            </>
        );
    }

    // Vue liste
    return (
        <>
            <style>{styles}</style>
            <div className="bl-root">
                {isEmpty ? (
                    <div className="bl-grid">
                        <div className="bl-empty">
                            <EmptyIllustration />
                            <p className="bl-empty-text">
                                <NoContentComp content={t('blogNone')} />
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bl-grid">
                        {blogs.map((post, index) => (
                            <div
                                key={post?.id ?? index}
                                className="bl-card-wrap"
                                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
                            >
                                <BlogCard blog={post} handleClicked={handleClicked} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogList;