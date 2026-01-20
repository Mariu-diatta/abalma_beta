import React, { useEffect, useState , lazy} from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/Axios';
import LoadingCard from '../components/LoardingSpin';
import SearchBar from '../components/BtnSearchWithFilter';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySelected } from '../slices/navigateSlice';
import TitleCompGen from '../components/TitleComponentGen';
import { ModalFormCreatBlog } from '../features/BlogCreatBlogs';
import BlogList from '../features/BlogList';
const HomeLayout = lazy(() => import('../layouts/HomeLayout'));

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


