import React, { useEffect, useState , lazy, useCallback} from 'react';

import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import { ModalFormCreatBlog } from '../features/ProfilUser';
import LoadingCard from '../components/LoardingSpin';
const SuspenseCallback = lazy(() => import('../components/SuspensCallback'));
const HomeLayout = lazy(() => import('../layouts/HomeLayout'));


export const BlogPage = () => {

    const { t } = useTranslation();

    const [blogs, setBlogs] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const fetchBlogs = useCallback(() => {

        return blogs.map((post, index) => (

            <BlogCard key={index} {...post} />
        ));

    }, [blogs]);

    useEffect(

        () => {

            const getBlogs = async () => {

                setIsLoading(true)

                try {

                    const blogs = await api.get("blogs/");

                    console.log("get success blogs", blogs.data)

                    setBlogs(blogs.data)

                    setIsLoading(false)

                } catch (err) {

                    console.log("Error get blogs, Blog.jsx: ", err)

                    setIsLoading(false)
                }
            }

            getBlogs()

        },[]
    )

    return (

        <section className="mt-5 dark:bg-gray-900">

            <SuspenseCallback>

                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 style-bg">

                    <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">

                        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold">{t("blog.title")}</h2>

                        <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{t("blog.maint_text_content")}</p>

                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">

                        {
                             !isLoading?
                             <SuspenseCallback>

                                {fetchBlogs()}

                             </SuspenseCallback>
                            :
                            <LoadingCard/>
                        }

                    </div>

                </div>

            </SuspenseCallback>

            <div className="fixed bottom-8 right-0  grid gap-8 lg:grid-cols-2">

                <ModalFormCreatBlog />

            </div>

        </section>
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

        <article className="p-2 rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">

            <div className="flex justify-between items-center mb-5 text-gray-500">

                <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                   
                    {blog.title_blog}
                </span>

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

function formatISODate(isoDateStr) {
    const date = new Date(isoDateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

