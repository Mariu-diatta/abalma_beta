import React from 'react';
import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';
import ServicesSection from '../features/ServiceSections';
import AffichePortal from '../components/AffichPub';
import AttentionAlertMessage from '../components/AlertMessage';


const HomeContain = () => {

    return (

        <>
            <AttentionAlertMessage/>

            {/* ====================== MAIN CONTENT ====================== */}
            <main className="shadow-full bg-gradient-to-br from-purple-10 to-indigo-50 overflow-y-hidden px-0.5 shadow-lg">


                {/* ========= PRODUCTS ========= */}
                <GridLayoutProduct />

                <AffichePortal/>

                {/* ========= SUBSCRIPTIONS ========= */}
                <section aria-labelledby="subscription-plans" className="text-center translate-y-0 transition-all duration-1000 ease-in-out">

                    <SubscriptionsPage />

                </section>

                {/* ========= SERVICES ========= */}
                <section aria-labelledby="services" className="translate-y-0 translate-x-0 transition-all duration-1000 ease-in-out ">

                    <ServicesPlatforms />     

                    <ServicesSection/>

                </section>

                <section aria-labelledby="Tesmonies" className=" translate-y-0 transition-all duration-1000 ease-in-out ">

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
