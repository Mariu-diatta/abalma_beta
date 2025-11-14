import React, { useEffect, useState , lazy, useCallback} from 'react';

import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import LoadingCard from '../components/LoardingSpin';
import SearchBar from '../components/BtnSearchWithFilter';
import { useDispatch, useSelector } from 'react-redux';
import { formatISODate } from '../utils';
import { updateCategorySelected } from '../slices/navigateSlice';
import TitleCompGen,{ TitleCompGenLitle } from '../components/TitleComponentGen';
import OwnerAvatar from '../components/OwnerProfil';
import { ModalFormCreatBlog } from '../features/BlogCreatBlogs';
import TextParagraphs from '../components/TextToParagraph';
const HomeLayout = lazy(() => import('../layouts/HomeLayout'));


const BlogList = ({ blogs }) => {

    const [viewMore, setViewMore] = useState(false)

    const [selectedBlog, setSelectedBlog] = useState(null)

    const handleClicked = (viewDetail, selectedBlog) => {

        setViewMore(viewDetail)

        setSelectedBlog(selectedBlog)

    }

    // Fonction pour générer les cartes de blog
    const renderBlogs = useCallback(() => {

        if (!blogs || blogs.length === 0) return <p>Aucun blog disponible.</p>;

        else return blogs.map((post, index) => <BlogCard key={index} blog={post} handleClicked={handleClicked} />);

    }, [blogs]);

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-2 min-h-screen content-start">

            {
                (!viewMore) ?
                <>{renderBlogs()}</>
                :
                <BlogDetails blog={selectedBlog} onClose={handleClicked} />
            }

        </div>
    )
};

export const BlogPage = () => {

    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const currentAddedBlog = useSelector(state => state.cart.contentBlog);

    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    const currentUser = useSelector(state => state.auth.user);

    const dispatch = useDispatch();

    useEffect(

        () => {

            if (currentAddedBlog) {

                setBlogs((prev) => ([...prev, currentAddedBlog ]))
            }

        }, [currentAddedBlog]
    )

    useEffect(

        () => {

            dispatch(updateCategorySelected({category:"All", query:""}))

            const getBlogs = async () => {

                setIsLoading(true)

                try {

                    const blogs = await api.get("blogs/");

                    setBlogs(blogs.data)

                    setIsLoading(false)

                } catch (err) {

                    setIsLoading(false)
                }
            }

            getBlogs()

        }, [dispatch]
    )

    useEffect(

        () => {

            const getDataBlogSearch = async (data = categorySelectedData) => {

                const getBlogs = async () => {

                    setIsLoading(true)

                    try {

                        const blogs = await api.get(`blogs/?search=${data?.query}`);

                        setBlogs(blogs.data)

                        setIsLoading(false)

                    } catch (err) {

                        setIsLoading(false)
                    }
                }

                getBlogs()

            }
            getDataBlogSearch()

        },[categorySelectedData]
    )
         
    return (


        <div className="min-h-full py-1 overflow-y-auto scrollbor_hidden">

            <div className="mx-0 lg:mx-auto  max-w-screen-auto text-center lg:mb-3 mb-2">

                <TitleCompGen title={t("blog.title")} />

                <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{t("blog.maint_text_content")}</p>

            </div>


            {
                (currentUser && currentUser?.is_connected) &&
                <SearchBar />
            }

            <div className="relative overflow-x-hidden fixed py-1 px-2 w-full mx-0 lg:mx-auto lg:py-2 lg:px-6 my-6" >

                {
                    !isLoading?
                    <BlogList blogs={blogs}/>
                    :
                    <LoadingCard/>

                }

                <ModalFormCreatBlog/>


            </div>

        </div>
    );
};

const BlogPageHome = () => {

    return (

        <HomeLayout>

            <BlogPage />

        </HomeLayout>
    )
}

export default BlogPageHome;

//la carte article 
const BlogCard = ({blog, handleClicked}) => {

    const { t } = useTranslation();

    return (

        <div
            className="relative w-auto p-2 flex flex-col justify-between rounded-lg 
                 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-700 
                 hover:shadow-md transition-shadow duration-300 h-[20dvh] overflow-hidden"
        >
            {/* Header : Avatar + date */}
            <div className="flex justify-between items-center">

                {blog?.user && <OwnerAvatar owner={blog.user} />}

                <div className="flex items-center text-gray-500 text-sm">

                    <span>{formatISODate(blog?.created_at)}</span>

                </div>

            </div>

            {/* Contenu principal */}
            <div
                className="absolute inset-x-0 px-5 py-1 text-center font-light text-gray-500 
                   dark:text-gray-400 text-sm overflow-hidden text-ellipsis line-clamp-3"
            >
                <TitleCompGenLitle title={blog?.title_blog} />

                <TextParagraphs text={blog?.blog_message} />

            </div>

            {/* Bouton Lire plus */}
            <button
                className="absolute right-2 bottom-2 inline-flex items-center font-medium 
                   text-primary-600 text-sm dark:text-primary-500 hover:underline"
                onClick={() => handleClicked(true,blog)}
            >
                {t("blog.reaMore")}
                <svg
                    className="ml-2 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    />
                </svg>
            </button>
        </div>
    );
};

const BlogDetails = ({ blog, onClose }) => {

    const { t } = useTranslation();

    if (!blog) return null;

    return (

        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => onClose(false, null)}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 
                   overflow-y-auto max-h-[90vh] relative scrollbor_hidden"
                onClick={(e) => e.stopPropagation()} // empêche la fermeture au clic interne
            >
                {/* Bouton fermer */}
                <button
                    onClick={()=>onClose(false, null)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* En-tête du blog */}
                <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-3">
                        {blog?.user && <OwnerAvatar owner={blog.user} />}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {blog.title_blog}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {formatISODate(blog.created_at)}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Image du blog si disponible */}
                {blog.image_url && (
                    <img
                        src={blog.image_url}
                        alt={blog.title_blog}
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                )}

                {/* Contenu principal */}
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {blog.blog_message}
                </div>

                {/* Pied de carte */}
                <div className="mt-6 text-right">

                    <button
                        onClick={() => onClose(false, null)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium 
                       text-white bg-primary-600 rounded-lg hover:bg-primary-700 
                       dark:bg-primary-500 dark:hover:bg-primary-600"
                    >
                        {t("blog.close")}
                    </button>

                </div>

            </div>
        </div>
    );
};



