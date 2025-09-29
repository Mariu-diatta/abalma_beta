import React, { useEffect, useState } from "react";
import { useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import LoadingCard from "./LoardingSpin"
import { ButtonSimple } from "./Button";
import { formatISODate } from "../utils";

const MyBlogsList = () => {

    const { t } = useTranslation();
    const currentUser = useSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [triggerdBtnId, setTriggerdBtnId] = useState(null);

    /** 🟢 Charger les produits de l’utilisateur */
    useEffect(() => {

        if (!currentUser?.id) return;

        const fetchProducts = async () => {

            setLoading(true);

            try {

                const blogsOwner = await api.get("byOwnerUser/");

                setBlogs(blogsOwner?.data?.data);

            } catch (error) {

                //console.error("Erreur lors du chargement des blogs:", error);

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, [currentUser]);

    /** 🟢 Supprimer un produit */
    const handleDelete = async (blog) => {

        if (window.confirm(t("delete_blog_confirm"))){

            setTriggerdBtnId(blog?.id)

            setLoadingDelete(true);

            try {

                await api.delete(`/blogs/${blog?.id}/`);

                setBlogs((prev) => prev.filter((p) => p.id !== blog?.id)); // Mise à jour locale

            } catch (error) {

                console.error("Erreur de suppression:", error);

            } finally {

                setLoadingDelete(false)
                setTriggerdBtnId(null)

            }
        }
    };

    return (

        <div

            className="style_bg mb-2 relative overflow-x-auto sm:rounded-md p-2"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)",
            }}
        >
            <nav className="flex flex-row items-center gap-2">

                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"
                    />
                </svg>

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">
                    {t("blog.myBlogs")}
                </h2>

            </nav>

            {
                loading ?
                (
                    <LoadingCard />
                )
                : 
                (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-sm p-2">

                        <thead className="text-sm style_bg">

                            <tr>
                                <th className="px-6 py-3">{t('blog.blogName')}</th>
                                <th className="px-6 py-3">{t("blog.blogContent")}</th>
                                <th className="px-6 py-3">{t("blog.dateBlog")}</th>
                                {/*<th className="px-6 py-3">{t("tableEntries.price")}</th>*/}
                                {/*<th className="px-6 py-3"></th>*/}
                                <th className="px-6 py-3"></th>
                            </tr>

                        </thead> 

                        <tbody>

                            {
                                Array.isArray(blogs) &&

                                blogs.map((blog) => (

                                    <tr
                                        key={blog?.id}

                                        className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >

                                        <td className="px-6 py-4">
                                            {blog?.title_blog}
                                        </td>

                                        <td className="px-6 py-4 overflow-x-auto overflow-y-auto">
                                            {blog?.blog_message}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatISODate(blog?.created_at)}
                                        </td>

                                        <td className="px-6 py-4 gap-2">

                                            {
                                                !(loadingDelete &&  triggerdBtnId===blog?.id)?
                                                <ButtonSimple

                                                    onHandleClick={() => handleDelete(blog)}

                                                    className="px-3 rounded-md hover:bg-gray-100 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-br hover:to-orange-500"

                                                    title={t("delete")}
                                                />
                                                :
                                                <LoadingCard />
                                            }

                                        </td>

                                    </tr>
                                ))}

                        </tbody>

                    </table>
                )
            }

        </div>
    );
};

export default MyBlogsList;




