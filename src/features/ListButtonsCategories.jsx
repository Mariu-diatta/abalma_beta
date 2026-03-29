import React from 'react';
import { menuItems } from '../components/MenuItem';
import { useTranslation } from 'react-i18next';

// ─── Styles injectés ──────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

  .lbc-wrap {
    font-family: 'Nunito', sans-serif;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 4px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .lbc-wrap::-webkit-scrollbar { display: none; }

  @keyframes lbc-pop-in {
    from { opacity: 0; transform: translateY(10px) scale(.94); }
    to   { opacity: 1; transform: translateY(0)   scale(1);   }
  }

  .lbc-btn {
    scroll-snap-align: start;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 14px 8px;
    border-radius: 16px;
    border: 1.5px solid transparent;
    cursor: pointer;
    background: rgba(255,255,255,.7);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(15,23,42,.06);
    color: #475569;
    transition:
      transform .18s cubic-bezier(.34,1.56,.64,1),
      box-shadow .18s,
      background .18s,
      border-color .18s,
      color .18s;
    animation: lbc-pop-in .35s ease both;
    min-width: 70px;
    position: relative;
    overflow: hidden;
  }

  /* Shimmer sur hover */
  .lbc-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform .4s ease;
    pointer-events: none;
  }
  .lbc-btn:hover::before { transform: translateX(100%); }

  .lbc-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px rgba(59,130,246,.18);
    border-color: rgba(59,130,246,.25);
    background: rgba(239,246,255,.95);
    color: #1d4ed8;
  }

  .lbc-btn:active { transform: scale(.96); }

  /* État actif */
  .lbc-btn.active {
    background: linear-gradient(145deg, #2563eb, #3b82f6);
    border-color: #1d4ed8;
    color: #fff;
    box-shadow: 0 6px 20px rgba(37,99,235,.38), 0 1px 0 rgba(255,255,255,.2) inset;
    transform: translateY(-2px) scale(1.04);
  }
  .lbc-btn.active::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 3px;
    border-radius: 99px;
    background: rgba(255,255,255,.6);
  }
  .lbc-btn.active:hover {
    background: linear-gradient(145deg, #1d4ed8, #2563eb);
    box-shadow: 0 8px 28px rgba(37,99,235,.5);
    color: #fff;
  }

  /* Icône */
  .lbc-icon {
    font-size: 1.4rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(15,23,42,.04);
    transition: background .18s;
  }
  .lbc-btn.active .lbc-icon {
    background: rgba(255,255,255,.18);
  }

  /* Label */
  .lbc-label {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .02em;
    text-align: center;
    white-space: nowrap;
    text-transform: capitalize;
    line-height: 1.2;
  }

  /* Delay stagger */
  .lbc-btn:nth-child(1)  { animation-delay: .04s; }
  .lbc-btn:nth-child(2)  { animation-delay: .08s; }
  .lbc-btn:nth-child(3)  { animation-delay: .12s; }
  .lbc-btn:nth-child(4)  { animation-delay: .16s; }
  .lbc-btn:nth-child(5)  { animation-delay: .20s; }
  .lbc-btn:nth-child(6)  { animation-delay: .24s; }
  .lbc-btn:nth-child(7)  { animation-delay: .28s; }
  .lbc-btn:nth-child(8)  { animation-delay: .32s; }
  .lbc-btn:nth-child(9)  { animation-delay: .36s; }
  .lbc-btn:nth-child(10) { animation-delay: .40s; }
`;

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
            <style>{styles}</style>
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