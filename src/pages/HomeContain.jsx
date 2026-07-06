import React, { useEffect } from 'react';
import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';
import ServicesSection from '../features/ServiceSections';
import AffichePortal from '../components/AffichPub';
import AttentionAlertMessage from '../components/AlertMessage';
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';
import { useState } from 'react';
import UserCard from '../components/Fournisseurs';
import api from '../services/Axios';

const HomeContain = () => {

    const [activeTab, setActiveTab] = useState('products');


    const [clients, setClients] = useState([]);

    //const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchClients = async () => {

            try {

                const { data } = await api.get("/public/users-clients/");

                setClients(data);
                console.log("les données", data)
            } catch (error) {

                console.error(error);

            } finally {

                //setLoading(false);

            }

        };

        fetchClients();

    }, []);

    return (
        <>
            {/* ALERT FIXE (type notification réseau social) */}
            <div className="sticky top-0 z-50">
                <AttentionAlertMessage />
            </div>

            {/* PAGE ROOT */}
            <main className="min-h-screen bg-gradient-to-b from-white via-indigo-50/20 to-purple-50/30">

                {/* ================= HERO FEED ================= */}
                <section className="px-3 pt-6">
                    <div className="bg-white border border-white/20 shadow-sm rounded-2xl p-5 space-y-3">

                        <TitleCompGen title="Réseau & Market"/>

                        <p className="text-sm text-gray-500">
                            Découvrez des produits, discutez avec les vendeurs et développez votre activité.
                        </p>

                        <div className="flex gap-2 pt-2">

                            {/* PRODUITS */}
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`px-4 py-2 rounded-xl text-sm transition-all duration-200
                                        ${activeTab === 'products'
                                        ? 'bg-indigo-300 text-white shadow-md scale-[1.02]'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Explorer les produits
                            </button>

                            {/* VENDEURS */}
                            <button
                                onClick={() => setActiveTab('sellers')}
                                className={`px-4 py-2 rounded-xl text-sm transition-all duration-200
                                        ${activeTab === 'sellers'
                                        ? 'bg-indigo-300 text-white shadow-md scale-[1.02]'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Vendeurs actifs
                            </button>

                        </div>
                    </div>
                </section>

                {/* ================= FEED PRODUITS ================= */}
                <section className="px-3 mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold">🔥 Produits populaires</h2>
                        <span className="text-xs text-gray-400">Voir tout</span>
                    </div>

                    <div className="bg-white border border border-white/20  shadow-sm rounded-2xl p-2">
                        {activeTab === 'products' ? (
                            <GridLayoutProduct />
                        ) : (
                            <>
                                {/* Ici tu peux mettre ton composant vendeurs */}
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                        {(clients.length > 0) && clients?.map((user) => (

                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                onProfile={() => "handleProfile"}
                                                onMessage={() => "handleMessage"}
                                                onFollow={() => "handleFollow"}
                                            />

                                        ))}

                                    </div>                            </>
                        )}
                    </div>
                </section>

                {/* ================= PUBLICITÉ / PROMO ================= */}
                <section className="px-3 mt-6">
                    <div className="bg-white border  border-white/20  shadow-sm rounded-2xl overflow-hidden">
                        <AffichePortal />
                    </div>
                </section>

                {/* ================= ACTIVITÉ SOCIAL FEED ================= */}
                <section className="px-3 mt-6">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4">

                        <h3 className="text-sm font-semibold">
                            🔥 Activité en temps réel
                        </h3>

                        <p className="text-xs opacity-90 mt-1">
                            Achats récents • discussions • vendeurs actifs
                        </p>
                    </div>
                </section>

                {/* ================= SERVICES ================= */}
                <section className="px-3 mt-6 space-y-3">
                    <span className="flex gap-2">🚀   <TitleCompGenLitle title="Services & opportunités" />  </span>

                    <div className="bg-white border border border-white/20  rounded-2xl shadow-sm p-2">
                        <ServicesPlatforms />
                    </div>

                    <div className="bg-white border border border-white/20  rounded-2xl shadow-sm p-2">
                        <ServicesSection />
                    </div>
                </section>

                {/* ================= SUBSCRIPTIONS (STYLE PREMIUM) ================= */}
                <section className="px-3 mt-6">
                    <div className="bg-gradient-to-r from-indigo-200 to-purple-600 text-white rounded-2xl p-4 mb-3">
                        <span className="flex gap-2 text-white-500">💎 <TitleCompGenLitle title="Booster votre visibilité" />  </span>
                        <p className="text-xs opacity-90">
                            Passez PRO pour vendre plus et apparaître en priorité
                        </p>
                    </div>

                    <div className="bg-white border border border-white/20  shadow-sm rounded-2xl p-2">
                        <SubscriptionsPage />
                    </div>
                </section>

                {/* ================= TESTIMONIALS ================= */}
                <section className="px-3 mt-6 pb-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="flex gap-2">💬 <TitleCompGenLitle title="Avis utilisateurs " />  </span>  
                    </div>

                    <div className="bg-white border border border-white/20  shadow-sm rounded-2xl p-3">
                        <TestimonialCarousel
                            autoplay
                            autoplayInterval={6000}
                        />
                    </div>
                </section>

            </main>
        </>
    );
};

export default HomeContain;