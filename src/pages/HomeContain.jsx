import React from 'react';
import { useTranslation } from 'react-i18next';

import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';
import bg_image from '../assets/bg_image_.jpg'
//import ScrollTop from '../components/ButtonScroll';

const HomeContain = () => {

    const { t } = useTranslation();

    return (

        <>

            {/* ====================== MAIN CONTENT ====================== */}
            <main className="pt-[10dvh] shadow-full bg-gradient-to-br from-purple-10 to-blue-50">

                {/* ========= HERO / Intro ========= */}
                <section className="max-w-screen-md mx-auto text-center mb-10 relative w-full px-2 text-[10px] md:text-[15px] translate-y-0 transition-all duration-1000 ease-in-out">

                    <header>

                        <div
                            className={`
                            inset-0 bg-cover bg-center blur-xl scale-110 `}
                            style={{
                                backgroundImage: `url(${bg_image})`,
                            }}
                        />

                        <h1 className="text-3xl font-semibold mb-3">{t('homePan.title')}</h1>

                        <p className="text-gray-600 text-md">
                            {t('homePan.content')}
                        </p>

                    </header>

                </section>

                {/* ========= PRODUCTS ========= */}
                <GridLayoutProduct />

                {/* ========= SUBSCRIPTIONS ========= */}
                <section aria-labelledby="subscription-plans" className="text-center translate-y-0 transition-all duration-1000 ease-in-out">

                    <SubscriptionsPage />

                </section>

                {/* ========= SERVICES ========= */}
                <section aria-labelledby="services" className="bg-gray-50 px-1 translate-y-0 transition-all duration-1000 ease-in-out">

                    <ServicesPlatforms />

                </section>

                {/* ========= TESTIMONIALS ========= */}
                <section aria-labelledby="testimonials" className="bg-gray-50 px-1 py-[2dvh] translate-y-0 transition-all duration-1000 ease-in-out">

                    <TestimonialCarousel
                        autoplay={true}
                        autoplayInterval={6000}
                    />

                    <div
                        className="absolute mx-auto mb-[10dvh] mx-auto mt-5
                            w-[46dvh] h-[46dvh] mb:w-[60dvh] mb:h-[60dvh]
                            rounded-br-full
                            bg-gradient-to-br from-purple-0 to-blue-100
                            flex items-center justify-center
                        "
                    >
                    </div>

                </section>


            </main>

        </>
    );
};

export default HomeContain;
