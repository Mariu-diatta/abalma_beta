import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { showMessage } from "../components/AlertMessage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../services/Axios";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY ??"pk_live_51SPtoBCEAhT0NnGVoQjdHYYUtO485bRx760vbQd5AWu6sfAl7Imm9adI7cf6sVlEjVdEWB797NplRdMvHBGl8Kid00q8x8Skjj");

// ─── Formulaire de paiement Stripe (à l'intérieur de la modal) ───
const StripePaymentForm = ({ clientSecret, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
            redirect: "if_required", // ← évite la redirection si pas nécessaire
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            onSuccess();
        }
    };

    return (
        <div>
            {/* Formulaire carte Stripe */}
            <div className="border border-gray-100 rounded-xl p-4 mb-4">
                <PaymentElement />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading || !stripe}
                className="w-full py-3 bg-gradient-to-r from-purple-400 to-blue-400
                   hover:from-purple-500 hover:to-blue-500
                   text-white font-medium rounded-xl
                   disabled:opacity-60 transition-all duration-200
                   flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        {t("processing") || "Traitement en cours…"}
                    </>
                ) : (
                    t("confirm_and_pay") || "Confirmer et payer"
                )}
            </button>

            <button
                onClick={onCancel}
                disabled={loading}
                className="w-full mt-2 py-3 border border-gray-200 text-gray-600
                   hover:bg-gray-50 rounded-xl font-medium transition-all
                   disabled:opacity-50"
            >
                {t("cancel") || "Annuler"}
            </button>
        </div>
    );
};

// ─── Composant principal ───
const BuyButtonWithPaymentForm = ({ total_price, reference }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dataItems = useSelector((state) => state.cart.items);
    const currentUser = useSelector((state) => state.auth.user);

    const isConnected = !!(currentUser && currentUser.is_connected);
    const hasItems = dataItems?.length > 0;
    const hasPrice = total_price > 0;

    // Étape 1 — Ouvrir la modal et créer le PaymentIntent
    const handleClick = async () => {
        if (!isConnected) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.post(
                "create-payment/",  // ← ton endpoint PaymentIntent
                { items: dataItems, currency: reference, email: currentUser.email },
                { withCredentials: true }
            );
            setClientSecret(res.data.client_secret);  // ← stocker le client_secret
            setShowModal(true);
        } catch (err) {
            const message = err?.response?.data?.error || t("unsuccess_transaction");
            setError(message);
            showMessage(dispatch, { Type: "Erreur", Message: message });
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setShowModal(false);
        navigate("/success");
    };

    const handleCancel = () => {
        setShowModal(false);
        setClientSecret(null);
    };

    if (!hasPrice || !hasItems) return null;

    return (
        <div className="p-6">
            {/* Bouton principal */}
            <button
                onClick={handleClick}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full px-6 py-3.5
                   bg-gradient-to-r from-purple-400 to-blue-400
                   hover:from-purple-500 hover:to-blue-500
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
                        <span>{t("loading") || "Chargement…"}</span>
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

            {/* Modal avec formulaire Stripe */}
            {showModal && clientSecret && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-1">
                            {t("confirm_payment") || "Paiement sécurisé"}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Total : <strong>{parseFloat(total_price)?.toFixed(2)} {reference}</strong>
                        </p>

                        {/* Résumé panier */}
                        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                            {dataItems.map((item, i) => (
                                <div key={i} className="flex justify-between px-4 py-2.5 border-b border-gray-100 last:border-0 text-sm">
                                    <span className="text-gray-700">
                                        {item?.name_product}
                                        {item?.quantity > 1 && <span className="text-gray-400 ml-1">× {item?.quantity}</span>}
                                    </span>
                                    <span className="font-medium">
                                        {parseFloat(item?.price_product * item?.quantity)?.toFixed(2)} {reference}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Stripe Elements */}
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <StripePaymentForm
                                clientSecret={clientSecret}
                                onSuccess={handleSuccess}
                                onCancel={handleCancel}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyButtonWithPaymentForm;