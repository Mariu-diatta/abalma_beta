import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import OwnerAvatar from '../components/OwnerProfil';
import FollowProfilUser from '../components/ViewsProfilUser';
import NumberFollowFollowed from '../components/FollowUserComp';
import { useTranslation } from 'react-i18next';

const ProfilPopPov = () => {

    const { t } = useTranslation();

    const currentOwnUser = useSelector(state => state.chat.userSlected);

    const [isVisible, setIsVisible] = useState(false);
    const [showAbove, setShowAbove] = useState(false);

    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    const togglePopover = () => {
        setIsVisible(prev => !prev);

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const spaceBelow = windowHeight - rect.bottom;
            const spaceAbove = rect.top;

            // Affiche au-dessus si pas assez d'espace en bas
            setShowAbove(spaceBelow < 250 && spaceAbove > spaceBelow);
        }
    };

    // Fermer popover quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        if (isVisible) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isVisible]);

    // Fermer popover avec ESC
    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && setIsVisible(false);
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className="relative inline-block z-30">
            {/* Bouton toggle */}
            <button
                ref={buttonRef}
                onClick={togglePopover}
                type="button"
                aria-haspopup="true"
                aria-expanded={isVisible}
                aria-controls="popover-user-profile"
                className="flex flex-col items-center cursor-pointer p-3 text-center text-sm rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-600"
            >
                <svg
                    className="w-5 h-5 text-blue-800 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path d="M5 7h14M5 12h14M5 17h10" />
                </svg>
                <span className="whitespace-nowrap">{t("your_profil")}</span>
            </button>

            {/* Popover */}
            {isVisible && (
                <div
                    ref={popoverRef}
                    id="popover-user-profile"
                    role="dialog"
                    aria-modal="true"
                    className={`
                    absolute z-50 w-64 max-h-[70vh] overflow-y-auto
                    text-md border rounded-lg shadow-lg
                    ${showAbove ? 'bottom-full mb-2 left-0 -translate-x-50 z-100' : 'top-full mt-2 right-2'}
                  `}
                >
                    <div className="p-4 space-y-3">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <OwnerAvatar owner={currentOwnUser} />

                                <small>{currentOwnUser?.nom} {currentOwnUser?.prenom}</small>

                            </div>

                            <FollowProfilUser clientId={currentOwnUser?.id} />

                        </div>

                        <p className="text-sm text-gray-500">@{currentOwnUser?.nom}</p>

                        <p className="text-sm">{currentOwnUser?.description?.slice(0, 80)}…</p>

                        <NumberFollowFollowed profil={currentOwnUser} />

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilPopPov;
