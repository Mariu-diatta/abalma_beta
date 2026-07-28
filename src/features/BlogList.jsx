import React, { useEffect, Suspense, useRef, useCallback } from "react";
import {
    MessageCircle,
    Share2,
    Bookmark,
} from "lucide-react";
import { useState } from "react";
import api from "../services/Axios";
import API_ENDPOINTS from "../services/apiEndpoints";
import { useSelector } from 'react-redux';
import { formatRelativeDate } from "../utils";
import LikeButton from "../components/LikeButton";
import { useTranslation } from "react-i18next";

const TRENDS = [
    { tag: "#Artisanat", count: "2 500 publications" },
    { tag: "#Cuisine", count: "1 920 publications" },
    { tag: "#Mode", count: "1 420 publications" },
    { tag: "#Décoration", count: "980 publications" },
];

const TrendingDesktop = () => (
    <aside className="hidden lg:block lg:sticky lg:top-[8dvh] h-fit order-3">
        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-xl mb-6">Tendances</h2>
            <div className="space-y-5">
                {TRENDS.map((trend) => (
                    <div key={trend.tag}>
                        <h3 className="font-semibold">{trend.tag}</h3>
                        <p className="text-gray-500 text-sm">{trend.count}</p>
                    </div>
                ))}
            </div>
        </div>
    </aside>
);

const TrendingMobile = () => (
    <div className="lg:hidden order-1 -mx-1">
        <h2 className="font-bold text-lg mb-3 px-1">Tendances</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide">
            {TRENDS.map((trend) => (
                <div
                    key={trend.tag}
                    className="shrink-0 snap-start bg-white rounded-2xl shadow px-4 py-3 min-w-[150px]"
                >
                    <h3 className="font-semibold text-sm whitespace-nowrap">{trend.tag}</h3>
                    <p className="text-gray-500 text-xs mt-1 whitespace-nowrap">{trend.count}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function BlogList({ searchQuery, newBlog }) {

    const { t } = useTranslation()

    const currentUser = useSelector((state) => state.auth.user);

    const [blogs, setBlogs] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [loading, setLoading] = useState(false)

    const loadingRef = useRef(loading);
    const nextPageRef = useRef(nextPage);

    useEffect(() => { loadingRef.current = loading; }, [loading]);
    useEffect(() => { nextPageRef.current = nextPage; }, [nextPage]);

    useEffect(() => {

        const fetchBlogs = async () => {
            try {
                setLoading(true)
                const endpoint = searchQuery
                    ? API_ENDPOINTS.BLOG.SEARCH(searchQuery)
                    : API_ENDPOINTS.BLOG.LIST;

                const { data } = await api.get(endpoint)
                setBlogs(Array.isArray(data?.results) ? data.results : [])
                setNextPage(data?.next ?? null)
            } catch (e) {
                console.log(e)
                setBlogs([])
                setNextPage(null)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()

    }, [searchQuery])

    useEffect(() => {
        if (newBlog) {
            setBlogs((prev) => [newBlog, ...(Array.isArray(prev) ? prev : [])]);
        }
    }, [newBlog])

    const loadMoreBlogs = useCallback(async () => {
        if (!nextPageRef.current || loadingRef.current) return;

        try {
            setLoading(true);

            const { data } = await api.get(nextPageRef.current);
            const results = Array.isArray(data?.results) ? data.results : [];

            setBlogs(prev => [...(Array.isArray(prev) ? prev : []), ...results]);
            setNextPage(data?.next ?? null);

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const sentinelRef = useRef(null);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreBlogs();
                }
            },
            { rootMargin: "800px" }
        );

        observer.observe(node);

        return () => observer.disconnect();

    }, [loadMoreBlogs]);

    return (
        <div className="h-full w-full bg-none">

            <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-8 px-1 py-[3dvh] items-start">

                <TrendingMobile />

                <aside className="hidden md:block md:sticky md:top-[8dvh] md:self-start order-2 lg:order-1">

                    <div className={`${currentUser?.photo_url ? "bg-white rounded-2xl p-6 shadow" : "hidden"}`}>

                        <img
                            src={currentUser?.photo_url}
                            alt=""
                            className="w-20 h-20 rounded-full mx-auto"
                        />

                        <h2 className="text-center mt-4 font-bold hidden">
                            Votre Boutique
                        </h2>

                        <p className="text-center text-gray-500 text-sm truncate">
                            {currentUser?.description}
                        </p>

                    </div>
                </aside>

                <main className="order-3 lg:order-2 lg:col-span-2 space-y-8 w-full">
                    {
                        (blogs?.length === 0) && !loading &&
                        <div className="mbl-empty">
                            <div className="mbl-empty-icon">📭</div>
                            <p className="mbl-empty-title">
                                {t('blogNone')}
                            </p>
                        </div>
                    }

                    <Suspense fallback={"..."}>

                        {
                            blogs.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-3xl shadow overflow-hidden"
                                >
                                    <div className="p-5 flex items-center">
                                        <img
                                            src={post.user?.photo_url}
                                            alt=""
                                            className="w-12 h-12 rounded-full"
                                        />

                                        <div className="ml-4">
                                            <h3 className="font-semibold">
                                                {post.user?.prenom}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {formatRelativeDate(post.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`${post.video ? "relative" : "hidden"}`}>
                                        <video
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-[420px] object-cover"
                                        >
                                            <source src={post.video} type="video/mp4" />
                                        </video>
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold mb-3">
                                            {post?.title_blog}
                                        </h2>

                                        <p className="text-gray-600 leading-7">
                                            {post?.blog_message}
                                        </p>

                                        <div className="flex justify-between mt-8">

                                            <LikeButton
                                                contentType="usersblog"
                                                objectId={post.id}
                                                initialLiked={post.is_liked}
                                                initialCount={post.likes_count}
                                            />

                                            <button className="flex items-center gap-2 text-gray-600 hidden">
                                                <MessageCircle size={22} />
                                                {post?.comments ?? 0}
                                            </button>

                                            <button className="flex items-center gap-2 text-gray-600 hidden">
                                                <Share2 size={22} />
                                                Partager
                                            </button>

                                            <button className="text-gray-600 hidden">
                                                <Bookmark size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </Suspense>

                    {/* Sentinelle pour le scroll infini */}
                    <div ref={sentinelRef} className="h-4 w-full" />

                    {loading && (
                        <div className="flex justify-center py-6">
                            <span className="text-sm text-gray-400">Chargement...</span>
                        </div>
                    )}

                </main>

                <TrendingDesktop />

            </div>
        </div>
    );
}