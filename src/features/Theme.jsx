import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateTheme } from '../slices/navigateSlice';
import { CONSTANTS, applyTheme } from '../utils';

// ⚙️ Appliquer la classe dark/light au body et changer la balise meta
const ThemeToggle = () => {

    const [theme, setTheme] = useState('light');

    const dispatch = useDispatch();

    useEffect(() => {

        const storedTheme = localStorage.getItem('theme') || 'light';

        const applyTheme = (newTheme) => {

            document.body.classList.remove('dark', 'light');

            document.body.classList.add(newTheme);

            localStorage.setItem('theme', newTheme);

            dispatch(updateTheme(newTheme));

            const metaThemeColor = document.querySelector("meta[name=theme-color]");

            if (metaThemeColor) {

                metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
            }
        };

        applyTheme(storedTheme);

        setTheme(storedTheme);

    }, [dispatch]);

    const toggleTheme = () => {


        const storedTheme = localStorage.getItem('theme');

        const next = storedTheme === 'dark' ? 'light' : 'dark';

        setTheme(next);

        applyTheme(next, dispatch);

        localStorage.setItem('theme', next)
    };

    return (

        <button

            onClick={toggleTheme}

            type="button"

            className=" cursor-pointer  flex-col items-center rounded-full justify-center px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 group h-8 w-8"
        >
            {/*inline-flex*/}
            <span className="text-[14px] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">

                {
                    (theme === CONSTANTS?.DARK) ?
                        (
                            <svg className="w-6 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" clipRule="evenodd" />
                            </svg>
                        )
                        :
                        (
                            <svg className="w-6 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z" />
                            </svg>
                        )
                }

            </span>

        </button>
    );
};

export default ThemeToggle;

