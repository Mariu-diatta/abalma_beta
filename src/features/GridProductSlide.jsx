
import React, { useState } from 'react';

const GridSlideProduct = ({ srcs = [] }) => {

    const [current, setCurrent] = useState(0);

    const prevSlide = () => {

        setCurrent((prev) => (prev === 0 ? srcs.length - 1 : prev - 1));
    };

    const nextSlide = () => {

        setCurrent((prev) => (prev === srcs.length - 1 ? 0 : prev + 1));
    };

    if (!srcs.length) return null;

    return (

        <div className="relative w-full h-100 md:h-100 rounded-lg overflow-hidden bg-gray-100 shadow-lg m-0 p-0">

            {srcs.map((src, index) => (

                <div
                    key={index}
                    className={`absolute w-full h-full inset-0 transition-opacity duration-700 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        src={src}
                        alt={`Slide ${index}`}
                        className="w-full h-full object-cover"
                    />

                </div>
            ))}

            {/* Prev Button */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-0 shadow-md"
            >
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24">
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 18l-6-6 6-6"
                    />
                </svg>
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 shadow-md"
            >
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24">
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 6l6 6-6 6"
                    />
                </svg>
            </button>
        </div>
    );
};

export default GridSlideProduct;



