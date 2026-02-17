import React from 'react'
import { Check } from "lucide-react";
import api from '../services/Axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../utils';
import { useDispatch } from 'react-redux';
import { setCurrentNav } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';

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
    onSubscribe,
}) {

    const { t } = useTranslation();

    return (

        <div
            className={`py-7 relative flex flex-col justify-between rounded-3xl border shadow-sm p-6 w-full max-w-sm transition hover:shadow-md hover:-translate-y-1
                ${
                    highlight?
                    "bg-gradient-to-br from-indigo-50 to-white border-indigo-200"
                    :
                    "bg-white/2 border-gray-200"
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

                </div>

            </div>

            {/* Prix */}
            <div className="text-center mb-6">

                <span className="text-3xl font-extrabold text-indigo-700">{price}</span>

            </div>

            {/* Liste des avantages */}
            <ul className={`flex flex-col gap-3 text-gray-700 mb-6 ${(features?.length<0) && "hidden"}`}>
                {
                    features.map((feature, i) => (

                        <li key={i} className="flex items-center gap-2">

                            <Check className="w-5 h-5 text-green-600" />

                            <span className="text-sm">{feature}</span>

                        </li>
                    ))
                }
            </ul>

            <div>

                {/* Bouton */}
                <button
                    onClick={onSubscribe}
                    className="bg-gradient-to-r from-green-100 to-blue-600 bottom-2 w-full bg-indigo-50 hover:bg-indigo-100 text-white font-medium py-2.5 rounded-xl transition cursor-pointer"
                >
                    {t("my_subscription")}

                </button>


                <p className="text-center text-xs text-gray-400 mt-3">

                    {t("secure_subscription")}

                </p>

            </div>

        </div>
    );
}

export default function SubscriptionsPage() {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    let navigate = useNavigate();

    const dispatch = useDispatch()

    const currentNav = useSelector(state => state.navigate.currentNav);

    const handleSubscribe = (amount = "price_1SSjTKCEAhT0NnGVt0SzuhBu") => {

        if (!currentUser) {

            alert(t("connectFirst"))

            return

        } else {

            try {

                api.post("create-checkout-subscription-session/", { "email": currentUser?.email, "amount_id": amount })
                .then(
                    resp => {

                        const url_link = resp?.data?.url?.replace(/^http:\/\/localhost:3000\//, '');

                        console.log("Le lien de redirection pour payer :::", url_link)

                        //navigate(`/${url_link}`, { replace: true })

                        window.location.href = url_link;
                    }

                )

            } catch (e) {

                console.log("ERREUR", e)

            } finally {

            }
        }
    };


    return (

        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 bg-none  pt-[2dvh] mx-2">

            <button

                className={`${currentNav !== ENDPOINTS?.SUBSCRIPTION ? "hidden":"shadow-lg z-10 "}`}

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

            <h1 className="text-2xl font-bold text-gray-800  flex items-center gap-5 my-4">

                <p>{t("Subscriptionb2b")}</p>

            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-none overflow-y-auto h-full scrollbor_hidden py-5">

                <SubscriptionCard
                    title={t("discovery")}
                    price="0€ / mois"
                    subtitle="Pour tester la plateforme"
                    features={["Profil visible", "Limité à 5 contacts / mois"]}
                    highlight={false}
                    onSubscribe={() => handleSubscribe("price_1SSl4MCEAhT0NnGVWwQhaslP")}
                />

                <SubscriptionCard
                    title="Pro"
                    price="9,00€ / mois"
                    subtitle="Idéal pour les artisans et les dropshippers"
                    features={[
                        "Badge vérifié",
                        "Contact illimité",
                        "Support prioritaire",
                        "Visibilité accrue",
                        "Accès à des fournisseurs exclusifs",
                        "Mises à jour automatiques des stocks",
                        "Suivi des commandes en temps réel",
                        "Gestion simplifiée des retours",
                        "Analyse des ventes et statistiques détaillées",
                        "Campagnes marketing automatisées",
                        "Optimisation SEO des fiches produits",
                        "Accès à des outils de pricing dynamique",
                        "Formation et conseils pour booster les ventes",
                        "Alertes sur les produits tendance",
                    ]}
                    highlight={true}
                    onSubscribe={() => handleSubscribe()}
                />

                <SubscriptionCard
                    title={t("Business")}
                    price="20,00€ / mois"
                    subtitle="Pour les équipes"
                    features={[
                        "Multi-comptes",
                        "Intégration API",
                        "Assistance dédiée",
                    ]}
                    highlight={false}
                    onSubscribe={()=>handleSubscribe("price_1SSl8mCEAhT0NnGVixibJU9I")}
                />

            </div>

        </main>
    );
}
