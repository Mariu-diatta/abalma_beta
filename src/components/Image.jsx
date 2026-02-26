import React from 'react';

const SingleImage = ({ href, imgSrc }) => {

    return (

        <a href={href} className="flex w-full items-center justify-center">
            <img src={imgSrc} alt="Brand logo" className="h-10 w-full" />
        </a>
    );
};

export default SingleImage;
