import React, { useState } from "react";
import Logo from "../components/LogoApp";
import { useTranslation } from 'react-i18next';
import PaymentTransaction from "./PaymentProductTransaction";
import { convertir } from "../utils";

const BuyButtonWithPaymentForm = ({ total_price, reference }) => {

    const { t } = useTranslation();

    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const showForm = (showPaymentForm && total_price > 0)

    const priceDiffZero = (total_price > 0) 

    return (

        <div className="text-right p-6">

            {
                priceDiffZero &&

                <button onClick={() => setShowPaymentForm(true)} className="cursor-pointer text-white bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">

                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
                    </svg>

                    <span class="whitespace-nowrap"> {t('paymentModeCard')} - {total_price} ({reference}))</span>

                </button>
            }

            {
                showForm && (

                    <div className="backdrop-blur-sm fixed inset-0 z-50 bg-gray-100 bg-transparent  bg-opacity-100 flex items-center justify-center style-bg" onClick={() => setShowPaymentForm(false)}>

                        <div className=" rounded-lg p-6 w-full max-w-xl shadow-xl " onClick={(e) => e.stopPropagation()}>

                            <div className="flex justify-between items-center mb-4 style-bg">

                                <Logo />

                                <span className="text-lg font-semibold"> {t('total_pay')} {convertir("XOF", reference, total_price).toFixed(2)} ({reference})</span>

                            </div>

                            <PaymentTransaction
                                totalPrice={total_price}
                                referenceRate={reference}
                                setShowPaymentForm={setShowPaymentForm}
                            />

                        </div>

                    </div>
                )
            }

        </div>
    );
};

export default BuyButtonWithPaymentForm;