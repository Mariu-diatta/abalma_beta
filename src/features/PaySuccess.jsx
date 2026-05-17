import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { ENDPOINTS } from '../utils';

import { useDispatch} from 'react-redux';

import { useTranslation } from 'react-i18next';
import { setCurrentNav } from '../slices/navigateSlice';
import api from '../services/Axios';


const PaySuccess = () => {

    const { t } = useTranslation();

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const [succes, setSuccess] = useState()

    const [data, setData] = useState()


    useEffect(() => {

        const searchParams = new URLSearchParams(window.location.search);

        const sessionId = searchParams.get("session_id");

        const interval = setInterval(async () => {
            const res = await api.get(`/payment-status?session_id=${sessionId}`);
            const data = await res.json();

            if (data.paid) {
                clearInterval(interval);
                setSuccess(true);
                setData(data)
            }

        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (

        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">

            <h1 className="text-2xl font-bold text-green-600 mb-2">
                {
                    succes ?
                        <p>{t("payment_text.success_text_1")} 🎉 </p>
                        :
                        <p>
                            {t("payment_text.paid_fail")}
                            {data?.email}
                        </p>
                }
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
