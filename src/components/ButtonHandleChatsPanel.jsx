import React from 'react'

const ButtonToggleChatsPanel = ({ showSidebar, setShowSidebar }) => {

    return (

        <button
            onClick = {() => setShowSidebar(!showSidebar)}
            className = "md:hidden border-0 text-white pe-2 py-0 rounded-full  bg-white mb-1"
            aria-label="Toggle menu"
        >
             {
                showSidebar?
                (

                    <svg
                        className = "w-[26px] h-[26px] text-gray-800 dark:text-white"
                        xmlns = "http://www.w3.org/2000/svg"
                        fill = "none"
                        viewBox = "0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="m15 19-7-7 7-7"
                        />

                    </svg>

                ) 
                :
                (

                    <svg
                        className="w-[26px] h-[26px] text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                            d="m9 5 7 7-7 7"
                        />

                    </svg>
                )
            }

        </button>
    )
}

export default ButtonToggleChatsPanel;