import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/BtnSearchWithFilter';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySelected } from '../slices/navigateSlice';
import TitleCompGen from '../components/TitleComponentGen';
import { ModalFormCreatBlog } from '../features/BlogCreatBlogs';
import BlogList from '../features/BlogList';
import { useEffect } from 'react';

const HomeLayout = lazy(() => import('../layouts/HomeLayout'));

export const BlogPage = () => {
    const { t } = useTranslation();
    const currentAddedBlog = useSelector(state => state.cart.contentBlog);
    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)
    const currentUser = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateCategorySelected({ category: "All", query: "" }))
    }, [dispatch])

    return (
        <div className="min-h-full py-1 scrollbor_hidden pt-[10dvh]">
            <div className="mx-0 lg:mx-auto max-w-screen-auto text-center lg:mb-3 mb-2 px-10">
                <TitleCompGen title={t("blog.title")} />
                <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">{t("blog.maint_text_content")}</p>
            </div>
            {
                (currentUser && currentUser?.is_connected) &&
                <SearchBar />
            }
            <BlogList
                searchQuery={categorySelectedData?.query}
                newBlog={currentAddedBlog}
            />
            <ModalFormCreatBlog />
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