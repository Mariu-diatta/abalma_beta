import React from 'react'
import { Check } from "lucide-react";

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
    return (
        <div
            className={`relative flex flex-col justify-between rounded-3xl border shadow-sm p-6 w-full max-w-sm transition hover:shadow-md hover:-translate-y-1
            ${highlight
                    ? "bg-gradient-to-br from-indigo-50 to-white border-indigo-200"
                    : "bg-white/2 border-gray-200"
                }`}
        >
            {/* Étiquette Recommandé */}
            {highlight && (
                <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    Recommandé
                </span>
            )}

            {/* En-tête */}
            <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>

            {/* Prix */}
            <div className="text-center mb-6">
                <span className="text-3xl font-extrabold text-indigo-700">{price}</span>
            </div>

            {/* Liste des avantages */}
            <ul className="flex flex-col gap-3 text-gray-700 mb-6">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Bouton */}
            <button
                onClick={onSubscribe}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition"
            >
                Je m’abonne
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
                Paiement sécurisé via Stripe. Annulable à tout moment.
            </p>
        </div>
    );
}

export default function SubscriptionsPage() {

    const handleSubscribe = () => {
        alert("Redirection vers Stripe Checkout…");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 bg-none">

            <h1 className="text-2xl font-bold text-gray-800 mb-8">Choisissez votre abonnement</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-none">

                <SubscriptionCard
                    title="Découverte"
                    price="0€ / mois"
                    subtitle="Pour tester la plateforme"
                    features={["Profil visible", "Limité à 5 contacts / mois"]}
                    highlight={false}
                    onSubscribe={handleSubscribe}
                />

                <SubscriptionCard
                    title="Pro"
                    price="9,99€ / mois"
                    subtitle="Idéal pour les artisans et les dropshippers"
                    features={[
                        "Badge vérifié",
                        "Contact illimité",
                        "Support prioritaire",
                        "Visibilité accrue",
                        "Accès à des fournisseurs exclusifs",
                        "Intégration facile avec Shopify/WooCommerce",
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
                    onSubscribe={handleSubscribe}
                />

                <SubscriptionCard
                    title="Entreprise"
                    price="29,99€ / mois"
                    subtitle="Pour les équipes"
                    features={[
                        "Multi-comptes",
                        "Intégration API",
                        "Assistance dédiée",
                    ]}
                    highlight={false}
                    onSubscribe={handleSubscribe}
                />
            </div>
        </div>
    );
}
