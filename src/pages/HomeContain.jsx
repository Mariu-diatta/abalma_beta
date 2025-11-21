import React from 'react';
import { useTranslation } from 'react-i18next';

import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';

const testimonials = [
    { id: 1, author: "Claire Dupont", role: "CEO, StartupX", text: "Abalma a transformé notre façon de vendre en ligne. Résultat immédiat." },
    { id: 2, author: "Marc Leroy", role: "Responsable e-commerce", text: "Interface simple, support réactif — je recommande !" },
    { id: 3, author: "Sophie Martin", role: "Indépendante", text: "Le suivi client est impeccable et l'intégration facile." },
];





const HomeContain = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* ====================== MAIN CONTENT ====================== */}
            <main className="mt-8">

                {/* ========= HERO / Intro ========= */}
                <section className="max-w-screen-md mx-auto text-center mb-10">
                    <header>
                        <h1 className="text-3xl font-semibold mb-3">{t('homePan.title')}</h1>
                        <p className="text-gray-600">
                            {t('homePan.content')}
                        </p>
                    </header>
                </section>


                {/* ========= PRODUCTS ========= */}
                <section aria-labelledby="products-title" className="mb-12">
                    <h2 id="products-title" className="sr-only">Produits disponibles</h2>
                    <GridLayoutProduct />
                </section>

                {/* ========= SUBSCRIPTIONS ========= */}
                <section aria-labelledby="subscription-plans" className="text-center">
                    <SubscriptionsPage />
                </section>

                {/* ========= SERVICES ========= */}
                <section aria-labelledby="services" className="bg-gray-50 px-6">
                    <h2 id="services" className="text-2xl font-semibold mb-2 text-center">
                        Nos Services
                    </h2>
                    <ServicesPlatforms/>
                </section>

                {/* ========= TESTIMONIALS ========= */}
                <section aria-labelledby="testimonials" className="bg-gray-50 px-6 py-[10dvh] translate-y-0 transition-all duration-1000 ease-in-out">
                    <TestimonialCarousel
                        testimonials={testimonials}
                        autoplay={true}
                        autoplayInterval={6000}
                    />
                </section>
            </main>
        </>
    );
};

export default HomeContain;
