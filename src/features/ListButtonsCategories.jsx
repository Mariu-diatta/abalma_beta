import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// ─── Utilitaires ──────────────────────────────────────────────────────────────
const normalizeKey = (cat) => cat.replace(/_/g, "").toLowerCase();
const formatLabel = (cat) =>
    cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Icônes ───────────────────────────────────────────────────────────────────
const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"
            d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
            d="M6 18 18 6M18 18 6 6" />
    </svg>
);

const ChevronIcon = ({ open }) => (
    <motion.svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
    >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
            strokeWidth="2.5" d="m6 9 6 6 6-6" />
    </motion.svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
const ListButtonsCategories = ({
    categories,
    setProductSpecificHandler,
    setActiveCategory,
    setActivateButtonCategory,
    activateButtonCategory,
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [search, setSearch] = useState("");

    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const searchRef = useRef(null);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 280),
        });
    }, []);

    const togglePopover = () => {
        updatePosition();
        setIsOpen((prev) => !prev);
        setSearch("");
    };

    const close = useCallback(() => {
        setIsOpen(false);
        setSearch("");
    }, []);

    // Fermer au clic extérieur + resize
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target) &&
                !triggerRef.current?.contains(e.target)
            ) close();
        };

        const handleKey = (e) => {
            if (e.key === "Escape") close();
        };

        window.addEventListener("resize", updatePosition);
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKey);

        // Focus sur la recherche
        setTimeout(() => searchRef.current?.focus(), 50);

        return () => {
            window.removeEventListener("resize", updatePosition);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, close, updatePosition]);

    if (!categories?.length) return null;

    const filtered = categories.filter((cat) =>
        formatLabel(cat).toLowerCase().includes(search.toLowerCase())
    );

    const activeKey = normalizeKey(activateButtonCategory ?? "");

    return (
        <div className="relative inline-block">

            {/* ── Bouton déclencheur ── */}
            <motion.button
                ref={triggerRef}
                type="button"
                onClick={togglePopover}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
                className={`
                    flex items-center gap-2 px-1 py-2.5 rounded-xl text-sm font-medium mt-2
                    border transition-all duration-200 select-none
                    ${isOpen
                        ? " border-0 text-indigo-600"
                        : " border-0 text-gray-600 hover:border-indigo-200 hover:text-indigo-500"
                    }
                `}
            >
                <MenuIcon />
                <span>{isOpen ? t("Fermer") : t("categorie")}</span>
                <ChevronIcon open={isOpen} />
            </motion.button>

            {/* ── Popover via Portal ── */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay flouté */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="fixed inset-0 bg-black/10 backdrop-blur-[2px]"
                                style={{ zIndex: 9998 }}
                                onClick={close}
                            />

                            {/* Panel */}
                            <motion.div
                                ref={popoverRef}
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                style={{
                                    position: "absolute",
                                    top: `${coords.top}px`,
                                    left: `${coords.left}px`,
                                    width: `${coords.width}px`,
                                    zIndex: 9999,
                                }}
                                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-500">
                                            <MenuIcon />
                                        </span>
                                        <p className="text-sm font-semibold text-gray-800 tracking-tight">
                                            {t("categorie")}
                                        </p>
                                        <span className="text-[11px] font-mono text-gray-400">
                                            ({filtered.length})
                                        </span>
                                    </div>

                                    <motion.button
                                        type="button"
                                        onClick={close}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
                                        aria-label="Fermer"
                                    >
                                        <CloseIcon />
                                    </motion.button>
                                </div>

                                {/* Recherche */}
                                <div className="px-3 py-2.5 border-b border-gray-100">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-indigo-300 focus-within:bg-white transition-all duration-150">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2"
                                                d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
                                        </svg>
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t("Rechercher…") || "Rechercher…"}
                                            className="w-full text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch("")}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <CloseIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Liste */}
                                <div className="max-h-64 overflow-y-auto p-2 flex flex-col gap-0.5 scrollbar-thin">
                                    {filtered.length === 0 ? (
                                        <p className="text-center text-xs text-gray-400 py-6">
                                            {t("Aucun résultat") || "Aucun résultat"}
                                        </p>
                                    ) : (
                                        filtered.map((cat) => {
                                            const label = formatLabel(cat);
                                            const key = normalizeKey(cat);
                                            const isActive = activeKey === key;

                                            return (
                                                <motion.button
                                                    key={cat}
                                                    type="button"
                                                    whileHover={{ x: 3 }}
                                                    transition={{ duration: 0.12 }}
                                                    onMouseEnter={() => setProductSpecificHandler(key)}
                                                    onClick={() => {
                                                        setActiveCategory(label);
                                                        setActivateButtonCategory(label);
                                                        close();
                                                    }}
                                                    className={`
                                                        w-full text-left px-3 py-2.5 rounded-xl text-sm
                                                        transition-colors duration-150 flex items-center justify-between
                                                        ${isActive
                                                            ? "bg-indigo-50 text-indigo-600 font-semibold"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                        }
                                                    `}
                                                >
                                                    <span className="capitalize">{label.toLowerCase()}</span>
                                                    {isActive && (
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-indigo-500 shrink-0">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 13 4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </motion.button>
                                            );
                                        })
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default ListButtonsCategories;