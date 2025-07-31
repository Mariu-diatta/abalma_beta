// ProductsRecapTable.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ViewProduct from '../components/ViewProduct';
import { useTranslation } from 'react-i18next';
import { convertDate } from '../utils';

const ProductsRecapTable = ({ products }) => {

    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStatus, setSelectedStatus] = useState("");

    const [popoverOpen, setPopoverOpen] = useState(false);

    const [selectedSubTransaction, setSelectedSubTransaction] = useState(null);

    const itemsPerPage = 5;

    const displayedStatus = ['en cours', 'prêtés', 'achetés', 'vendus']; //affichage des opérations sur les données

    const [product, setProductView]=useState(null)

    const closePopover = () => setPopoverOpen(false);

    //fonction de filtrages des données produits en fonctions des sous sections
    const getFilteredProducts = (products, selectedSubTransaction) => {

        if (!Array.isArray(products) || !selectedSubTransaction?.id) return [];

        return products.flatMap(prod =>

            Array.isArray(prod.items)

                ? prod.items

                .filter(sub => sub?.subTransaction?.id === selectedSubTransaction.id)

                .flatMap(sub =>

                    Array.isArray(sub.items)

                    ? sub.items.map(i => i.product)

                    : []
                )
                :
                []
        );
    };

    const filteredProducts = useMemo(() => {

        if (!Array.isArray(products)) return [];

        // 🔁 Extraction plate des produits
        const allItems = products.flatMap(prod =>

            Array.isArray(prod.items)

                ? prod.items.flatMap(sub =>

                    Array.isArray(sub.items) ? sub.items.map(i => i.product) : []
                )
                : []
        );

        // ✅ Cas 1 : filtre par statut (prioritaire)
        if (!!selectedStatus) {

            return allItems.filter(p => {

                const op = p?.operation_product;
                if (selectedStatus === 'achetés') return op === 'ACHETER';
                if (selectedStatus === 'vendus') return op === 'VENDRE';
                if (selectedStatus === 'prêtés') return op === 'PRETER';
                if (selectedStatus === 'en cours') return op === 'EN COURS';
                setSelectedStatus('')
                return true; // fallback si statut inconnu
            });

        } else {

            // ✅ Cas 2 : filtre par sous-transaction si aucun statut actif
            if (selectedSubTransaction) {

                const filterProduct = getFilteredProducts(products, selectedSubTransaction)

                return filterProduct;
            }
        }

        // ✅ Cas 3 : aucun filtre actif
        return allItems;

    }, [products, selectedSubTransaction, selectedStatus]);

    //produits total pour la mise en pages
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    //pagination des produits d'un page à un autre
    const paginatedProducts = useMemo(() => {

        const start = (currentPage - 1) * itemsPerPage;

        return filteredProducts.slice(start, start + itemsPerPage);

    }, [filteredProducts, currentPage]);

    console.log("LES PRODUITS DE LA TRANSACTION", paginatedProducts, getFilteredProducts(products, selectedSubTransaction));

    return (

        <div

            className="mt-1 w-full shadow-lg p-2"

            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        >
            <nav

                className="flex items-center gap-2 m-2 style_bg"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >
                <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 18h14M5 18v3h14v-3M5 18l1-9h12l1 9M16 6v3m-4-3v3m-2-6h8v3h-8V3Zm-1 9h.01v.01H9V12Zm3 0h.01v.01H12V12Zm3 0h.01v.01H15V12Zm-6 3h.01v.01H9V15Zm3 0h.01v.01H12V15Zm3 0h.01v.01H15V15Z" />

                </svg>

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t('TableRecap.title')}</h2>

            </nav>

            <div 

                className="m-2 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 style_bg"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >

                <select

                    value={selectedStatus}

                    onChange={

                        (e) => setSelectedStatus(e.target.value)
                    }

                    className="px-3 py-2 border rounded-lg bg-gray-100 border-gray-300"

                    style={

                        { backgroundColor: "var(--color-bg)", color: "var(--color-text)" }
                    }

                >
                    <option value="">{t('TableRecap.statusAll')}</option>

                    {
                        displayedStatus.map(

                            status => (

                                <option key={status} value={status}>{status}</option>
                            )
                        )
                    }

                </select>

                {
                    (selectedStatus === '') &&

                    <TransactionsDropdown

                        transactionsData={products}

                        onSubTransactionSelect={setSelectedSubTransaction}
                    />
                }

                <input

                    type="text"

                    placeholder={t('TableRecap.searchPlaceholder')}

                    value={searchTerm}

                    onChange={e => setSearchTerm(e.target.value)}

                    className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

            </div>


            <div

                className="overflow-x-auto rounded-md"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >

                <table

                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left"

                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                >

                    <thead

                        className="bg-gray-100 dark:bg-gray-700"

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >

                        <tr>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.name')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.categories')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.status')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.price')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.operationDate')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.endDate')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.operation')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.view')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.actions')}</th>

                        </tr>

                    </thead>

                    <tbody

                        className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >

                        {
                            (paginatedProducts.length === 0) ?
                            (

                                <tr>

                                    <td colSpan="9" className="text-center p-4 text-gray-500 dark:text-gray-300">

                                        {t('TableRecap.noProducts')}

                                    </td>

                                </tr>

                            ) : (
                                paginatedProducts.map((item, cle ) => (

                                <tr key={cle}>

                                    <td className="px-4 py-3">{item?.description_product || '-'}</td>

                                    <td className="px-4 py-3">{item?.categorie_product || '-'}</td>

                                    <td className="px-4 py-3 capitalize">{item?.statut || '-'}</td>

                                    <td className="px-4 py-3">{item?.price_product || '-'}</td>

                                    <td className="px-4 py-3">{item?.date_emprunt || 'N/A'}</td>

                                    <td className="px-4 py-3">{item?.date_fin_emprunt || '-'}</td>

                                    <td className="px-4 py-3">{item?.operation_product || '-'}</td>

                                    <td className="px-4 py-3">

                                        <button

                                            onClick={

                                                () => {

                                                    setPopoverOpen(true)

                                                    setProductView(item)
                                                }
                                            }

                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {t('view')}

                                        </button>

                                    </td>

                                    <td className="px-4 py-3">

                                        <button

                                            onClick={() => console.log("delete", item?.id)}

                                            className="text-red-600 hover:text-red-800"

                                        >
                                            {t('delete')}

                                        </button>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>


                {
                    (popoverOpen && product) && (

                        <>
                            <div className="fixed inset-0 bg-opacity-30 z-40" onClick={closePopover}></div>

                            <div className="fixed top-1/2 left-1/2 z-50 max-w-full bg-white rounded-md shadow-lg p-4 transform -translate-x-1/2 -translate-y-1/2">

                                <ViewProduct productSelected={product} />

                            </div>
                        </>
                    )
                }

            </div>

            <div

                className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300"

                style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >

                <span>

                    {t('TableRecap.pagination.page')} {currentPage} {t('TableRecap.pagination.of')} {totalPages}

                </span>

                <div className="space-x-2">

                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>

                        {t('TableRecap.pagination.previous')}

                    </button>

                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>

                        {t('TableRecap.pagination.next')}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductsRecapTable;

//sélection de la transaction et sous transaction
function TransactionsDropdown({ transactionsData, onSubTransactionSelect }) {

    const { t } = useTranslation();

    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const [dropdownOpen2, setDropdownOpen2] = useState(false);

    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const trigger1 = useRef(null);

    const trigger2 = useRef(null);

    const dropdown1 = useRef(null);

    const dropdown2 = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {

        const handler = ({ target }) => {

            if (!dropdown1?.current || !dropdown2?.current) return;

            if (
                dropdown1?.current?.contains(target) ||

                trigger1?.current?.contains(target) ||

                dropdown2?.current?.contains(target) ||

                trigger2?.current?.contains(target)
            )
                return;

            setDropdownOpen1(false);

            setDropdownOpen2(false);
        };

        document.addEventListener('click', handler);

        return () => document.removeEventListener('click', handler);

    }, []);


    //selection de la transaction :: button
    const handleTransactionSelect = (transactionItem) => {

        setSelectedTransaction(transactionItem);

        setDropdownOpen1(false);

        setDropdownOpen2(true); // Automatically open second dropdown
    };

    //selection de la sous transaction :: button
    const getSubTransactions = () => {

        if (!selectedTransaction?.items) return [];

        return selectedTransaction.items.map((entry) => entry.subTransaction);
    };


    return (

        <div className="flex flex-col md:flex-row gap-4">

            {/* Dropdown 1: Transactions */}
            <div className="relative inline-block">

                <button

                    ref={trigger1}

                    onClick={() => setDropdownOpen1(!dropdownOpen1)}

                    className="border rounded-lg bg-gray-100 border-gray-300 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-stroke px-6 py-3 text-base  text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"

                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                >
                    Transactions

                    <span
                        className={`duration-100 ${dropdownOpen1 ? "-scale-y-100" : ""}`}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z"
                                fill="currentColor"
                            />

                        </svg>

                    </span>

                </button>

                {dropdownOpen1 && (

                    <div

                        ref={dropdown1}

                        className="absolute mt-2 w-64 rounded-md bg-white ring-1 ring-black ring-opacity-5 z-[9999]"

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        <div className="py-1 z-[2000]">

                            {transactionsData.map((transItem, _) => (

                                <button

                                    key={transItem?.transaction?.id}

                                    onClick={() => handleTransactionSelect(transItem)}

                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {transItem?.transaction?.id} - {transItem?.transaction?.status}-{convertDate(transItem?.transaction?.created_at)}

                                </button>

                            ))}

                        </div>

                    </div>
                )}

            </div>

            {/* Dropdown 2: SubTransactions */}
            <div className="relative inline-block">

                <button
                    ref={trigger2}
                    onClick={() => setDropdownOpen2(!dropdownOpen2)}
                    className="border rounded-lg bg-gray-100 border-gray-300 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-stroke  px-6 py-3 text-base text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    disabled={!selectedTransaction}
                    style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                >
                    {t('sub_transaction')}

                    <span
                        className={`duration-100 ${dropdownOpen2 ? "-scale-y-100" : ""}`}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4062 5.65625 17.6875 5.9375C17.9688 6.21875 17.9688 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1562 10.1875 14.25 10 14.25Z"
                                fill="currentColor"
                            />

                        </svg>

                    </span>

                </button>

                {dropdownOpen2 && selectedTransaction && (

                    <div

                        ref={dropdown2}

                        className="absolute  mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"

                        style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                    >
                        <div className="py-1">

                            {getSubTransactions().map((sub, i) => (

                                <button

                                    key={sub?.id || i}

                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"

                                    onClick={() => onSubTransactionSelect(sub)} // notify parent
                                >
                                    {sub?.id} - {sub?.status || 'Sans nom'}

                                </button>
                            ))}

                        </div>

                    </div>
                )}
            </div>

        </div>
    );
}