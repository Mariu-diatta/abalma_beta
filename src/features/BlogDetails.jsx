import React from 'react'
import { formatISODate } from '../utils';
import OwnerAvatar from '../components/OwnerProfil';
//import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const BlogDetails = ({ blog, onClose }) => {

    //const { t } = useTranslation();

    if (!blog) return null;

    return (
        <AnimatePresence>
            <main
                className="
                    fixed
                    inset-0
                    bg-black/60
                    backdrop-blur-sm
                    flex
                    justify-center
                    items-center
                    z-[9998]
                    p-3
                "
                onClick={() => onClose(false, null)}
            >

                {/* Overlay fade */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Modal */}
                <motion.div
                    className="
                    relative
                    w-full
                    max-w-2xl
                    max-h-[92vh]
                    overflow-hidden
                    rounded-lg
                    bg-white
                    shadow-2xl
                    border
                    border-gray-100
                    "
                    onClick={(e) => e.stopPropagation()}
                    initial={{
                        opacity: 0,
                        y: 40,
                        scale: 0.96
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        y: 40,
                        scale: 0.96
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeOut"
                    }}
                >

                    {/* Bouton fermer */}
                    <button
                        onClick={() => onClose(false, null)}
                        className="
                            absolute
                            top-4
                            right-4
                            w-10
                            h-10
                            rounded-full
                            bg-white
                            shadow
                            hover:scale-110
                            transition
                            "
                    >
                        ✕
                    </button>

                    {/* En-tête */}
                    <div className="flex items-start gap-3">

                        <OwnerAvatar owner={blog.user} />

                        <div className="flex-1">

                            <div className="flex items-center gap-2">

                                <h2 className="font-semibold text-gray-900">
                                    {blog.user?.prenom} {blog.user?.nom}
                                </h2>

                                {blog.user?.is_pro && (
                                    <span className="text-blue-600 text-xs">
                                        ✔ PRO
                                    </span>
                                )}

                            </div>

                            <p className="text-sm text-gray-500">
                                {formatISODate(blog.created_at)}
                            </p>

                        </div>

                    </div>
                    {/* Image */}
                    {blog?.image_url && (
                        <motion.img
                            src={blog.image_url}
                            alt={blog.title_blog}
                            className="
                                w-full
                                max-h-[500px]
                                object-cover
                                rounded-2xl
                                overflow-hidden
                             "
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    {/* Contenu */}
                    <div
                        className="
                            mt-5
                            text-[16px]
                            leading-8
                            text-gray-700
                            whitespace-pre-line
                        "
                    >
                        {blog?.blog_message}
                    </div>

                    {/* Footer */}
                    {/*<div className="mt-6 text-right">*/}
                    {/*    <button*/}
                    {/*        onClick={() => onClose(false, null)}*/}
                    {/*        className="inline-flex items-center px-4 py-2 text-md font-medium */}
                    {/*        bg-primary-600 rounded-lg hover:bg-primary-700 */}
                    {/*        dark:bg-primary-500 dark:hover:bg-primary-600"*/}
                    {/*    >*/}
                    {/*        {t("blog.close")}*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    <div className="flex justify-center gap-5 mt-6 border-0 py-3">

                        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">

                            ❤️

                            J'aime

                        </button>

                        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">

                            💬

                            Commenter

                        </button>

                        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">

                            🔗

                            Partager

                        </button>

                    </div>

                </motion.div>


            </main>
        </AnimatePresence>
    );
};

export default BlogDetails;