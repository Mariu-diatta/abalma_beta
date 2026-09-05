import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { showMessage } from "../components/AlertMessage";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/Axios";
import { API_ENDPOINTS } from "../services/apiEndpoints";

// ─── Composant principal ───
const BuyButtonWithPaymentForm = ({ total_price, reference }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const dataItems = useSelector((state) => state.cart.items);
    const currentUser = useSelector((state) => state.auth.user);

    const isConnected = !!(currentUser && currentUser.is_connected);
    const hasItems = dataItems?.length > 0;
    const hasPrice = total_price > 0;

    // Étape unique — Créer la Checkout Session puis rediriger vers Stripe
    const handleClick = async () => {
        if (!isConnected) {
            // navigate("/") si besoin, selon ton flux d'auth
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.post(
                API_ENDPOINTS.PAYMENTS.CREATE_PAYMENT, // ← endpoint Checkout (nom conservé)
                {
                    items: dataItems,
                    currency: reference,
                    success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.location.origin}/cancel`,
                },
                { withCredentials: true }
            );

            // Redirection vers l'interface de paiement hébergée par Stripe
            window.location.href = res.data.checkoutUrl;
        } catch (err) {
            const message = err?.response?.data?.error || t("unsuccess_transaction");
            setError(message);
            showMessage(dispatch, { Type: "Erreur", Message: message });
            setLoading(false);
        }
        // pas de finally { setLoading(false) } ici : on quitte la page vers Stripe en cas de succès
    };

    if (!hasPrice || !hasItems) return null;

    return (
        <>
            <button
                onClick={handleClick}
                disabled={loading}
                className="flex items-center justify-start gap-3 w-full px-6 py-3.5
                   bg-gradient-to-r from-purple-400 to-indigo-400
                   hover:from-purple-500 hover:to-indigo-500
                   disabled:opacity-60 disabled:cursor-not-allowed
                   text-white font-medium rounded-xl
                   transition-all duration-200 active:scale-95"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        <span>{t("loading") || "Redirection vers Stripe…"}</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 10h18M6 14h2m3 0h5M3 7v10a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1Z" />
                        </svg>
                        <span>{t("paymentModeCard")}</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                            {parseFloat(total_price)?.toFixed(2)} {reference}
                        </span>
                    </>
                )}
            </button>

            {!isConnected && (
                <p className="mt-2 text-xs text-center text-gray-400">
                    {t("login_required") || "Connectez-vous pour continuer"}
                </p>
            )}

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}
        </>
    );
};

export default BuyButtonWithPaymentForm;