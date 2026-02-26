import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CONSTANTS, totalPrice} from '../utils';
//import PaymentTransaction from './PaymentProductTransaction';
import BuyButtonWithPaymentForm from './ButtonPaymentShopping';

export const MetaMaskIcon = () => (
    <svg
        aria-hidden="true"
        className="h-4"
        viewBox="0 0 40 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    />
);

const CloseIcon = () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" aria-hidden="true">
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

    const { t, i18n } = useTranslation();

    const [isOpen, setIsOpen] = useState(false);

    const currentUser = useSelector(state => state.auth.user);

    const selectedProduct = useSelector(state => state.cart.selectedProductView);

    const isUserDisconnected = !currentUser || !currentUser?.is_connected;

    const lang = i18n.language || window.localStorage.i18nextLng || CONSTANTS.FR;

    const reference = lang === CONSTANTS?.FR ? CONSTANTS?.EUR : CONSTANTS?.USD

    //const [convertRate, setConvertRate] = useState(0.00)
    const [convertRate, setConvertRate] = useState(0.00)

    const priceProduct = totalPrice(selectedProduct, setConvertRate, reference, convertRate)


    //const formattedPrice = useMemo(() => {
    //    return Number.isFinite(priceProduct)
    //        ? priceProduct.toFixed(CONSTANTS.DECIMALS_DIGITS)
    //        : CONSTANTS.ZERO_DECIMALS_DIGITS;
    //}, [priceProduct]);

    const toggleModal = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        setHiddenShowDirection(isOpen);
        window.addEventListener('keydown', handleEsc);

        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, setHiddenShowDirection]);

    if (isUserDisconnected) return null;

    return (
        <div className="hidden">
            <button
                type="button"
                onClick={toggleModal}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-controls="wallet-modal"
                className="hidden flex flex-col z-20 rounded-lg cursor-pointer text-gray-900 hover:bg-gray-100
                           focus:ring-4 focus:outline-none focus:ring-gray-100 text-sm p-3
                           items-center dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1"
                        d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                </svg>

                <p className="whitespace-nowrap">{t('pay_for_product')}</p>

            </button>

            {isOpen && (
                <div
                    id="wallet-modal"
                    role="dialog"
                    aria-modal="true"
                    onClick={toggleModal}
                    className="fixed inset-0 z-200 backdrop-blur-sm flex items-center justify-center pt-[50px]"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-4"
                        style={{
                            backgroundColor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                        }}
                    >
                        <header className="flex items-center justify-between border-b p-4 dark:border-gray-600">
                            <h3 className="text-lg font-semibold">
                                {t('doPaimenent')}
                            </h3>

                            <button
                                type="button"
                                onClick={toggleModal}
                                aria-label="Fermer"
                                className="h-8 w-8 flex items-center justify-center rounded-lg
                                           text-gray-400 hover:bg-gray-200 hover:text-gray-900
                                           dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <CloseIcon />
                            </button>
                        </header>

                        <section className="p-4">
                            <p className="text-sm text-gray-500 mb-4">
                                {t('choosePaiementMode')}
                            </p>

                            {/*<PaymentTransaction*/}
                            {/*    totalPrice={!isNaN(priceProduct) ? priceProduct.toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS}*/}
                            {/*    referenceRate={reference}*/}
                            {/*    setShowPaymentForm*/}
                            {/*/>*/}

                            <BuyButtonWithPaymentForm
                                total_price={!isNaN(priceProduct) ? priceProduct.toFixed(CONSTANTS?.DECIMALS_DIGITS) : CONSTANTS?.ZERO_DECIMALS_DIGITS}
                                referenceRate={reference}
                            />

                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

WalletModal.propTypes = {
    setHiddenShowDirection: PropTypes.func.isRequired,
};

export default WalletModal;
