import React from 'react';
import { useTranslation } from 'react-i18next';
import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import bg_image from '../assets/bg_image_.jpg'
import TitleCompGen from '../components/TitleComponentGen';
import TestimonialCarousel from '../components/Testimony';
import ServicesSection from '../features/ServiceSections';
//import ScrollTop from '../components/ButtonScroll';

const HomeContain = () => {

    const { t } = useTranslation();

    return (

        <>

            {/* ====================== MAIN CONTENT ====================== */}
            <main className="pt-[10dvh] shadow-full bg-gradient-to-br from-purple-10 to-blue-50 overflow-y-hidden px-2">

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

                        <div className="m-auto text-center">
                            <TitleCompGen title={t('homePan.title')} />
                        </div>

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
                <section aria-labelledby="services" className="translate-y-0 translate-x-0 transition-all duration-1000 ease-in-out ">

                    <ServicesPlatforms />
           

                    <ServicesSection/>

                </section>

                <section aria-labelledby="Tesmonies" className=" translate-y-0 transition-all duration-1000 ease-in-out py-3">

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
