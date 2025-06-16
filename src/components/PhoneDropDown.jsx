import React, { useState, useRef, useEffect } from "react";

const PhoneDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    // Fermer le menu quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form className="max-w-sm mx-auto">
            <div className="flex items-center relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                >
                    {/* Icône drapeau + code pays */}
                    <svg
                        fill="none"
                        aria-hidden="true"
                        className="h-4 w-4 me-2"
                        viewBox="0 0 20 15"
                    >
                        <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                        <path
                            fill="#D02F44"
                            d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z"
                        />
                        <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                    </svg>
                    +1
                    <svg
                        className="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="z-10 absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-52 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                                <button
                                    type="button"
                                    className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <span className="inline-flex items-center">
                                        🇺🇸 United States (+1)
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <span className="inline-flex items-center">
                                        🇬🇧 United Kingdom (+44)
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <span className="inline-flex items-center">
                                        🇫🇷 France (+33)
                                    </span>
                                </button>
                            </li>
                            {/* Ajoute d'autres pays si nécessaire */}
                        </ul>
                    </div>
                )}
            </div>
        </form>
    );
};

export default PhoneDropdown;
