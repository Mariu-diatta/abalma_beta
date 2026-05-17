import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { ENDPOINTS } from "../utils";
import { setCurrentNav } from "../slices/navigateSlice";
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";

const PaySuccess = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [success, setSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) return;

        const interval = setInterval(async () => {
            try {
                const res = await api.get(`/payment-status?session_id=${sessionId}`);

                if (res.data.paid) {
                    clearInterval(interval);
                    setSuccess(true);
                    setPaymentData(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">

            <h1 className="text-2xl font-bold text-green-600 mb-2">
                {success ? t("payment_text.success_text_1") : "Vérification du paiement..."}
            </h1>

            {success ? (
                <>
                    <p className="text-gray-700 text-lg">
                        {t("payment_text.success_transaction_done")}
                    </p>

                    <p className="text-gray-500 mt-1">
                        {paymentData?.email}
                    </p>

                    <button
                        onClick={() => {
                            dispatch(setCurrentNav(ENDPOINTS.PAYMENT));
                            navigate(`/${ENDPOINTS.PAYMENT}`);
                        }}
                        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                    >
                        {t("payment_text.btn_back_to_dashbord")}
                    </button>
                </>
            ) : (
                <LoadingCard />
            )}
        </div>
    );
};

export default PaySuccess;