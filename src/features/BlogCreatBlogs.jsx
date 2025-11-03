import React, { useEffect,  useRef, useState } from 'react';
import { useDispatch} from 'react-redux';
import api from '../services/Axios';
import { useTranslation } from 'react-i18next';
import { updateContentBlog } from '../slices/cartSlice';
import LoadingCard from '../components/LoardingSpin';
import { ButtonSimple } from '../components/Button';
import TitleCompGen from '../components/TitleComponentGen';
import ButtonCreatBlog from '../components/ButtonBlogCreat';

export const ModalFormCreatBlog = () => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const modalRef_ = useRef(null);
    const inputRef = useRef(null);

    // États du formulaire  
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useDispatch()

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
        setSuccess("")

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
            const response = await api.post("blogs/", payload);

            dispatch(updateContentBlog(response?.data))

            setSuccess(t("blog.blog_created") || "Blog créé avec succès !");

            setTitle("");

            setMessage("");

            // Fermer modal après délai (ex : 1.5s)
            setTimeout(() => {

                handleClose();

            }, 1500);

        } catch (err) {

            console.error("Erreur lors de la création du blog", err?.response?.data?.detail);

            setError(err?.response?.data?.detail || t("blog.error_creating") || "Erreur lors de la création du blog");

        } finally {

            setLoading(true)
        }
    };

    return (

        <div className="bg-none z-0"  ref={modalRef_} >

            {/* Modal */}
            {
                isOpen && (
                <div
                    className="fixed w-full h-full inset-0 bg-black/50  flex items-center justify-center p-2 inset-0 mb-8  z-[100] pb-8 "
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    role="dialog"
                    id="modal-blog-form"
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-2"
                    >
                        {/* Header */}
                        <div className="flex justify-between gap-4  mb-4">

                            <TitleCompGen title={t('blog.create_blog')} />

                            <button
                                onClick={handleClose}
                                aria-label={t("blog.close_modal") || "Fermer la fenêtre"}
                                className="absolute right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white "
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
                                    className="whitespace-nowrap block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                            <div className="flex justify-end items-end gap-1 pt-1">

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
                                    className="px-1 py-1 rounded-md text-sm border bg-red-300 border-gray-300 text-gray-100 hover:bg-red-400"
                                >
                                    {t("blog.cancel")}

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
                )
            }

            {/* Toggle Button */}
            <ButtonCreatBlog
                handleToggleModal={handleToggleModal}
                isOpen={isOpen}
            />

        </div>
    );
};