import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySelected } from '../slices/navigateSlice';
import { useTranslation } from 'react-i18next';
import { ItemsNav, LIST_CATEGORY} from '../utils';


const SearchBar = ({disabled = false }) => {

    const { t } = useTranslation();
    const categorySelectedOnSearch = useSelector(state => state.navigate.categorySelectedOnSearch)
    const categoryButtonHover = useSelector(state => state?.navigate?.currentButonCategoryHover)

    const [selectedCategory, setSelectedCategory] = useState(categorySelectedOnSearch?.category || "");
    const dispatch=useDispatch()
    const [searchTerm, setSearchTerm] = useState('');
    const searchBtnRef = useRef(null);
    const currentNav = useSelector(state => state.navigate.currentNav);

    const [itemsNav, setItemsNav] = useState([])

    const handleSubmit = (e) => {

        e.preventDefault();

        dispatch(updateCategorySelected({ category: selectedCategory, query: searchTerm }))

    };

    useEffect(

        () => {

            setSelectedCategory(categorySelectedOnSearch?.category)

        }, [categorySelectedOnSearch]
    )

    useEffect(

        () => {

            setSelectedCategory(categoryButtonHover)

        }, [categoryButtonHover]
    )

    useEffect(() => {

        const handleFocus = () => {
        };

        const btn = searchBtnRef.current;

        if (btn) {

            btn.addEventListener("focus", handleFocus);
        }

        setItemsNav(LIST_CATEGORY.map(e => e?.idx));

        return () => {

            if (btn) {

                btn.removeEventListener("focus", handleFocus);
            }
        };

    },[]);

    return (

        <span
            className={`flex justify-start
                  ${ItemsNav.includes(currentNav) || itemsNav.includes(currentNav) ? "w-full md:w-full" : "hidden"}`}
        >
            <form onSubmit={handleSubmit} className="w-full" >

                <div className="w-full">

                    <div className="relative">

                        <input
                            ref={searchBtnRef}
                            type="search"
                            className={`block px-2.5 py-1.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-full border-0 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-0`}
                            placeholder={`${t("Search")} ${selectedCategory ? selectedCategory?.replace(/_/g, " ").toLowerCase() : (t('All')).toLowerCase() } `}
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                            }}
                            required
                            disabled={disabled}
                        />

                        <button
                            type="submit"
                            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-none rounded-e-full  hover:bg-blue-100 focus:ring-1 focus:outline-none focus:ring-blue-300 dark:bg-blue-100 dark:hover:bg-blue-100 dark:focus:ring-blue-100 bg-gradient-to-br from-purple-50 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 "
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

        </span>
    );
};

export default SearchBar;
