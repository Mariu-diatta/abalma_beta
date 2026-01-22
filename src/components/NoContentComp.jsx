import React from 'react'

const NoContentComp = ({ content }) => {

    return (
        <div className="flex items-center justify-center mx-auto max-w-md p-4 rounded-full border border-gray-200 mb-2 bg-gradient-to-br from-purple-50 to-blue-100 shadow-lg">

            <p className="text-center">

                {content}

            </p>

        </div>
    )
}

export default NoContentComp;

