import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Payment from '../pages/Payment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export const MetaMaskIcon = () => (

    <svg
        aria-hidden="true"
        className="h-4"
        viewBox="0 0 40 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Metamask SVG paths here */}
    </svg>
);

const CloseIcon = () => (

    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" aria-hidden="true" focusable="false">

        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />

    </svg>
);

const WalletModal = ({ setHiddenShowDirection }) => {

    const [isOpen, setIsOpen] = useState(false);

    const currentSelectedProductView = useSelector(state => state.cart.selectedProductView)

    const currentUser = useSelector(state => state.auth.user)

    const { t } = useTranslation();

    const toggleModal = useCallback(() => {

        setIsOpen((prev) => !prev);

    }, []);

    // Close modal on Escape key press
    useEffect(() => {

        const handleEsc = (event) => {

            if (event.key === 'Escape' && isOpen) {

                setIsOpen(false);
            }
        };

        setHiddenShowDirection(isOpen)

        window.addEventListener('keydown', handleEsc);

        return () => window.removeEventListener('keydown', handleEsc);

    }, [isOpen, setHiddenShowDirection]);

    if (!currentUser && !currentUser?.is_connected) return

    return (

        <>
            <button

                type="button"

                onClick={toggleModal}

                className="flex flex-col z-20 rounded-lg cursor-pointer text-gray-900  hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 text-sm p-3 inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"

                aria-haspopup="dialog"

                aria-expanded={isOpen}

                aria-controls="wallet-modal"
            >
                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>

                <p className="whitespace-nowrap">{t("pay_for_product")}</p>

            </button>

            {isOpen && (

                <div
                    id="wallet-modal"
                    role="dialog"
                    aria-modal="true"
                    className="backdrop-blur-sm fixed inset-0 z-200 shadow-lg w-full flex items-center justify-center bg-white-100 overflow-y-auto pt-[50px]"
                    onClick={toggleModal}

                >
                    <div
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-4 relative"

                        onClick={(e) => e.stopPropagation()}

                        style={{

                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)"
                        }}
                    >
                        <header className="flex items-center justify-between border-b p-4 dark:border-gray-600">

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("doPaimenent")}
                            </h3>

                            <button
                                type="button"
                                onClick={toggleModal}
                                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                aria-label="Fermer la fenêtre modale"
                            >
                                <CloseIcon />

                            </button>

                        </header>

                        <section className="p-4">

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {t("choosePaiementMode")}
                            </p>

                            <Payment totalPrice={currentSelectedProductView?.price_product}/>

                        </section>

                    </div>

                </div>
            )}
        </>
    );
};

WalletModal.propTypes = {

    Connectwallet: PropTypes.node.isRequired,
};

export default WalletModal;
