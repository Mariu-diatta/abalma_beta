import React, { useState, useRef, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";


const PaginationProduit = ({ products = [], itemsPerPage = 5 }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const scrollRef = useRef(null);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

    const lengthItemsSupTwo = (currentItems?.length<= 2)

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // 🔁 Reset scroll quand on change de page
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: 0,
                behavior: "smooth",
            });
        }
    }, [currentPage]);

    return (
        <div className="flex flex-col items-center w-full justify-center">

            {/* Liste scrollable */}
            <div
                ref={scrollRef}
                className="
                  flex gap-3
                  overflow-x-auto
                  md:justify-center
                  flex-nowrap
                  w-full
                  bg-none
                  py-2
                  px-2
                  scrollbor_hidden_
                "
            >
                {
                    currentItems?.map((product) => (
                            <img
                                key={product.id}
                                src={product.image_product}
                                alt={`Product ${product.id}`}
                                className="
                                  w-24 h-24
                                  flex-shrink-0
                                  rounded-full
                                  object-cover
                                  border-0
                                  shadow-md
                                "
                            />
                        )
                    )
                }

            </div>

            {/* Pagination */}
            <div className={`flex items-center gap-2 mt-4 ${lengthItemsSupTwo?"hidden":""}`}>

                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="disabled:opacity-40"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />

                </button>

                <span className="text-sm font-medium">
                    {currentPage} / {totalPages}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-40"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />

                </button>

            </div>
        </div>
    );
};

export default PaginationProduit;
