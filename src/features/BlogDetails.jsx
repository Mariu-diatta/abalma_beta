import React from 'react'
import { formatISODate } from '../utils';
import OwnerAvatar from '../components/OwnerProfil';
import { useTranslation } from 'react-i18next';


const BlogDetails = ({ blog, onClose }) => {

    const { t } = useTranslation();

    if (!blog) return null;

    return (

        <main
            className="fixed inset-0  backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => onClose(false, null)}
        >
            <div
                className=" rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 
                overflow-y-auto max-h-[90vh] relative scrollbor_hidden"
                onClick={(e) => e.stopPropagation()} // empêche la fermeture au clic interne
            >
                {/* Bouton fermer */}
                <button
                    onClick={() => onClose(false, null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    ✕

                </button>

                {/* En-tête du blog */}
                <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-3">

                        {blog?.user && <OwnerAvatar owner={blog?.user} />}

                        <div>

                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {blog?.title_blog}
                            </h2>

                            <p className="text-md text-gray-500">
                                {formatISODate(blog?.created_at)}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Image du blog si disponible */}
                {
                    blog?.image_url && (
                        <img
                            src={blog.image_url}
                            alt={blog.title_blog}
                            className="w-full h-60 object-cover rounded-lg mb-4"
                        />
                    )
                }

                {/* Contenu principal */}
                <div className=" leading-relaxed whitespace-pre-line">

                    {blog?.blog_message}

                </div>

                {/* Pied de carte */}
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

            </div>

        </main>
    );
};

export default BlogDetails;