import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import { formatISODate } from "../utils";
import LoadingCard from "../components/LoardingSpin";
import { TitleCompGenLitle } from "../components/TitleComponentGen";

const MyBlogsList = () => {

    const { t } = useTranslation();

    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);

    const [blogs, setBlogs] = useState([]);

    const [triggerdBtnId, setTriggerdBtnId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    // Charger les blogs
    useEffect(() => {

        if (!currentUser?.id) return;

        const fetchBlogs = async () => {
            setLoading(true);

            try {
                const res = await api.get("byOwnerUser/");
                setBlogs(res?.data?.data || []);

            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();

    }, [currentUser]);

    // Supprimer un blog
    const handleDelete = async (blog) => {

        if (!window.confirm(t("delete_blog_confirm"))) return;

        setTriggerdBtnId(blog?.id);

        setLoadingDelete(true);

        try {

            await api.delete(`/blogs/${blog?.id}/`);

            setBlogs((prev) => prev.filter((b) => b.id !== blog?.id));

        } catch (error) {
            console.error(error);

        } finally {

            setLoadingDelete(false);

            setTriggerdBtnId(null);
        }
    };

    // Filtrer les blogs selon la recherche
    const filteredBlogs = useMemo(() => {

        return blogs.filter(b =>
            b?.title_blog?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b?.blog_message?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }, [blogs, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

    const paginatedBlogs = useMemo(() => {

        const start = (currentPage - 1) * itemsPerPage;

        return filteredBlogs.slice(start, start + itemsPerPage);

    }, [filteredBlogs, currentPage]);

    return (

        <div className="overflow-x-auto sm:rounded-md p-1">

            <nav className="flex flex-row items-center gap-2 mb-2">

                <TitleCompGenLitle title={t("blog.myBlogs")}/>

                <input
                    type="text"
                    placeholder={t("Search")}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="ml-auto border border-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-full p-2 text-sm"
                />

            </nav>

            {
                loading ? (
                    <LoadingCard />
                )
                :
                (
                    <main>

                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-1">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3">{t('blog.blogName')}</th>
                                    <th className="px-6 py-3">{t("blog.blogContent")}</th>
                                    <th className="px-6 py-3">{t("blog.dateBlog")}</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedBlogs?.length === 0 ? (
                                    <tr className="">
                                       <td colSpan="4" className="text-center p-4 ">{t('blogNone')}</td>
                                    </tr>
                                ) : (
                                    paginatedBlogs?.map((blog) => (

                                        <tr key={blog?.id} className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">

                                            <td className="px-6 py-4">{blog?.title_blog}</td>

                                            <td className="px-6 py-4 overflow-x-auto overflow-y-auto">{blog?.blog_message?.slice(0, 30)}...</td>

                                            <td className="px-6 py-4">{formatISODate(blog?.created_at)}</td>

                                            <td className="px-6 py-4 gap-2">
                                                {!(loadingDelete && triggerdBtnId === blog?.id) ? (
                                                    <button
                                                        onClick={() => handleDelete(blog)}
                                                        className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 bg-gradient-to-br from-pink-100 to-orange-50 hover:bg-gradient-to-br hover:to-orange-500 hover:bg-pink-200"
                                                        title={t('delete')}
                                                    >
                                                            <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.4" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                            </svg>

                                                    </button>
                                                ) : (
                                                    <LoadingCard />
                                                )}
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center text-sm dark:text-white text-gray-100 mt-1 pb-6 px-1">
                        
                            <span>
                                {/*{t('TableRecap.pagination.page')} {currentPage} {t('TableRecap.pagination.of')} {totalPages}*/}
                                Page {currentPage} / {totalPages}
                            </span>
                        
                            <div>
                            
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border-gray-100 rounded-full disabled:opacity-40"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                                    </svg>

                                </button>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border-gray-100 rounded-full disabled:opacity-40"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                                    </svg>

                                </button>

                            </div>

                        </div>

                    </main>
                )
            }

        </div>
    );
};

export default MyBlogsList;
