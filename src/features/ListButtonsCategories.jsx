import React from 'react';
import { menuItems } from '../components/MenuItem';
import { useTranslation } from 'react-i18next';


// ─── Utilitaires ──────────────────────────────────────────────────────────────

/** Normalise une clé de catégorie : retire les underscores et passe en minuscules. */
const normalizeKey = (cat) => cat.replace(/_/g, '').toLowerCase();

/** Formate le libellé affiché : underscores → espaces + capitalize. */
const formatLabel = (cat) =>
    cat
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Composant ────────────────────────────────────────────────────────────────

const ListButtonsCategories = ({
    categories,
    setProductSpecificHandler,
    setActiveCategory,
    setActivateButtonCategory,
    activateButtonCategory,
}) => {
    const { t } = useTranslation();
    const menuList = menuItems(t);

    if (!categories?.length) return null;

    return (
        <>
            <section className="lbc-wrap" role="toolbar" aria-label="Filtres par catégorie">
                {categories.map((cat) => {
                    const label = formatLabel(cat);
                    const key = normalizeKey(cat);
                    const isActive = normalizeKey(activateButtonCategory ?? '') === key;
                    const icon = menuList.find((item) => item.name === cat)?.photo;

                    return (
                        <button
                            key={cat}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            aria-label={label}
                            className={`lbc-btn${isActive ? ' active' : ''}`}
                            onMouseEnter={() => setProductSpecificHandler(key)}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveCategory(label);
                                setActivateButtonCategory(label);
                            }}
                        >
                            {icon && <span className="lbc-icon">{icon}</span>}
                            <span className="lbc-label">{label}</span>
                        </button>
                    );
                })}
            </section>
        </>
    );
};

export default ListButtonsCategories;