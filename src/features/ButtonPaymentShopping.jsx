import React, { useState } from "react";
import Logo from "../components/LogoApp";
import Payment from "../pages/Payment";
import { useTranslation } from 'react-i18next';

const BuyButtonWithPaymentForm = ({ total_price, reference }) => {

    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const { t } = useTranslation();

    return (

        <div className="text-right p-6">

            {
                (total_price > 0) &&

                <button onClick={() => setShowPaymentForm(true)} className="cursor-pointer text-white bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center">

                    <svg className="w-3.5 h-3.5 me-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">

                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>

                    {t('buy')} {total_price} ({reference})

                </button>
            }

            {
                (showPaymentForm && total_price > 0) && (

                    <div className="backdrop-blur-sm fixed inset-0 z-50 bg-gray-100 bg-transparent  bg-opacity-100 flex items-center justify-center style-bg" onClick={() => setShowPaymentForm(false)}>

                        <div className=" rounded-lg p-6 w-full max-w-xl shadow-xl " onClick={(e) => e.stopPropagation()}>

                            <div className="flex justify-between items-center mb-4 style-bg">

                                <Logo />

                                <span className="text-lg font-semibold"> {t('total_pay')} {total_price} ({reference})</span>

                            </div>

                            <Payment
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