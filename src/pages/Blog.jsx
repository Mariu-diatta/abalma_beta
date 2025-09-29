import React, { useEffect, useState , lazy, useCallback} from 'react';

import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import LoadingCard from '../components/LoardingSpin';
import { ModalFormCreatBlog } from '../components/BlogCreatBlogs';
import SearchBar from '../components/BtnSearchWithFilter';
import { useDispatch, useSelector } from 'react-redux';
import { formatISODate } from '../utils';
import { updateCategorySelected } from '../slices/navigateSlice';
import TitleCompGen,{ TitleCompGenLitle } from '../components/TitleComponentGen';
import OwnerAvatar from '../components/OwnerProfil';
const HomeLayout = lazy(() => import('../layouts/HomeLayout'));


export const BlogPage = () => {

    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const currentNav = useSelector(state => state.navigate.currentNav);

    const currentAddedBlog = useSelector(state => state.cart.contentBlog);

    const dispatch = useDispatch()

    const fetchBlogs = useCallback(() => {

        return blogs.map((post, index) => (

            <BlogCard key={index} {...post} />
        ));

    }, [blogs]);

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


        <div className=" dark:bg-gray-900 bg_home z-0 shadow-sm h-full py-6">

            <div className="mx-0 lg:mx-auto  max-w-screen-auto text-center lg:mb-3 mb-2">

                <TitleCompGen title={t("blog.title")} />

                <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{t("blog.maint_text_content")}</p>

            </div>

            <div className={`flex mx-auto items-center md:hidden ${(currentNav === "home" || currentNav === "blogs") ? "" : "hidden"}`} >

                <SearchBar onSearch={getDataBlogSearch} />

            </div>



            <div className="py-1 px-2 w-full mx-0 lg:mx-auto lg:py-2 lg:px-6">

                {
                    !isLoading ?

                    <div className="grid gap-2 lg:grid-cols-2">

                        {fetchBlogs()}

                        <div className="fixed pr-2 my-2 top-8 right-2">

                            <ModalFormCreatBlog />

                        </div>

                    </div>
                    :
                    <LoadingCard />
                }

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

        <div className="relative w-auto p-1 flex flex-col justify-between rounded-lg  shadow-sm dark:bg-gray-800 dark:border-gray-700 max-h-[25vh] min-h-[25vh]">

            <div className="flex justify-between items-center mb-5 text-gray-500">

                <TitleCompGenLitle title={blog?.title_blog}/>

                <span className="text-sm">{formatISODate(blog?.created_at)}</span>

            </div>

            <p className="mb-5 font-light text-gray-500 dark:text-gray-400 text-sm text-center">{blog?.blog_message}</p>

            <div className="flex justify-between items-center">

                {blog?.user && <OwnerAvatar owner={blog?.user} />}

                <a href={"/logIn"} className="inline-flex items-center font-medium text-primary-600 text-sm dark:text-primary-500 hover:underline">

                    {t("blog.reaMore")}

                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">

                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />

                    </svg>

                </a>

            </div>


        </div>
    );
};



