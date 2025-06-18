import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import OwnerAvatar from '../components/OwnerProfil';

const ProfilPopPov = () => {
    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);
    const currentOwnUser = useSelector((state) => state.chat.userSlected);


    const togglePopover = () => setIsVisible((prev) => !prev);

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
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={togglePopover}
                type="button"
                aria-haspopup="true"
                aria-expanded={isVisible}
                aria-controls="popover-user-profile"
                className="text-gray-700 bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
            >
                <svg
                    className="w-6 h-6 text-blue-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
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
                    className="absolute right-0 mt-2 w-64 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 z-50"
                >
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">  <OwnerAvatar owner={currentOwnUser} />{currentOwnUser?.nom} {currentOwnUser?.prenom}</h3>
                            <button
                                type="button"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none dark:focus:ring-blue-900"
                            >
                                Follow
                            </button>
                        </div>
                        <p className="mb-2 text-sm">@{currentOwnUser?.nom}</p>
                        <p className="mb-4 text-sm">
                            Open-source contributor. Building{' '}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-500 hover:underline"
                            >
                                @abalma
                            </a>
                            .
                        </p>
                        <ul className="flex gap-6 text-sm">
                            <li>
                                <span className="font-semibold text-gray-900 dark:text-white">799</span> Following
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900 dark:text-white">3,758</span> Followers
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilPopPov;
