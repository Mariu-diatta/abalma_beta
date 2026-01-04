import React, { useState } from 'react'
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BlogCard from './BlogCard';
import BlogDetails from './BlogDetails';

const BlogList = ({ blogs }) => {

    const { t } = useTranslation();

    const [viewMore, setViewMore] = useState(false)

    const [selectedBlog, setSelectedBlog] = useState(null)

    const handleClicked = (viewDetail, selectedBlog) => {

        setViewMore(viewDetail)

        setSelectedBlog(selectedBlog)

    }

    // Fonction pour générer les cartes de blog
    const renderBlogs = useCallback(() => {

        if (!blogs || blogs.length === 0) return <p>{t("blogNone")}</p>;

        else return blogs.map((post, index) => <BlogCard key={index} blog={post} handleClicked={handleClicked} />);

    }, [blogs, t]);

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 min-h-screen content-start">

            {
                (!viewMore) ?
                    <>{renderBlogs()}</>
                    :
                    <BlogDetails blog={selectedBlog} onClose={handleClicked} />
            }

        </div>
    )
};

export default BlogList;