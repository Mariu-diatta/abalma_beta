import React, { useEffect, useMemo, useRef, useState } from 'react';
import ViewProduct from '../components/ViewProduct';
import { useTranslation } from 'react-i18next';
import { convertDate } from '../utils';
import { ButtonSimple } from '../components/Button';
import { TitleCompGenLitle } from '../components/TitleComponentGen';

const ProductsRecapTable = ({ products = [] }) => {

    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSubTransaction, setSelectedSubTransaction] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [product, setProductView] = useState(null);

    const itemsPerPage = 5;

    const statusLabels = useMemo(() => ({
        ACHETER: 'achetés',
        VENDRE: 'vendus',
        PRETER: 'prêtés',
        'EN COURS': 'en cours',
    }), []);

    /** 🔍 Extraction simple de TOUS les produits */
    const extractAllProducts = (products) => {
        return products.flatMap(p =>
            p.items?.flatMap(sub =>
                sub.items?.map(i => i.product) || []
            ) || []
        );
    };

    /** 📌 Filtrage intelligent */
    const filteredProducts = useMemo(() => {

        const all = extractAllProducts(products);

        // Filtrer par statut
        if (selectedStatus) {
            return all.filter(p =>
                statusLabels[p.operation_product] === selectedStatus
            );
        }

        // Filtrer par sous-transaction
        if (selectedSubTransaction) {
            return all.filter(p =>
                p?.subTransactionId === selectedSubTransaction?.id
            );
        }

        // Filtre de recherche
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            return all.filter(p =>
                p?.description_product?.toLowerCase().includes(term)
            );
        }

        return all;

    }, [products, selectedStatus, selectedSubTransaction, searchTerm, statusLabels]);


    /** 📄 Pagination */
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const closePopover = () => setPopoverOpen(false);

    return (
        <div className="w-full shadow-sm p-2 style_bg">

            {/* TITRE */}
            <nav className="flex items-center gap-2 m-2">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                </svg>
                <TitleCompGenLitle title={t('TableRecap.title')} />
            </nav>

            {/* FILTRES */}
            <div className="m-2 flex flex-wrap gap-4 items-center pb-4">

                {/* Filtre par statut */}
                <select
                    value={selectedStatus}
                    onChange={e => {
                        setSelectedStatus(e.target.value);
                        setSelectedSubTransaction(null);
                    }}
                    className="px-2 py-2 border rounded-full flex border-blue-200  focus:border-blue-500 focus:ring-1 focus:ring-blue-400  "
                >
                    <option value="">{t('TableRecap.statusAll')}</option>

                    {Object.values(statusLabels).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}

                </select>

                {/* Transactions */}
                {!selectedStatus && (
                    <TransactionsDropdown
                        transactionsData={products}
                        onSelectTransaction={setSelectedTransaction}
                        onSubTransactionSelect={setSelectedSubTransaction}
                    />
                )}

                {/* Recherche */}
                <input
                    type="text"
                    placeholder={t('TableRecap.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="rounded-full border px-3 py-2 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                />

            </div>

            {/* TABLEAU */}
            <main className="overflow-x-auto rounded-md">

                {(selectedTransaction || selectedSubTransaction) && (

                    <div className="mb-4 p-3 rounded-lg border bg-blue-50 text-blue-800 border-blue-200">
                        {selectedTransaction && (
                            <p className="font-semibold">

                                <p className="flex gap-2">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" />
                                    </svg>
                                    <p>Transaction :</p>
                                </p>

                                <span className="font-normal ml-1">
                                    {selectedTransaction.transaction.id} —
                                    {selectedTransaction.transaction.status} —
                                    {convertDate(selectedTransaction.transaction.created_at)}
                                </span>
                            </p>
                        )}

                        {selectedSubTransaction && (

                            <p className="font-semibold mt-1">

                                <p className="flex gap-2">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z" />
                                    </svg>

                                    <p>Sous-transaction :</p>
                                </p>

                                <span className="font-normal ml-1">
                                    {selectedSubTransaction.id} — {selectedSubTransaction.status}
                                </span>
                            </p>
                        )}
                    </div>
                )}

                <table className="min-w-full text-sm">

                    <thead className="bg-gray-100">
                        <tr>
                            {[
                                'name', 'categories', 'status', 'price',
                                'operationDate', 'endDate', 'operation', 'view', 'actions'
                            ].map(header => (
                                <th key={header} className="px-4 py-3">
                                    {t(`TableRecap.tableHeaders.${header}`)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y">

                        {paginatedProducts?.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center p-4 text-gray-500">
                                    {t('TableRecap.noProducts')}
                                </td>
                            </tr>
                        ) : (
                                paginatedProducts?.map((item, index) => (
                                <tr key={index} className="border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3">{item?.description_product?.slice(0, 6) || '-'}</td>
                                    <td className="px-4 py-3">{item?.categorie_product || '-'}</td>
                                    <td className="px-4 py-3 capitalize">{item?.statut || '-'}</td>
                                    <td className="px-4 py-3">{item?.price_product || '-'}</td>
                                    <td className="px-4 py-3">{item?.date_emprunt || 'N/A'}</td>
                                    <td className="px-4 py-3">{item?.date_fin_emprunt || '-'}</td>
                                    <td className="px-4 py-3">{item?.operation_product || '-'}</td>

                                    <td className="px-4 py-3">

                                        <button
                                            onClick={() => {
                                                setPopoverOpen(true);
                                                setProductView(item);
                                            }}
                                            className="p-1 bg-gradient-to-br from-purple-400 hover:bg-gradient-to-br hover:from-purple-400 text-white rounded-lg hover:bg-blue-700 text-xs"
                                        >
                                            <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="1" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                <path stroke="currentColor" strokeWidth="1" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>

                                        </button>

                                    </td>

                                    <td className="px-4 py-3">
                                            <button
                                                type="submit"
                                                className="cursor-pointer p-1 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400"
                                                title={t('delete')}
                                            >
                                                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.4" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                </svg>

                                            </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>

                {/* POPOVER VIEW */}
                {popoverOpen && product && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={closePopover}>
                        <div className="bg-white p-4 rounded-lg max-w-2xl w-full shadow-lg">
                            <ViewProduct productSelected={product} />
                        </div>
                    </div>
                )}

            </main>

            {/* PAGINATION */}
            <div className="mt-4 flex justify-between items-center">

                <span>
                    {t('TableRecap.pagination.page')} {currentPage} {t('TableRecap.pagination.of')} {totalPages}
                </span>

                <div className="space-x-3">

                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                        </svg>

                    </button>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                        </svg>

                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductsRecapTable;



//sélection de la transaction et sous transaction
function TransactionsDropdown({ transactionsData = [], onSubTransactionSelect, onSelectTransaction }) {
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

    const subTransactions = selectedTransaction?.items?.map(i => i.subTransaction) || [];

    const handleTransactionSelect = (tItem) => {
        setSelectedTransaction(tItem);
        onSelectTransaction?.(tItem);
        setOpenMenu({ main: false, sub: true });
    };

    if (!transactionsData.length) return null;

    return (
        <div ref={containerRef} className="flex gap-2">

            {/* MAIN DROPDOWN */}
            <div className="relative">
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

                {openMenu?.main && (

                    <div className="absolute mt-2 w-64 rounded-md bg-white shadow-lg">

                        {transactionsData?.map(tItem => (

                            <button
                                key={tItem?.transaction.id}
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => handleTransactionSelect(tItem)}
                            >
                                {tItem?.transaction.id} — {tItem?.transaction.status} — {convertDate(tItem?.transaction?.created_at)}
                            </button>
                        ))}

                    </div>
                )}
            </div>

            {/* SUB TRANSACTIONS */}
            <div className="relative">

                <button
                    onClick={() => subTransactions.length && setOpenMenu(m => ({ ...m, sub: !m.sub }))}
                    className="border-blue-200 
                    h-10 px-3 rounded-full bg-gray-100 
                    disabled:opacity-50 flex gap-2 items-center justify-center
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-400
                    "
                    disabled={!selectedTransaction}
                >
                    <p>{t('sub_transaction')}</p>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m19 9-7 7-7-7" />
                    </svg>

                </button>

                {
                    openMenu?.sub && subTransactions.length > 0 && (

                    <div className="absolute mt-2 w-64 rounded-md bg-white shadow-lg">
                        {subTransactions.map((sub, i) => (
                            <button
                                key={sub?.id || i}
                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => onSubTransactionSelect(sub)}
                            >
                                {sub?.id} — {sub?.status}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

