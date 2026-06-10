import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

import api from "../services/Axios";
import { showMessage } from "../components/AlertMessage";
import LoadingCard from "../components/LoardingSpin";
import { toast } from "react-toastify";

const stripePromise = loadStripe("pk_live_51SPtoBCEAhT0NnGVoQjdHYYUtO485bRx760vbQd5AWu6sfAl7Imm9adI7cf6sVlEjVdEWB797NplRdMvHBGl8Kid00q8x8Skjj");

// ----------------------
// FORMULAIRE DE PAIEMENT
// ----------------------
function CheckoutForm({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        const result = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (result.error) {
            toast.error(result.error.message);
            return;
        }

        if (result.paymentIntent?.status === "succeeded") {
            toast.success("Paiement réussi !");
            // update state / vider panier / redirect optionnel
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />

            <button
                disabled={!stripe || loading}
                className="bg-gray-200 py-2.5 font-bold hover:bg-gray-300 rounded-md w-full"
            >
                {loading ? <LoadingCard /> : "Payer"}
            </button>
        </form>
    );
}

// ----------------------
// COMPOSANT PRINCIPAL
// ----------------------
export function PaymentWithCard({ refRate }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const dataItems = useSelector((state) => state.cart.items);
    const currentUser = useSelector((state) => state.auth.user);

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentUserNotConnected = !currentUser?.email;

    const createOrder = async () => {
        if (currentUserNotConnected) {
            alert("Utilisateur non connecté");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(
                "create-payment/",
                {
                    items: dataItems,
                    currency: refRate,
                    email: currentUser.email,
                },
                { withCredentials: true }
            );

            setClientSecret(res.data.client_secret);
        } catch (error) {
            console.log(error);

            showMessage(dispatch, {
                Type: "Erreur",
                Message: t("unsuccess_transaction"),
            });
        } finally {
            setLoading(false);
        }
    };

    if (currentUserNotConnected) return null;

    // ----------------------
    // STEP 1: création paiement
    // ----------------------
    if (!clientSecret) {
        return (
            <button
                onClick={createOrder}
                className="bg-gray-200 py-2.5 font-bold hover:bg-gray-300 rounded-md w-1/2"
            >
                {loading ? <LoadingCard /> : "Payer"}
            </button>
        );
    }

    // ----------------------
    // STEP 2: paiement Stripe
    // ----------------------
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
}