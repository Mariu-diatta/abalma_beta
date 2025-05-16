import React from 'react';

const ToolTips = ({ content, btn }) => {
    return (
        <>
            <button
                data-tooltip-target="tooltip-default"
                type="button"
                className="text-white bg-white-700 hover:bg-white-800 focus:ring-4 focus:outline-none focus:ring-white-300 font-medium rounded-lg text-sm px-5  text-center dark:bg-white-600 dark:hover:bg-white-700 dark:focus:ring-white-800"
            >
                {btn}

            </button>

            <div
                id="tooltip-default"
                role="tooltip"
                className="w-80 absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
            >
                {content}
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </>
    );
};

export default ToolTips;
