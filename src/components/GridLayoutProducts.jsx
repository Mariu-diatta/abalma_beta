import React, { useState } from 'react';
import GridSlideProduct from './GridProductSlide';
import HorizontalCard from './HorizontalCard';

const GridLayoutProduct = () => {
    const [modalData, setModalData] = useState(null); // null ou { img, price, title, id }

    const openModal = (id) => {
        setModalData({
            id,
            img: `https://flowbite.s3.amazonaws.com/docs/gallery/square/image${id ? `-${id}` : ''}.jpg`,
            price: 79,
            title: 'Saussure neuve.',
        });
    };

    const closeModal = () => setModalData(null);

    return (
        <>
            <div className="flex items-center justify-center py-4 md:py-1 flex-wrap">
                <button
                    type="button"
                    className="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
                >
                    All categories
                </button>
                <button
                    type="button"
                    className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
                >
                    Shoes
                </button>
                <button
                    type="button"
                    className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
                >
                    Bags
                </button>
                <button
                    type="button"
                    className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
                >
                    Electronics
                </button>
                <button
                    type="button"
                    className="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800"
                >
                    Gaming
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>

                        {/* IMAGE */}
                        <button
                            onClick={() => openModal(i)}
                            className="block w-full p-0 border-0 bg-transparent cursor-pointer"
                            type="button"
                            aria-label={`Voir l'image ${i}`}
                        >
                            <img
                                className="h-auto max-w-full rounded-lg transition duration-300 ease-in-out hover:brightness-90 hover:grayscale"
                                src={`https://flowbite.s3.amazonaws.com/docs/gallery/square/image${i ? `-${i}` : ''}.jpg`}
                                alt={`Image ${i}`}
                            />
                        </button>

                        {/* TITRE au dessus */}

                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base tracking-normal text-gray-500 tracking-wide">
                            Saussure neuve.
                        </p>

                        {/* Boutons + prix sur la même ligne */}
                        <div className="flex items-center justify-between space-x-1 mb-1 ">

                            <span className="hidden text-lg font-medium text-blue-900 line-through dark:text-white">109</span>
                            <span className=" text-md font-medium text-blue-900 dark:text-white">$79</span>

                            <svg
                                className="w-6 h-4  text-yellow-800 dark:text-white cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                onClick={() => alert(`Cadeau ajouté: ${i}`)}
                            >
                                <path d="M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z" />
                            </svg>

                            <div className="flex  items-center justify-center rounded-lg bg-white dark:bg-dark-2 dark:border dark:border-dark-3 cursor-pointer"
                                onClick={() => alert(`Ajouter au panier: ${i}`)}>
                                <svg
                                    className="h-5 text-green-800 dark:text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                    />
                                </svg>
                            </div>
                        </div>

                    </div>
                ))}

            </div>

            {/* Modal Popup */}
            {modalData && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
                    onClick={closeModal}  // clic en dehors => ferme modal
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique dans ce div
                    >
                        <HorizontalCard>
                            <GridSlideProduct />
                        </HorizontalCard>
                    </div>
                </div>

            )}
        </>
    );
};

export default GridLayoutProduct;
