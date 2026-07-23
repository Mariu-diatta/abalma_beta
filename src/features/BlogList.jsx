import React, { useEffect, Suspense } from "react";
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

export default function BlogList() {

    const { t } = useTranslation()

    const currentUser = useSelector((state) => state.auth.user);

    const [blogs, setBlogs] = useState([])

    const [loading, setLoading] = useState(false)


    useEffect(() => {

        const allblogs = async () => {

            try {
                setLoading(true)
                const { data } = await api.get(API_ENDPOINTS.BLOG.LIST)
                setBlogs(data)

            } catch (e) {
                console.log(e)

            } finally {
                setLoading(false)
            }

        }

        allblogs()

    }, [])

    return (
        <div className="h-full w-full  bg-none ">

            <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8 px-1 py-8 items-start">

                {/* Sidebar gauche */}
                <aside className="hidden md:block md:sticky md:top-[8dvh] md:self-start">

                    <div className={`${currentUser?.photo_url ? "bg-white rounded-2xl p-6 shadow" :"hidden"}`}>

                        <img
                            src={currentUser?.photo_url}
                            alt=""
                            className="w-20 h-20 rounded-full mx-auto"
                        />

                        <h2 className="text-center mt-4 font-bold">
                            Votre Boutique
                        </h2>

                        <p className="text-center text-gray-500 text-sm truncate">
                            {currentUser?.description}
                        </p>

                        {/*<button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl">*/}
                        {/*    Créer un article*/}
                        {/*</button>*/}
                    </div>
                </aside>

                {/* Feed */}
                <main className="lg:col-span-2 space-y-8">
                    {
                        (blogs.length === 0) && !loading &&
                        <div className="mbl-empty">
                            <div className="mbl-empty-icon">📭</div>
                            <p className="mbl-empty-title">
                                {t('blogNone')}
                            </p>
                        </div>
                    }

                    <Suspense Callback={"..."}>

                        {
                            blogs.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-3xl shadow overflow-hidden"
                            >
                                {/* Author */}
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

                                {/* Video */}
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

                                {/* Content */}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-3">
                                        {post?.title_blog}
                                    </h2>

                                    <p className="text-gray-600 leading-7">
                                        {post?.blog_message}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex justify-between mt-8">

                                        <LikeButton
                                            contentType="usersblog"
                                            objectId={post.id}
                                            initialLiked={post.is_liked}
                                            initialCount={post.likes_count}
                                        />

                                        <button className="flex items-center gap-2 text-gray-600 hidden">
                                            <MessageCircle size={22} />
                                            {post?.comments??0}
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

                </main>

                {/* Trending */}
                <aside

                    className=" md:block md:sticky md:top-[8dvh] h-fit"

                >
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="font-bold text-xl mb-6">
                            Tendances
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <h3 className="font-semibold">
                                    #Artisanat
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    2 500 publications
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    #Cuisine
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    1 920 publications
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    #Mode
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    1 420 publications
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    #Décoration
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    980 publications
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}