import React from 'react'

const TitleCompGen = ({title}) => {

    return (
        <div className="relative overflow-hidden w-full px-4 pt-4 pb-4">
            <h1 className="animate-scroll inline-block whitespace-nowrap text-2xl font-extrabold text-gray-500 dark:text-white">
                {title}
            </h1>

        </div>

    )
}

export default TitleCompGen