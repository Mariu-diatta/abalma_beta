import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import OwnerAvatar from '../components/OwnerProfil';
import { useTranslation } from 'react-i18next';
import ViewsProfil from '../components/ViewsProfilUser';


const ProfilPopPov = () => {

    const { t } = useTranslation();

    const [isVisible, setIsVisible] = useState(false);
    const [showAbove, setShowAbove] = useState(false);

    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    const currentOwnUser = useSelector((state) => state.chat.userSlected);

    const currentUser = useSelector((state) => state.auth.user);

    const togglePopover = () => {

        setIsVisible((prev) => !prev);

        // Vérifie si le bouton est proche du bas de l’écran
        if (buttonRef.current) {

            const rect = buttonRef.current.getBoundingClientRect();

            const windowHeight = window.innerHeight;

            const spaceBelow = windowHeight - rect.bottom;

            const spaceAbove = rect.top;

            // Affiche au-dessus si pas assez d'espace en bas
            setShowAbove(spaceBelow < 250 && spaceAbove > spaceBelow);
        }
    };

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

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);

        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isVisible]);

    return (

        <div className="z-30 relative inline-block justify-center">

            <button
                ref={buttonRef}
                onClick={togglePopover}
                type="button"
                aria-haspopup="true"
                aria-expanded={isVisible}
                aria-controls="popover-user-profile"
                className="hover:bg-gray-200 focus:outline-none font-medium rounded-full text-sm p-3 text-center dark:bg-gray-700 dark:hover:bg-gray-600"
            >
                <svg
                    className="w-5 h-5 text-blue-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 7h14M5 12h14M5 17h10" />
                </svg>

                <span className="sr-only">Toggle user profile popover</span>

            </button>

            {isVisible && (

                <div
                    ref={popoverRef}
                    id="popover-user-profile"
                    role="dialog"
                    aria-modal="true"
                    className={`bg-white absolute right-0 w-64 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 z-50
                        ${showAbove ? 'bottom-full left-1/2 mb-2' : 'top-full mt-2'}
                    `}
                    style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text)"
                    }}
                >
                    <div className="p-4">

                        <div className="flex items-center justify-between mb-3">

                            <h3 className="flex gap-2 items-center">

                                <OwnerAvatar owner={currentOwnUser} />

                                <small>{currentOwnUser?.nom} {currentOwnUser?.prenom}</small>

                            </h3>

                            <ViewsProfil clientId={currentOwnUser?.id}/>

                        </div>

                        <p className="mb-2 text-sm">@{currentOwnUser?.nom}</p>

                        <p className="mb-4 text-sm">

                            {currentOwnUser?.description.slice(0, 50)}...

                        </p>

                        <ul className="flex gap-6 text-sm">

                            <li className="flex gap-1">

                                <span className="font-semibold text-gray-900 dark:text-white">{currentUser?.total_followers}</span> <p>{t('following')} </p>

                            </li>

                            <li className="flex gap-1">

                                <span className="font-semibold text-gray-900 dark:text-white">{currentUser?.total_followings}</span> <p>{t('followers')}</p>

                            </li>

                        </ul>

                    </div>

                </div>
            )}
        </div>
    );
};

export default ProfilPopPov;
