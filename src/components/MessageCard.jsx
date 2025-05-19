import React, { useState } from 'react';

const MessageCard = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownAll, setShowDropdownAll] = useState(false);

    return (

        <div className="flex flex-col justify-center items-center gap-5">

            <div className="flex items-center mb-6 space-x-4">

                <svg className="shrink-0 w-7 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                    <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
                </svg>

                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Messages
                </h2>

                {/* Dropdown Toggle Button */}
                <button
                    onClick={() => setShowDropdownAll(!showDropdown)}
                    className="inline-flex self-start items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                    type="button"
                    aria-label="Options"
                >
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 4 15"
                    >
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                </button>

                {
                    showDropdownAll && 
                    <div
                        className="absolute right-0 top-20 mt-2 p-2  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700 dark:divide-gray-600"
                    >
                        <button onClick={() => setShowDropdownAll(false)} className="absolute right-4 top-0"> X </button>

                        <ul className=" text-sm text-gray-700 dark:text-gray-200 mt-5">
                            {['Nouveaux', 'Lus', 'Supprimés'].map((item, i) => (
                                <li key={i}>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    
                    </div>
                }
            </div>

            <div className="flex items-start justify-center gap-2.5 relative">


            <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="Profile"
            />

            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Bonnie Green
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        11:46
                    </span>
                </div>

                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    Check out this open-source UI component library based on Tailwind CSS:
                </p>

                <p className="text-sm font-normal pb-2.5 text-gray-900 dark:text-white">
                    <a
                        href="https://github.com/themesberg/flowbite"
                        className="text-blue-700 dark:text-blue-500 underline hover:no-underline font-medium break-all"
                    >
                        https://github.com/themesberg/flowbite
                    </a>
                </p>

                <a
                    href="#"
                    className="bg-gray-50 dark:bg-gray-600 rounded-xl p-4 mb-2 hover:bg-gray-200 dark:hover:bg-gray-500 block"
                >
                    <img
                        src="https://flowbite.com/docs/images/og-image.png"
                        alt="Preview"
                        className="rounded-lg mb-2"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                        GitHub - themesberg/flowbite: The most popular and open source libra ...
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        github.com
                    </span>
                </a>

                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
            </div>

            {/* Dropdown Toggle Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex self-start items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                type="button"
                aria-label="Options"
            >
                <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div
                    className="absolute right-0 top-0 mt-2 p-2  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700 dark:divide-gray-600"
                
                >
                    <button onClick={() => setShowDropdown(false)} className="absolute right-2"> X </button>

                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 mt-4">
                        {['Reply', 'Forward', 'Copy', 'Report', 'Delete'].map((item, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            </div>

        </div>
    );
};

export default MessageCard;
