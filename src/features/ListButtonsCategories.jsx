import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
//import { menuItems } from '../components/MenuItem';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp} from 'lucide-react';

const normalizeKey = (cat) => cat.replace(/_/g, '').toLowerCase();
const formatLabel = (cat) => cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const ListButtonsCategories = ({
    categories,
    setProductSpecificHandler,
    setActiveCategory,
    setActivateButtonCategory,
    activateButtonCategory,
}) => {
    const { t } = useTranslation();
    //const menuList = menuItems(t);
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef(null);
    const popoverRef = useRef(null);

    // Calcul de la position du bouton pour placer le Popover
    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top:window.scrollY + 10,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    const togglePopover = () => {
        updatePosition();
        setIsOpen(!isOpen);
    };

    // Gestion du clic extérieur et du redimensionnement
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener('resize', updatePosition);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('resize', updatePosition);
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isOpen]);

    if (!categories?.length) return null;

    return (

        <div className="relative inline-block">

            {/* Bouton Déclencheur */}
            <button
                ref={triggerRef}
                type="button"
                onClick={togglePopover}
                className={`category-popover-trigger ${isOpen ? 'active' : ''}`}
            >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
                </svg>

                <span>{isOpen ? t('Fermer') : t('categorie')}</span>

                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

            </button>

            {/* Le Portal - Sort le contenu du flux DOM parent */}
            {isOpen && createPortal(
                <div
                    ref={popoverRef}
                    className="portal-popover-content  bg-gray-200 overflow-auto w-secreen h-[100vh] scrollbor_hidden py-[20vh] my-0"
                    style={{
                        position: 'absolute',
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                        zIndex: 9999
                    }}
                >
                    <section className="ss-grid max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-4">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 border-b pb-2">

                            <p className="text-lg text-blue-500 font-bold tracking-wide">
                                {t('categorie')}
                            </p>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-red-50 transition"
                                type="button"
                            >
                                <svg
                                    className="w-6 h-6 text-red-700"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                </svg>
                            </button>

                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-2">

                            {categories.map((cat) => {

                                const label = formatLabel(cat);
                                const key = normalizeKey(cat);

                                const isActive =
                                    normalizeKey(activateButtonCategory ?? '') === key;

                                return (

                                    <button
                                        key={cat}
                                        type="button"
                                        className={`
                                            text-start  px-3 py-2 rounded-xl transition-all duration-200
                                            ${isActive
                                            ? 'active bg-blue-100 text-blue-700 font-semibold'
                                            : 'hover:bg-pink-100'}
                                        `}
                                        onMouseEnter={() => setProductSpecificHandler(key)}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveCategory(label);
                                            setActivateButtonCategory(label);
                                            setIsOpen(false);
                                        }}
                                    >

                                        <span className="lbc-label capitalize">
                                            {label.toLowerCase()}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </section>

                </div>,

                document.body // Injecté directement à la racine du site
            )}
        </div>
    );
};

export default ListButtonsCategories;