import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/Axios";
import { formatRelativeDate } from "../utils";
import LikeButton from "../components/LikeButton";

/**
 * Page d'affichage d'UN SEUL post de blog (route `/blog/:id`).
 *
 * ⚠️ Contrairement à `BlogList`, ce composant n'affiche QU'UN SEUL
 * post à la fois : c'est donc l'endroit correct pour utiliser
 * `<Helmet>` (une seule instance montée = pas de conflit possible
 * entre plusieurs posts pour savoir quelles balises "gagnent" dans le
 * <head>).
 *
 * Important à comprendre : ce `<Helmet>` sert uniquement à mettre à
 * jour le titre de l'onglet du navigateur et les balises meta POUR
 * les vrais visiteurs humains de la SPA (utile pour le SEO côté
 * Google qui, contrairement aux robots de réseaux sociaux, exécute le
 * JavaScript). Il n'a PAS d'effet sur l'aperçu de partage
 * WhatsApp/Facebook/Twitter — celui-ci est désormais géré côté
 * serveur par la route Django `/share/blog/<id>/` (voir
 * `abalma_backend/social_share.py` et `sharePost` dans
 * `BlogList.jsx`), car ces robots n'exécutent jamais ce composant.
 */
export default function BlogDetail() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(false);
                const { data } = await api.get(`/blogs/${id}/`);
                if (!cancelled) setPost(data);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPost();

        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <span className="text-sm text-gray-400">Chargement...</span>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="mbl-empty">
                <div className="mbl-empty-icon">📭</div>
                <p className="mbl-empty-title">Publication introuvable.</p>
            </div>
        );
    }

    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    // Même logique de choix d'image que côté serveur (social_share.py) :
    // jamais une vidéo, on préfère la photo de l'auteur.
    const previewImage = post.user?.photo_url;

    return (
        <div className="max-w-2xl mx-auto py-[3dvh] px-2">
            {/*
                Un seul <Helmet> pour toute la page : pas de risque de
                conflit entre plusieurs posts comme c'était le cas dans
                BlogList.
            */}
            <Helmet>
                <title>{post.title_blog}</title>
                <meta name="description" content={post.blog_message?.slice(0, 200)} />

                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:title" content={post.title_blog} />
                <meta property="og:description" content={post.blog_message?.slice(0, 200)} />
                {previewImage && <meta property="og:image" content={previewImage} />}

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title_blog} />
                <meta name="twitter:description" content={post.blog_message?.slice(0, 200)} />
                {previewImage && <meta name="twitter:image" content={previewImage} />}
            </Helmet>

            <div className="bg-white rounded-3xl shadow overflow-hidden">
                <div className="p-5 flex items-center">
                    <img
                        src={post.user?.photo_url}
                        alt=""
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                        <h3 className="font-semibold">{post.user?.prenom}</h3>
                        <span className="text-sm text-gray-500">
                            {formatRelativeDate(post.created_at)}
                        </span>
                    </div>
                </div>

                {post.video && (
                    <div className="relative">
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
                )}

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3">{post.title_blog}</h2>
                    <p className="text-gray-600 leading-7">{post.blog_message}</p>

                    <div className="flex justify-between mt-8">
                        <LikeButton
                            contentType="usersblog"
                            objectId={post.id}
                            initialLiked={post.is_liked}
                            initialCount={post.likes_count}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}