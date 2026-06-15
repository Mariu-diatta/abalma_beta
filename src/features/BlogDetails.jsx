import React from 'react'
import { formatISODate } from '../utils';
import OwnerAvatar from '../components/OwnerProfil';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const BlogDetails = ({ blog, onClose }) => {

    const { t } = useTranslation();

    if (!blog) return null;

    return (
        <AnimatePresence>
            <main
                className="fixed inset-0 bg-white/50 flex justify-center items-center z-[9998]"
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
                    className="rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 
                    overflow-y-auto max-h-[90vh] relative scrollbor_hidden bg-white "
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >

                    {/* Bouton fermer */}
                    <button
                        onClick={() => onClose(false, null)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 "
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    {/* En-tête */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">

                            {blog?.user && <OwnerAvatar owner={blog?.user} />}

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 ">
                                    {blog?.title_blog}
                                </h2>

                                <p className="text-md text-gray-500">
                                    {formatISODate(blog?.created_at)}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Image */}
                    {blog?.image_url && (
                        <motion.img
                            src={blog.image_url}
                            alt={blog.title_blog}
                            className="w-full h-60 object-cover rounded-lg mb-4"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}

                    {/* Contenu */}
                    <div className="leading-relaxed whitespace-pre-line">
                        {blog?.blog_message}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-right">
                        <button
                            onClick={() => onClose(false, null)}
                            className="inline-flex items-center px-4 py-2 text-md font-medium 
                            bg-primary-600 rounded-lg hover:bg-primary-700 
                            dark:bg-primary-500 dark:hover:bg-primary-600"
                        >
                            {t("blog.close")}
                        </button>
                    </div>

                </motion.div>
            </main>
        </AnimatePresence>
    );
};

export default BlogDetails;