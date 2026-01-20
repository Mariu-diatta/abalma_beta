import React, { useState } from 'react';


const PaginationProduit = ({ products , itemsPerPage = 5 }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleNext = () => {

        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrev = () => {

        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

    return (

        <div className="flex flex-col items-center">

            {/* Liste des produits */}
            <div className="flex gap-4 justify-center overflow-x-auto scrollbor_hidden">

                {
                    currentItems?.map((product, id) => (
                            <img
                                key={id}
                                src={product?.image_product}
                                alt={`Product ${product?.id}`}
                                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                        )
                    )
                }

            </div>

            {/* Pagination */}
            <div className="flex gap-2 mt-4">

                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1  disabled:opacity-50"
                >
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                    </svg>

                </button>

                <span className="px-3 py-1">
                    {currentPage} / {totalPages}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1  disabled:opacity-50"
                >
                    <svg className="cursor-pointer w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                    </svg>

                </button>

            </div>
        </div>
    );
};

export default PaginationProduit;