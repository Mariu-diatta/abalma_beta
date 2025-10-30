import React from 'react'

const HoverImage = ({ src, alt, text }) => {

    return (

        <div className="relative group overflow-hidden rounded-2xl shadow-md">

            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-120"
            />

            <div className="absolute inset-0 bg-black bg-opacity-100 flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-500">
                <p className=" text-white text-extrabold text-md font-semibold px-4 text-center">{text}</p>
            </div>

        </div>
    );
}

export default HoverImage;