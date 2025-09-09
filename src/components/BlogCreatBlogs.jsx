import React, { useEffect,  useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import LoadingCard from './LoardingSpin';
import { ButtonSimple } from './Button';

export const ModalFormCreatBlog = () => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const profileData = useSelector((state) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const modalRef_ = useRef(null);
    const inputRef = useRef(null);

    // États du formulaire  
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Simule la récupération de l'utilisateur connecté
    // À remplacer par ta logique d'authentification réelle
    const getCurrentUser = () => {

        return { id: 1, name: "Utilisateur Demo" };
    };

    const handleScroll = (ref) => {
        window.scrollTo({
            top: 12,
            left: 0,
            behavior: "smooth",
        });
    };

    const handleToggleModal = () => {
        setError("");
        setSuccess("");
        setIsOpen(!isOpen);
        handleScroll(modalRef_ )
    };

    const handleClose = () => {
        setIsOpen(false);
        setTitle("");
        setMessage("");
        setError("");
        setSuccess("");
    };

    // Focus input quand modal s'ouvre
    useEffect(() => {

        if (isOpen && inputRef.current) {

            inputRef.current.focus();
        }

    }, [isOpen]);

    // Fermer modal si clic à l'extérieur
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {

                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [isOpen]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        setSuccess("");

        if (!title.trim() || !message.trim()) {

            setError(t("blog.fill_all_fields") || "Veuillez remplir tous les champs");

            return;
        }

        try {

            const user = getCurrentUser();

            if (!user) {

                setError(t("blog.user_not_authenticated") || "Utilisateur non authentifié");

                return;
            }

            const payload = {

                title_blog: title,

                blog_message: message,
            };

            // Exemple : POST (ou PUT) vers ton API
            await api.post("blogs/", payload);

            setSuccess(t("blog.blog_created") || "Blog créé avec succès !");

            setTitle("");

            setMessage("");

            // Fermer modal après délai (ex : 1.5s)
            setTimeout(() => {

                handleClose();

            }, 1500);

        } catch (err) {

            console.error("Erreur lors de la création du blog", err);

            setError(t("blog.error_creating") || "Erreur lors de la création du blog");

        } finally {

            setLoading(false)
        }
    };

    return (

        <div className="sticky left-2" role="dialog" aria-modal="true" ref={modalRef_} >

            {/* Toggle Button */}
            {
                
                <button
                    onClick={(profileData && profileData?.email) ? handleToggleModal:()=>alert("Vous devrez vous connecter avant !!!")}
                    className="w-full rounded-full flex gap-1 bg-blue-300 text-white text-sm px-3 py-1 hover:bg-blue-700 items-centerbg-gradient-to-br from-purple-300 to-blue-300 bg-gradient-to-br hover:from-purple-400 "
                    aria-expanded={isOpen}
                    aria-controls="modal-blog-form"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                        />

                    </svg>

                    <span>{t("blog.blog")}</span>

                </button>
            }

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    role="dialog"
                    id="modal-blog-form"
                >
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">

                            <h2
                                id="modal-title"
                                className="text-2xl font-extrabold text-gray-700 dark:text-white"
                            >
                                {t("blog.create_blog")}
                            </h2>

                            <button
                                onClick={handleClose}
                                aria-label={t("blog.close_modal") || "Fermer la fenêtre"}
                                className="text-gray-400 hover:text-gray-900 dark:hover:text-white w-full"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />

                                </svg>

                            </button>

                        </div>

                        {/* Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>

                            <div>

                                <label
                                    htmlFor="title-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t("blog.title_pop")}

                                </label>

                                <input
                                    id="title-input"
                                    ref={inputRef}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border px-3 py-2 rounded-md text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-300"
                                    placeholder={t("blog.title_placeholder") || "Titre du blog"}
                                    required
                                />

                            </div>

                            <div>

                                <label
                                    htmlFor="message-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {t("blog.description")}
                                </label>

                                <textarea
                                    id="message-input"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full border px-3 py-2 rounded-md text-sm border-gray-300 focus:ring-blue-500 focus:border-gray-100"
                                    placeholder={t("blog.description_placeholder") || "Contenu du blog..."}
                                    required
                                />

                            </div>

                            {error && (
                                <p className="text-red-600 dark:text-red-400">{error}</p>
                            )}

                            {success && (
                                <p className="text-green-600 dark:text-green-400">{success}</p>
                            )}

                            {/* Footer */}
                            <div className="flex justify-end gap-2 pt-1">

                                {
                                    loading?
                                    <ButtonSimple
                                        title={t("blog.submit")}
                                    />
                                    :
                                    <LoadingCard/>
                                }

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-md text-sm border bg-red-800 border-gray-300 text-gray-100 hover:bg-red-900 "
                                >
                                    {t("blog.cancel")}

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};