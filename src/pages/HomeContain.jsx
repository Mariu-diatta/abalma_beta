import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, TrendingUp, Users, ShoppingBag, MessageCircle, Bell, Sparkles } from 'lucide-react';

import GridLayoutProduct from '../features/GridLayoutProducts';
import ServicesPlatforms from '../components/AbalmaActivities';
import SubscriptionsPage from './SubscriptionCard';
import TestimonialCarousel from '../components/Testimony';
import ServicesSection from '../features/ServiceSections';
import AffichePortal from '../components/AffichPub';
import AttentionAlertMessage from '../components/AlertMessage';
import TitleCompGen, { TitleCompGenLitle } from '../components/TitleComponentGen';
import UserCard from '../components/Fournisseurs';
import SellerStoriesBar from '../features/SellerStoriesBar';
import api from '../services/Axios';

/* ---------- petits composants utilitaires (local) ---------- */

const StatPill = ({ icon: Icon, label, value, tone = 'indigo' }) => (
    <div className={`flex items-center gap-2 rounded-xl bg-${tone}-50 px-3 py-2 border border-${tone}-100`}>
        <div className={`h-8 w-8 rounded-lg bg-${tone}-500/10 flex items-center justify-center`}>
            <Icon className={`h-4 w-4 text-${tone}-600`} />
        </div>
        <div className="leading-tight">
            <p className="text-[11px] text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const SectionCard = ({ children, className = '' }) => (
    <div className={`bg-white/90 backdrop-blur border border-slate-200/70 shadow-sm shadow-slate-200/40 rounded-2xl ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ emoji, title, action = 'Voir tout', onAction }) => (
    <div className="flex items-center justify-between mb-3 px-1">
        <span className="flex items-center gap-2">
            <span className="text-base">{emoji}</span>
            <TitleCompGenLitle title={title} />
        </span>
        <button
            onClick={onAction}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
            {action}
        </button>
    </div>
);

const LivePulse = () => (
    <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
);

/* ---------- HOME ---------- */

const TABS = [
    { id: 'products', label: 'Produits', icon: ShoppingBag },
    { id: 'sellers', label: 'Vendeurs', icon: Users },
    { id: 'trending', label: 'Tendances', icon: TrendingUp },
];

const HomeContain = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [clients, setClients] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/public/users-clients/');
                if (!cancelled) setClients(data ?? []);
            } catch (err) {
                console.error(err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const filteredClients = useMemo(() => {
        if (!query.trim()) return clients;
        const q = query.toLowerCase();
        return clients.filter(u =>
            (u.username || u.name || '').toLowerCase().includes(q)
        );
    }, [clients, query]);

    return (
        <>
            {/* Notification bar sticky */}
            <div className="sticky top-0 z-50">
                <AttentionAlertMessage />
            </div>

            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-purple-50/30">

                {/* ============ HERO / COMPOSER ============ */}
                <section className="px-3 pt-4">
                    <SectionCard className="p-5 space-y-4 relative overflow-hidden">
                        {/* blob décoratif */}
                        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-300/40 to-purple-300/30 blur-3xl" />

                        <div className="flex items-start justify-between gap-3 relative">
                            <div>
                                <TitleCompGen title="Réseau & Market" />
                                <p className="text-sm text-gray-500 mt-1">
                                    Découvrez des produits, discutez avec les vendeurs et développez votre activité.
                                </p>
                            </div>
                            <button
                                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                            >
                                <Plus className="h-4 w-4" /> Publier
                            </button>
                        </div>

                        {/* Search bar façon réseau social */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Rechercher un produit, un vendeur, un service..."
                                className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            />
                        </div>

                        {/* Quick stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <StatPill icon={Users} label="Vendeurs" value={clients.length || '—'} tone="indigo" />
                            <StatPill icon={ShoppingBag} label="Produits" value="+1.2k" tone="purple" />
                            <StatPill icon={MessageCircle} label="Discussions" value="87" tone="emerald" />
                            <StatPill icon={Bell} label="Live" value="24 en ligne" tone="rose" />
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 pt-1 overflow-x-auto no-scrollbar">
                            {TABS.map(({ id, label, icon: Icon }) => {
                                const active = activeTab === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                            ${active
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-[1.03]'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </SectionCard>
                </section>

                {/* ============ STORIES VENDEURS ============ */}
                <section className="px-3 mt-5">
                    <SectionCard className="p-3">
                        <SellerStoriesBar />
                    </SectionCard>
                </section>

                {/* ============ FEED PRINCIPAL ============ */}
                <section className="px-1 mt-6">
                    <SectionHeader
                        emoji="🔥"
                        title={
                            activeTab === 'products' ? 'Produits populaires' :
                                activeTab === 'sellers' ? 'Vendeurs actifs' :
                                    'Tendances du moment'
                        }
                    />
                    <SectionCard className="p-1 md:p-3">
                        {activeTab === 'products' && <GridLayoutProduct />}

                        {activeTab === 'sellers' && (
                            filteredClients.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredClients.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onProfile={() => { }}
                                            onMessage={() => { }}
                                            onFollow={() => { }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-sm text-gray-500">
                                    Aucun vendeur trouvé.
                                </div>
                            )
                        )}

                        {activeTab === 'trending' && (
                            <div className="p-6 text-center text-sm text-gray-500">
                                <Sparkles className="mx-auto h-6 w-6 text-indigo-400 mb-2" />
                                Les tendances arrivent bientôt.
                            </div>
                        )}
                    </SectionCard>
                </section>

                {/* ============ PUB / AFFICHE ============ */}
                <section className="px-3 mt-6">
                    <SectionCard className="overflow-hidden">
                        <AffichePortal />
                    </SectionCard>
                </section>

                {/* ============ LIVE ACTIVITY ============ */}
                <section className="px-3 mt-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white p-4 shadow-md">
                        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative flex items-start justify-between gap-3">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-semibold">
                                    <LivePulse /> Activité en temps réel
                                </h3>
                                <p className="text-xs opacity-90 mt-1">
                                    Achats récents • discussions • vendeurs actifs
                                </p>
                            </div>
                            <span className="rounded-full bg-white/20 backdrop-blur px-2.5 py-1 text-[11px] font-medium">
                                24 en ligne
                            </span>
                        </div>
                    </div>
                </section>

                {/* ============ SERVICES ============ */}
                <section className="px-3 mt-6 space-y-3">
                    <SectionHeader emoji="🚀" title="Services & opportunités" />
                    <SectionCard className="p-2">
                        <ServicesPlatforms />
                    </SectionCard>
                    <SectionCard className="p-2">
                        <ServicesSection />
                    </SectionCard>
                </section>

                {/* ============ SUBSCRIPTIONS ============ */}
                <section className="px-3 mt-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 mb-3 shadow-md">
                        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                        <span className="flex items-center gap-2 relative">
                            💎 <TitleCompGenLitle title="Booster votre visibilité" />
                        </span>
                        <p className="text-xs opacity-90 relative mt-1">
                            Passez PRO pour vendre plus et apparaître en priorité
                        </p>
                    </div>
                    <SectionCard className="p-2">
                        <SubscriptionsPage />
                    </SectionCard>
                </section>

                {/* ============ TESTIMONIALS ============ */}
                <section className="px-3 mt-6 pb-10">
                    <SectionHeader emoji="💬" title="Avis utilisateurs" action="" />
                    <SectionCard className="p-3">
                        <TestimonialCarousel autoplay autoplayInterval={6000} />
                    </SectionCard>
                </section>
            </main>
        </>
    );
};

export default HomeContain;
