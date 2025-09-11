import React, { useEffect, useRef, useState } from 'react'

const TitleCompGen = ({ title }) => {

    const [shouldScroll, setShouldScroll] = useState(false);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(

        () => {

            const container = containerRef.current;

            const content = contentRef.current;

            if (container && content) {

                const isOverflowing = content.scrollWidth > container.clientWidth

                setShouldScroll(isOverflowing);
            }

    }, []);

    return (

        <div className="relative overflow-hidden w-full px-4 pt-4 pb-4" ref={containerRef}>

            <h1 ref={contentRef} className={`${shouldScroll?"animate-scroll":""} inline-block whitespace-nowrap text-2xl font-extrabold text-gray-500 dark:text-white`}>

                {title}

            </h1>

        </div>

    )
}

export default TitleCompGen