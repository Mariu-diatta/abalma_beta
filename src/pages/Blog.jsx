import React, { useEffect, useState , lazy, useCallback} from 'react';

import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import LoadingCard from '../components/LoardingSpin';
import { ModalFormCreatBlog } from '../components/BlogCreatBlogs';
import SearchBar from '../components/BtnSearchWithFilter';
import { useDispatch, useSelector } from 'react-redux';
import { formatISODate } from '../utils';
import { updateCategorySelected } from '../slices/navigateSlice';
import TitleCompGen from '../components/TitleComponentGen';
const HomeLayout = lazy(() => import('../layouts/HomeLayout'));


export const BlogPage = () => {

    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const currentNav = useSelector(state => state.navigate.currentNav);

    const dispatch = useDispatch()


    const fetchBlogs = useCallback(() => {

        return blogs.map((post, index) => (

            <BlogCard key={index} {...post} />
        ));

    }, [blogs]);

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


    const getDataBlogSearch= async (data) => {

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
         
    return (

        <div className="mt-5 dark:bg-gray-900 bg_home z-8 shadow-sm">

            <div className="py-2 px-2 max-w-screen mx-0 lg:mx-auto lg:py-16 lg:px-6 style-bg">

                <div className="mx-0 lg:mx-auto  max-w-screen-auto text-center lg:mb-16 mb-8">

                    <TitleCompGen title={t("blog.title")}/>

                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{t("blog.maint_text_content")}</p>

                </div>

                <div className={`flex mx-auto items-center md:hidden ${(currentNav === "home" || currentNav === "blogs") ? "" : "hidden"}`} >

                    <SearchBar onSearch={getDataBlogSearch} />

                </div>

                {
                    !isLoading ?
                    <div className="grid gap-8 lg:grid-cols-2">
                        {fetchBlogs()}
                    </div>
                    :
                    <LoadingCard />
                }

                <div className="flex justify-end  pr-2 my-8">

                    <ModalFormCreatBlog />

                </div>


            </div>


        </div>
    );
};



const BlogPageHome = () => {

    return (

        <HomeLayout >
             
            <BlogPage />

        </HomeLayout>
    )
}

export default BlogPageHome;



//la carte article 
const BlogCard = (blog) => {

    const { t } = useTranslation();

    return (

        <article className="w-auto p-1 rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">

            <div className="flex justify-between items-center mb-5 text-gray-500">

                <TitleCompGen title={blog.title_blog}/>

                <span className="text-sm">{formatISODate(blog.created_at)}</span>

            </div>

            <p className="mb-5 font-light text-gray-500 dark:text-gray-400 text-sm text-center">{blog.blog_message}</p>

            <div className="flex justify-between items-center">

                <div className="flex items-center space-x-4">

                    <img className="w-7 h-7 rounded-full" src={blog.user.image} alt={`${blog.user.nom} avatar`} />

                    <span className="font-medium dark:text-white text-sm">{blog.user.nom}</span>

                </div>

                <a href={"/logIn"} className="inline-flex items-center font-medium text-primary-600 text-sm dark:text-primary-500 hover:underline">

                    {t("blog.reaMore")}

                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">

                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />

                    </svg>

                </a>

            </div>


        </article>
    );
};



