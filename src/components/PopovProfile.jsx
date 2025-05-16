import React, { useEffect, useRef, useState } from 'react';

const ProfilPopPov = () => {

    return (

        <>
            <ProfilPopPovClickable/>

            <button
                data-popover-target="popover-user-profile"
                type="button"
                className="hidden sm:block text-grey bg-white-700 hover:bg-grey-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
                <svg class="w-6 h-6 text-blue-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>


            </button>

            <div
                data-popover
                id="popover-user-profile"
                role="tooltip"
                className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600"
            >
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        {/*<a href="#">*/}
                        {/*    <img*/}
                        {/*        className="w-10 h-10 rounded-full"*/}
                        {/*        src="/docs/images/people/profile-picture-1.jpg"*/}
                        {/*        alt="Jese Leos"*/}
                        {/*    />*/}
                        {/*</a>*/}
                        <div>
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Follow
                            </button>
                        </div>
                    </div>
                    <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
                        {/*<a href="#">Jese Leos</a>*/}
                    </p>
                    <p className="mb-3 text-sm font-normal">
                        {/*<a href="#" className="hover:underline">@jeseleos</a>*/}
                    </p>
                    <p className="mb-4 text-sm">
                        Open-source contributor. Building{' '}
                        {/*<a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">flowbite.com</a>.*/}
                    </p>
                    <ul className="flex text-sm">
                        <li className="me-2">
                            {/*<a href="#" className="hover:underline">*/}
                            {/*    <span className="font-semibold text-gray-900 dark:text-white">799</span>{' '}*/}
                            {/*    <span>Following</span>*/}
                            {/*</a>*/}
                        </li>
                        <li>
                            {/*<a href="#" className="hover:underline">*/}
                            {/*    <span className="font-semibold text-gray-900 dark:text-white">3,758</span>{' '}*/}
                            {/*    <span>Followers</span>*/}
                            {/*</a>*/}
                        </li>
                    </ul>
                </div>
                <div data-popper-arrow></div>
            </div>
        </>
    );
};

export default ProfilPopPov;


const ProfilPopPovClickable = () => {

    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);

    const togglePopover = () => setIsVisible((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={togglePopover}
                type="button"
                className="lg:hidden text-grey bg-white-700 hover:bg-grey-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
            >
                <svg
                    className="w-6 h-6 text-blue-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M5 7h14M5 12h14M5 17h10"
                    />
                </svg>
            </button>

            {isVisible && (
                <div
                    ref={popoverRef}
                    className="absolute right-0 bottom-full mb-2 w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600 z-50"
                >
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Follow
                            </button>
                        </div>
                        <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
                            {/* Nom utilisateur ici */}
                        </p>
                        <p className="mb-3 text-sm font-normal">@username</p>
                        <p className="mb-4 text-sm">
                            Open-source contributor. Building{' '}
                            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">
                                flowbite.com
                            </a>.
                        </p>
                        <ul className="flex text-sm gap-4">
                            <li>
                                <span className="font-semibold text-gray-900 dark:text-white">799</span> Following
                            </li>
                            <li>
                                <span className="font-semibold text-gray-900 dark:text-white">3,758</span> Followers
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};



