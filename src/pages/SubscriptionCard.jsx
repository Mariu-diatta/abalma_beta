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
    pro_plan,
}) {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    const [loading, setLoading] = useState(false)

    const IS_USE_SUBCRIB = currentUser?.is_subscribed && pro_plan 

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
                disabled={!currentUser || IS_USE_SUBCRIB}
                className={`
                ${IS_USE_SUBCRIB ? "bg-gray-200  cursor-not-allowed" :" bg-indigo-200"} py-2.5 font-semibold my-1 rounded-md
                hover:bg-gray-300 transition
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2

              `}
            >
                {loading ? (
                    <LoadingCard />
                ) : (
                   t('subscriptionPage.subscribe')
                )}
            </button>

            <p className="text-sm text-gray-500 mt-2">
                {t('secure_subscription')}
            </p>

        </div>
    );
}


export default function SubscriptionsPage() {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)
    
    let navigate = useNavigate();

    const dispatch = useDispatch()

    const currentNav = useSelector(state => state.navigate.currentNav);

    const [loadingCancelSubscription, setLoadingCancelSubscription] = useState(false)

    const isCurrentNavSubscribtion = currentNav !== ENDPOINTS?.SUBSCRIPTION

    const PRICE_ID_PRO = "price_1Th6cGCEAhT0NnGVS1tm2tSF"

    const PRICE_ID_TEST = "price_1Th5qOCEAhT0NnGVgwTLQzrt"


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

    const cancelSubscription = async (e) => {

        e.preventDefault();

        setLoadingCancelSubscription(true);

        try {

            const response = await api.post("cancel-subscription/");

            console.log(response.data);

            alert("Subscription cancelled successfully");

        } catch (err) {

            console.log(err);

            // 🔥 message backend
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "An error occurred while cancelling the subscription.";

            alert(message);

        } finally {

            setLoadingCancelSubscription(false);

        }
    };


    return (

        <main className={`flex flex-col border-t border-gray-300 items-center border-0 justify-center  bg-none mx-1 py-5 ${isCurrentNavSubscribtion ? "" :"mt-16 pt-[10dvh]"} overflow-y-auto h-full  scrollbor_hidden`}>


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

            <div className="m-auto text-start py-5">
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
                    price={t('subscriptionPage.priceDisc')}
                    subtitle={t('subscriptionPage.subTitleDisc')}
                    features={t('subscriptionPage.featuresDisc', { returnObjects: true })}
                    highlight={false}
                    amount_id={PRICE_ID_TEST}
                    onSubscribe={(data) => handleSubscribe(data, "DISCOVERY")}
                    pro_plan={!currentUser?.pro_plan}
                />

                <SubscriptionCard
                    title={t("Pro")}
                    price={t('subscriptionPage.price')}
                    subtitle={t('subscriptionPage.subtitle')}
                    features={t('subscriptionPage.features', { returnObjects: true })}
                    highlight={true}
                    amount_id={PRICE_ID_PRO}
                    onSubscribe={(data) => handleSubscribe(data, "PRO")}
                    pro_plan={currentUser?.pro_plan}
                />

            </div>
            {
                currentUser?.is_subscribed &&
                <div>
                    {
                        !loadingCancelSubscription?
                        <button
                            onClick={cancelSubscription}
                            className="
                                inline-flex items-center justify-center
                                px-5 py-2 my-1
                                rounded-full
                                bg-red-100 hover:bg-red-700
                                text-white font-semibold text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                border border-red-600
                                hover:scale-[1.02]
                                active:scale-[0.98]
                            "
                        >
                           {t('subscriptionPage.cancelSubscription')}

                        </button>
                        :
                        <LoadingCard />
                    }
                </div>
            }

        </main>
    );
}





