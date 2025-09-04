import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategorySelected } from '../slices/navigateSlice';

const SearchBar = ({ onSearch, disabled=false}) => {

    const categorySelectedOnSearch = useSelector(state => state.navigate.categorySelectedOnSearch)
    const [selectedCategory, setSelectedCategory] = useState(categorySelectedOnSearch?.category);
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
            {/*onClick={() => setDropdownOpen((prev) => !prev)}*/}

            <div className="flex relative">
                {/* Dropdown Button */}
                <nav
                    className="w-20 overflow-x-hidden whitespace-nowrap shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100   rounded-s-full hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white "
                >
                    {selectedCategory}
                    {/*<svg className="w-2.5 h-2.5 ms-2.5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                    {/*    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />*/}
                    {/*</svg>*/}
                </nav>

                {/* Dropdown Menu */}
                {/*{dropdownOpen && (*/}
                {/*    <div className="absolute top-full left-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 overflow-y-auto  h-[500px] w-auto z-[9999]">*/}
                {/*        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 ">*/}
                {/*            {Object.keys(ListItemsFilterProduct).map((category) => (*/}
                {/*                <li key={category}>*/}
                {/*                    <button*/}
                {/*                        type="button"*/}
                {/*                        onClick={() => {*/}
                {/*                            setSelectedCategory(category);*/}
                {/*                            setDropdownOpen(false);*/}
                {/*                        }}*/}
                {/*                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"*/}
                {/*                    >*/}
                {/*                        {category}*/}
                {/*                    </button>*/}
                {/*                </li>*/}
                {/*            ))}*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* Search Input */}
                <div className="relative w-full">

                    <input
                        ref={searchBtnRef}
                        type="search"
                        className={`block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-full dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
                        placeholder={`Search ${selectedCategory}`}
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
                        <span className="sr-only">Search</span>
                    </button>

                </div>

            </div>

        </form>
    );
};

export default SearchBar;
