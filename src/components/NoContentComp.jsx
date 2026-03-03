import React from 'react'

const NoContentComp = ({ content }) => {

    return (

        <div className="whitespace-nowrap text-center p-4 mx-auto border border-gray-100 text-gray rounded-full w-1/2 mt-5">

            {content}

        </div>
    )
}

export default NoContentComp;

