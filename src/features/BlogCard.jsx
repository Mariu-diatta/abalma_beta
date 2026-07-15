import React from 'react'
import { useTranslation } from 'react-i18next';
import OwnerAvatar from '../components/OwnerProfil';
import { formatISODate } from '../utils';
import { TitleCompGenLitle } from '../components/TitleComponentGen';
import TextParagraphs from '../components/TextToParagraph';

const BlogCard = ({blog, handleClicked}) => {

    const { t } = useTranslation();

    return (

        <div
            className="relative w-auto p-2 flex flex-col justify-between bg-white
            rounded-xl border border-[#dbdbdb] overflow-hidden
            transition-all duration-200 hover:border-[#0095F6]/40 h-[20dvh]"
        >
            {/* Header : Avatar + date */}
            <div className="flex justify-between items-start mb-1">

                {blog?.user && <OwnerAvatar owner={blog.user} />}

                <div className="flex items-center text-[#8e8e8e] text-xs">

                    <span>{formatISODate(blog?.created_at)}</span>

                </div>

            </div>

            {/* Contenu principal */}
            <div
                className="absolute inset-x-0 px-5 py-1 text-center font-light text-[#262626]
                   text-sm overflow-hidden text-ellipsis line-clamp-3"
            >
                <TitleCompGenLitle title={blog?.title_blog} />

                <TextParagraphs text={blog?.blog_message} />

            </div>

            {/* Bouton Lire plus */}
            <button
                className="absolute right-2 bottom-2 inline-flex items-center font-medium
                   text-[#0095F6] text-sm hover:underline"
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

export default BlogCard;