import React, { useState } from 'react'
import { Check } from "lucide-react";
import api from '../services/Axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../utils';
import { useDispatch } from 'react-redux';
import { setCurrentNav } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import TitleCompGen from '../components/TitleComponentGen';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import LoadingCard from '../components/LoardingSpin';


function SubscriptionCard({
    title = "Abalma Pro",
    subtitle = "Pour les professionnels et artisans",
    price = "9,99€ / mois",
    features = [
        "Badge vérifié",
        "Priorité dans les résultats",
        "Contact direct illimité",
        "Support premium",
    ],
    highlight = true,
    amount_id,
    onSubscribe,
}) {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    const [loading, setLoading]=useState(false)

    const handleSubscribe = async (email, amount_id) => {

        if (!email) alert("Connectez vous !!!")

        setLoading(true)

        try {
            const { data } = await api.post('/create-checkout-session-subscription/', {
                email: email,
                amount_id: amount_id
            });

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error(data.error);
            }

        } catch (error) {
            console.error('Erreur:', error);

        } finally {
            setLoading(false)
        }
    };

    return (
        <div
            className={
                `relative flex flex-col justify-between rounded-lg shadow-md p-6 w-full max-w-sm transition transform
                hover:shadow-2xl hover:-translate-y-1
                animate-fade-in-up
                ${highlight
                    ? "bg-gradient-to-br from-indigo-50 to-white border-indigo-200"
                    : "bg-white border-gray-200"
                }`
            }
        >
            <div>

                {/* Étiquette Recommandé */}
                {
                    highlight && (
                        <span className="absolute top-3 right-3 bg-indigo-200 text-white text-xs px-3 py-1 rounded-full">
                            {t("redo_subscription")}
                        </span>
                    )
                }

                {/* En-tête */}
                <div className="text-center mb-5">

                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>

                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>

                    {/* Prix */}
                    <div className="text-center mb-6">

                        <div className="m-auto text-center">
                            <TitleCompGen title={price} />
                        </div>

                    </div>

                </div>

            </div>

            {/* Liste des avantages */}
            <ul className={`flex flex-col gap-3 text-gray-700 mb-6 ${(features?.length < 0) && "hidden"}`}>
                {
                    features?.map((feature, i) => (

                        <li key={i} className="flex items-center gap-2">

                            <Check className="w-5 h-5 text-green-600" />

                            <span className="text-sm">{feature}</span>

                        </li>
                    ))
                }
            </ul>

            <button
                onClick={() => handleSubscribe(currentUser?.email, amount_id)}
                disabled={loading || !currentUser?.email}
                className={`
                bg-gray-200 py-2.5 font-semibold my-1 rounded-md
                hover:bg-gray-300 transition
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
                {loading ? (
                    <LoadingCard />
                ) : (
                    "S’abonner"
                )}
            </button>

            <p className="text-sm text-gray-500 mt-2">
                {t('secure_subscription')}
            </p>

        </div>
    );
}

export function PayPalSubscription({ onSubscribe, ispro }) {

    return (

        <PayPalScriptProvider

            options={{
                "client-id":"Aac7QRleq_w4artKozmhQIV176fi93VTttK908csWRWcl1gE6qGrHWuUHmOXTJFz-32x-E7J2cptvzHC",
                vault: true,
                intent: "subscription",
            }}
        >
            <PayPalButtons

                style={{
                    shape: "rect",
                    color: "gold",
                    layout: "vertical",
                    label: "subscribe",
                }}

                createSubscription={(data, actions) => {

                    return actions.subscription.create({
                        plan_id: ispro ? "P-92Y48848DU934623LNHWXRNY" : "P-471693517W4346429NHZ7W2I",
                    });
                }}


                onApprove={(data) => {

                    onSubscribe(data)
                }}

                onError={(err) => {
                    console.error("PayPal error:", err);
                }}
            />
        </PayPalScriptProvider>
    );
}
export default function SubscriptionsPage() {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const currentNav = useSelector(state => state.navigate.currentNav);

    const isCurrentNavSubscribtion = currentNav !== ENDPOINTS?.SUBSCRIPTION

    const handleSubscribe = async (data, type_subscription) => {

        if (!currentUser) {

            alert(t("connectFirst"))

            return

        } else {

            try {

                const response = await api.post("/api/paypal/validate/", {
                    subscriptionID: data.subscriptionID,
                    type_subscription: type_subscription
                });

                const result = response.json();

                if (result.valid) {
                    alert("Subscription activated");
                } else {
                    alert("Validation failed");
                }

            } catch (e) {

                console.log("ERREUR", e)

            } finally {

            }
        }
    };


    return (

        <main className=" flex flex-col items-center justify-center  bg-none mx-2 mt-16 overflow-y-auto h-full pt-[100px]">

            <button

                className={`${isCurrentNavSubscribtion ? "hidden" : "shadow-lg z-10 "}`}

                onClick={

                    () => {

                        navigate(`/${ENDPOINTS?.ACCOUNT_HOME}`);

                        dispatch(setCurrentNav(ENDPOINTS?.ACCOUNT_HOME))

                    }
                }
            >
                <svg className="cursor-pointer absolute left-2 top-2 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />

                </svg>

            </button>

            <div className="m-auto text-start pb-2">
                <TitleCompGen title={t("Subscriptionb2b")} />
            </div>

            <div
                className="
                    grid 
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                    bg-none
                    p-5
                    pt-0
                    translate-y-0
                    transition-all
                    duration-1000
                    ease-in-out

                "
            >

                <SubscriptionCard
                    title={t("discovery")}
                    price="0,00€ / mois"
                    subtitle="Pour tester la plateforme"
                    features={["Profil visible", "Limité à 5 contacts / mois"]}
                    highlight={false}
                    amount_id="price_1SSl4MCEAhT0NnGVWwQhaslP"
                    onSubscribe={(data) => handleSubscribe(data, "DISCOVERY")}
                />

                <SubscriptionCard
                    title={t("Pro")}
                    price="10,00€ / mois"
                    subtitle="Pour les équipes"
                    features={[
                        "Lancez et gérez votre activité de dropshipping facilement",
                        "Accès à des formations expertes",
                        "Chats illimités sans restriction",
                        "Accompagnement personnalisé prioritaire",
                    ]}
                    highlight={true}
                    amount_id="price_1SSl8mCEAhT0NnGVixibJU9I"
                    onSubscribe={(data) => handleSubscribe(data, "PRO")}
                />

            </div>

        </main>
    );
}





