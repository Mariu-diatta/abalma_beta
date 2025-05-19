

import React, { useState } from 'react';
import GridSlideProduct from './GridProductSlide';
import HorizontalCard from './HorizontalCard';

const GridLayoutProduct = () => {
    const [modalData, setModalData] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Shoes', 'Bags', 'Electronics', 'Gaming'];

    const productData = [
        { id: 1, title: 'Sneakers', price: 79, category: 'Shoes', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg' },
        { id: 2, title: 'Elegant Bag', price: 120, category: 'Bags', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg' },
        { id: 3, title: 'Wireless Headphones', price: 150, category: 'Electronics', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg' },
        { id: 4, title: 'Gaming Console', price: 299, category: 'Gaming', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg' },
        { id: 5, title: 'Running Shoes', price: 89, category: 'Shoes', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg' },
        { id: 6, title: 'Backpack', price: 99, category: 'Bags', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg' },
        { id: 7, title: 'Bluetooth Speaker', price: 49, category: 'Electronics', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg' },
        { id: 8, title: 'Gaming Mouse', price: 59, category: 'Gaming', img: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg' },
    ];

    const filteredItems =
        activeCategory === 'All'
            ? productData
            : productData.filter((item) => item.category === activeCategory);

    const openModal = (item) => setModalData(item);
    const closeModal = () => setModalData(null);

    return (
        <>
            {/* Tabs */}
            <div className="flex items-center justify-center py-4 md:py-1 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`${activeCategory === cat
                            ? 'text-white bg-blue-700 border-blue-700 dark:bg-blue-500 dark:text-white'
                            : 'text-blue-700 bg-white border border-blue-600 hover:bg-blue-700 hover:text-white dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white'
                            } focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:focus:ring-blue-800`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => openModal(item)}
                            className="block w-full p-0 border-0 bg-transparent cursor-pointer"
                            type="button"
                            aria-label={`Voir ${item.title}`}
                        >
                            <img
                                className="h-auto max-w-full rounded-lg transition duration-300 ease-in-out hover:brightness-90 hover:grayscale"
                                src={item.img}
                                alt={item.title}
                            />
                        </button>

                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base tracking-normal">
                            {item.title}
                        </p>

                        <div className="flex items-center justify-between space-x-1 mb-1">
                            <span className="text-md font-medium text-blue-900 dark:text-white">${item.price}</span>

                            <svg
                                className="w-6 h-4  text-yellow-800 dark:text-white cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                onClick={() => alert(`Cadeau ajouté: ${item}`)}
                            >
                                <path d="M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z" />
                            </svg>

                            <div
                                className="flex items-center justify-center rounded-lg bg-white dark:bg-dark-2 dark:border dark:border-dark-3 cursor-pointer"
                                onClick={() => alert(`Ajouter au panier: ${item.id}`)}
                            >
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

            {/* Modal */}
            {modalData && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center hover:bg-gray bg-opacity-3"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div onClick={(e) => e.stopPropagation()}>
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

