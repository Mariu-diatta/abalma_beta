import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CONSTANTS, ENDPOINTS } from "../utils";

const ButtonCreateBlog = ({ handleToggleModal, isOpen }) => {

    const { t } = useTranslation();
    const currentUser = useSelector((state) => state.auth.user);
    const currentNav = useSelector(state => state.navigate.currentNav);

    const handleClick = () => {
        if (currentUser?.email) {
            handleToggleModal();
        } else {
            alert(t("connect_first"));
        }
    };

    if (![CONSTANTS?.BLOGS, ENDPOINTS?.USER_BLOGS, ENDPOINTS?.BLOG].includes(currentNav)) return;

    return (

        <button
            onClick={handleClick}
            aria-expanded={isOpen}
            aria-controls="modal-blog-form"
            className="
              fixed bottom-[60px] right-6 -translate-y-1/2
              h-10 px-3 rounded-full flex items-center gap-2
              text-white text-sm
              bg-gradient-to-br from-purple-50 to-blue-100
              hover:from-purple-50 hover:to-blue-100
              shadow-lg shadow-blue-100 dark:shadow-none
              transition-all duration-200
              z-50
          "
        >
            <div className="group relative flex items-center gap-2">

                <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
                    />

                </svg>

                <div
                    className="
                    absolute right-8 top-1/2 -translate-y-1/2
                    hidden group-hover:flex
                    text-white text-xs px-2 py-1 rounded
                    whitespace-nowrap
                    bg-gray-100
                  "
                >
                    {t("blog.blog")}
                </div>

            </div>

        </button>
    );
};

export default ButtonCreateBlog;
