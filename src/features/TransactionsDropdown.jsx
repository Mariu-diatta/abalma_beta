import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { convertDate } from '../utils';

//sélection de la transaction et sous transaction
function TransactionsDropdown(
    {
        transactionsData = [],
        onSubTransactionSelect,
        onSelectTransaction,
        subTransactionsData
    }) {

    const { t } = useTranslation();
    const [openMenu, setOpenMenu] = useState({ main: false, sub: false });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {

            if (!containerRef.current?.contains(e.target)) {

                setOpenMenu({ main: false, sub: false });
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => document.removeEventListener("click", handleClickOutside);

    }, []);

    useEffect(() => {

        if (subTransactionsData?.length === 1) {

            onSubTransactionSelect(subTransactionsData[0])
        }

    }, [subTransactionsData, onSubTransactionSelect]);


    const handleTransactionSelect = (tItem) => {

        setSelectedTransaction(tItem);

        onSelectTransaction?.(tItem);

        setOpenMenu({ main: false, sub: true });
    };

    if (!transactionsData.length) return null;

    return (

        <div ref={containerRef} className="flex gap-2">

            {/*Sélection de la transaction*/}
            <button

                onClick={() => setOpenMenu(m => ({ ...m, main: !m.main }))}

                className="border-blue-200 
                    h-10 px-3 rounded-full
                    bg-gray-100 flex 
                    items-center justify-between 
                    flex gap-2 items-center justify-center
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-400        
                "
            >
                <p>Transactions</p>

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m19 9-7 7-7-7" />
                </svg>

            </button>

            {
                openMenu?.main && (

                    <div className="absolute mt-[5dvh] mb-[10dvh] w-100 bg-white shadow-lg rounded-lg max-h-[50dvh] overflow-y-auto">

                        {
                            transactionsData?.map(tItem => (

                                    <button

                                        key={tItem?.id}

                                        className="block w-full px-4 py-2 text-sm hover:bg-gray-100 bg-white"

                                        onClick={() => handleTransactionSelect(tItem)}
                                    >
                                        {tItem?.code} - {tItem?.status} - {convertDate(tItem?.created_at)}

                                    </button>

                                )
                            )
                        }

                    </div>
                )
            }

            {/*Sélection de la sous transaction*/}
            <button
                onClick={() => subTransactionsData?.length && setOpenMenu(m => ({ ...m, sub: !m.sub }))}
                className={`border-blue-200 h-10 px-3 rounded-full bg-gray-100 
                disabled:opacity-50 flex gap-2 items-center justify-center
                focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${ subTransactionsData?.length > 0?"hidden":""}
                `}
                disabled={!selectedTransaction}
            >
                <p>{t('sub_transaction')}</p>

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m19 9-7 7-7-7" />
                </svg>

            </button>

            {
                (openMenu?.sub && subTransactionsData?.length > 1) && (

                    <div className="absolute mt-2 p-2 w-100 rounded-md bg-white shadow-lg z-[9999] max-h-[50dvh] overflow-y-auto">

                        {
                            subTransactionsData?.map((sub, i) => (

                                <button
                                    key={sub?.id || i}
                                    className="whitespace-nowrap block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                    onClick={() => onSubTransactionSelect(sub)}
                                >
                                    {sub?.code}-{sub?.status}-{convertDate(sub?.created_at)}

                                </button>
                            ))

                        }
                    </div>
                )
            }

        </div>
    );
}

export default TransactionsDropdown