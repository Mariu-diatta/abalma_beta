import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySelected } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';


const SearchBar = ({ onSearch, disabled = false }) => {

    const { t } = useTranslation();
    const categorySelectedOnSearch = useSelector(state => state.navigate.categorySelectedOnSearch)
    const [selectedCategory, setSelectedCategory] = useState(categorySelectedOnSearch?.category || "");
    const dispatch=useDispatch()
    const [searchTerm, setSearchTerm] = useState('');
    const searchBtnRef = useRef(null);

    const handleSubmit = (e) => {

        e.preventDefault();

        dispatch(updateCategorySelected({ category: selectedCategory, query: searchTerm }))

        if (categorySelectedOnSearch) onSearch?.(categorySelectedOnSearch); //{ category: selectedCategory, query: searchTerm }
    };

    useEffect(

        () => {

            setSelectedCategory(categorySelectedOnSearch?.category)

        }, [categorySelectedOnSearch]
    )

    useEffect(() => {

        const handleFocus = () => {
        };

        const btn = searchBtnRef.current;

        if (btn) {

            btn.addEventListener("focus", handleFocus);
        }

        return () => {

            if (btn) {

                btn.removeEventListener("focus", handleFocus);
            }
        };

    },[]);

    return (
        <form onSubmit={handleSubmit} className="w-full  mx-auto " >

            <div className="flex relative">

                {/* Dropdown Button */}
                <nav
                    className="w-20 overflow-x-hidden whitespace-nowrap shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100   rounded-s-full hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white "
                >
                    {selectedCategory}
                </nav>

                {/* Search Input */}
                <div className="relative w-full">

                    <input
                        ref={searchBtnRef}
                        type="search"
                        className={`block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-full border-0 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0`}
                        placeholder={`${t("Search")} ${selectedCategory ? selectedCategory?.replace(/_/g, " ").toLowerCase() : (t('All')).toLowerCase() } `}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                        disabled={disabled}
                    />

                    <button
                        type="submit"
                        className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-300 rounded-e-full  hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-gradient-to-br from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-400 "
                        disabled={disabled}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 19L15 15M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span className="sr-only">{t("Search")}</span>

                    </button>

                </div>

            </div>

        </form>
    );
};

export default SearchBar;
