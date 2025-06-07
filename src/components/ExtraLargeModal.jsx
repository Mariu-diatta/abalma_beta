import { useState } from "react";

export default function ModalManager({ label, content }) {

    const [openModal, setOpenModal] = useState(false);

    const toggleModal = () => {
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    return (

        <div>

            <div className="block space-y-4 md:flex md:space-y-0 md:space-x-4 rtl:space-x-reverse">
                <button
                    onClick={toggleModal}
                    className="flex-1 ms-3 whitespace-nowrap block w-full md:w-auto text-grey bg-white-700 hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-blue-800"
                >
                    {label}
                </button>
            </div>

            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="relative w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col bg-white dark:bg-gray-700 rounded-lg shadow">

                            {/* Header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-0">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                    {label}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <span className="sr-only">Close modal</span>
                                    <svg
                                        className="w-3 h-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="md:p-5 content-center">
                                {content}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
