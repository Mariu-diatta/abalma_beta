import React from 'react';
import { useNavigate } from "react-router";
import { ENDPOINTS } from '../utils';

import { useDispatch} from 'react-redux';

import { useTranslation } from 'react-i18next';
import { setCurrentNav } from '../slices/navigateSlice';


const PaySuccess = () => {

    const { t } = useTranslation();

    let navigate = useNavigate();

    const dispatch = useDispatch()

    return (

        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">

            <h1 className="text-2xl font-bold text-green-600 mb-2">
                {t("payment_text.success_text_1")} 🎉
            </h1>

            <p className="text-gray-700 text-lg">
                {t("payment_text.success_transaction_done")}   
            </p>

            <p className="text-gray-500 mt-1">
                {t("payment_text.success_transaction_message")}   
            </p>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(setCurrentNav(ENDPOINTS?.PAYMENT))
                    navigate(`/${ENDPOINTS?.PAYMENT}`)
                }}
                className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
                {t("payment_text.btn_back_to_dashbord")}
            </button>

        </div>
    );
};

export default PaySuccess;
