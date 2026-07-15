import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { ENDPOINTS } from "../utils";
import { setCurrentNav } from "../slices/navigateSlice";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";
import LoadingCard from "../components/LoardingSpin";

const PaySuccess = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get("session_id");

        if (!sessionId) {
            setError("Session introuvable");
            setLoading(false);
            return;
        }

        let isMounted = true;

        const checkPayment = async () => {
            try {
                const res = await api.get(
                    API_ENDPOINTS.PAYMENTS.PAYMENT_STATUS(sessionId)
                );

                if (!isMounted) return;

                if (res.data?.paid) {
                    setSuccess(true);
                    setPaymentData(res.data);
                    setLoading(false);
                    return true;
                }

                return false;
            } catch (err) {
                console.error(err);
                setError("Erreur lors de la vérification");
                setLoading(false);
            }
        };

        const run = async () => {
            // 1ère tentative immédiate
            const paid = await checkPayment();

            if (paid) return;

            // fallback polling léger (max 10 essais)
            let attempts = 0;

            const interval = setInterval(async () => {
                attempts++;

                const paidNow = await checkPayment();

                if (paidNow || attempts >= 10) {
                    clearInterval(interval);
                    setLoading(false);
                }
            }, 2000);

            return () => clearInterval(interval);
        };

        run();

        return () => {
            isMounted = false;
        };
    }, []);

    // ---------------- UI ----------------

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">

            {
                loading ?
                (
                    <>
                        <LoadingCard />
                        <h1 className="text-lg mt-3">
                            {t("payment_text.verification_processing")}
                        </h1>
                    </>
                ):
                <button
                    onClick={() => {
                        dispatch(setCurrentNav(ENDPOINTS.PAYMENT));
                        navigate(`/${ENDPOINTS.PAYMENT}`);
                    }}
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                    {t("payment_text.btn_back_to_dashbord")}
                </button>
           }

            {error && (
                <h1 className="text-red-600 text-xl font-bold">
                    {error}
                </h1>
            )}

            {success && (
                <>
                    <h1 className="text-2xl font-bold text-green-600 mb-2">
                        {t("payment_text.success_text_1")}
                    </h1>

                    <p className="text-gray-700 text-lg">
                        {t("payment_text.success_transaction_done")}
                    </p>

                    <p className="text-gray-500 mt-1">
                        {paymentData?.email}
                    </p>
                </>
            )}
        </div>
    );
};

export default PaySuccess;