import React from 'react';
import { addToCart } from '../slices/cartSlice'
import { useDispatch } from 'react-redux'
import ProfilPopPov from './PopovProfile';
import WalletModal from './WalletModal';


const HorizontalCard = ({ children, item }) => {


    const dispatch = useDispatch()

    return (
        <section className="relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-lg md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">


            <div className="absolute bottom-1 right-50 border-0">
                <div
                    className="cursor-pointer border-0 flex h-8 w-12 items-center justify-center rounded-lg  bg-white dark:border-dark-3 dark:bg-dark-2"
                    onClick={() => dispatch(addToCart(item))}
                >
                    <svg
                        className="h-5 text-gray-800 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                        />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-1 right-30">

                <WalletModal>

                    <svg className=" w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />

                    </svg>

                </WalletModal>

            </div>

            {/* Positionnement absolu */}
            <div className="absolute bottom-2 right-19">

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">

                    <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd" />

                </svg>

            </div>

            <div className="absolute bottom-0 right-2">

                <ProfilPopPov/>

            </div>


            {children}

            <div className="flex flex-col justify-between p-4 leading-normal w-full mb-4">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Noteworthy technology acquisitions 2021
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                </p>
            </div>
        </section>
    );
};

export default HorizontalCard;
