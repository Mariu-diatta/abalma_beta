import React from 'react';
import { useTranslation } from 'react-i18next';

import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';
import bg_image from '../assets/bg_image_.jpg'

const HomeContain = () => {

    const { t } = useTranslation();

    return (
        <>
            {/* ====================== MAIN CONTENT ====================== */}
            <main className="mt-8">

                {/* ========= HERO / Intro ========= */}
                <section className="max-w-screen-md mx-auto text-center mb-10 relative w-full px-2 text-[10px] md:text-[15px]">

                    <header>

                        <div
                            className={`
                            inset-0 bg-cover bg-center blur-xl scale-110 `}
                            style={{
                                backgroundImage: `url(${bg_image})`,
                            }}
                        />

                        <h1 className="text-3xl font-semibold mb-3">{t('homePan.title')}</h1>
                        <p className="text-gray-600">
                            {t('homePan.content')}
                        </p>
                    </header>
                </section>


                {/* ========= PRODUCTS ========= */}
                <section aria-labelledby="products-title" className="mb-12">
                    <GridLayoutProduct />
                </section>

                {/* ========= SUBSCRIPTIONS ========= */}
                <section aria-labelledby="subscription-plans" className="text-center">
                    <SubscriptionsPage />
                </section>

                {/* ========= SERVICES ========= */}
                <section aria-labelledby="services" className="bg-gray-50 px-6">
                    <h2 id="services" className="text-2xl font-semibold mb-2 text-center">
                         Services
                    </h2>
                    <ServicesPlatforms/>
                </section>

                {/* ========= TESTIMONIALS ========= */}
                <section aria-labelledby="testimonials" className="bg-gray-50 px-6 py-[10dvh] translate-y-0 transition-all duration-1000 ease-in-out">
                    <TestimonialCarousel
                        autoplay={true}
                        autoplayInterval={6000}
                    />
                </section>
            </main>
        </>
    );
};

export default HomeContain;
