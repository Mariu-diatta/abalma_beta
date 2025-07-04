import React, { useState } from 'react';
import ViewProduct from '../components/ViewProduct';
import { useTranslation } from 'react-i18next';

const ProductsRecapTable = ({ products }) => {

    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);

    const [productList, setProductList] = useState(products);

    const [searchTerm, setSearchTerm] = useState('');

    const [selectedStatus, setSelectedStatus] = useState('');

    const [popoverOpen, setPoverOpen] = useState(false)

    const closePopover = () => setPoverOpen(false)

    const displayedStatus = ['en cours', 'offert', 'preter', 'acheter', 'vendu'];

    const itemsPerPage = 5;

    const handleDelete = (id) => {

        const updatedList = productList.filter(product => product.id !== id);

        setProductList(updatedList);
    };

    const filteredProducts = productList.filter(product => {

        const matchesStatus = selectedStatus === '' || product.statut?.toLowerCase() === selectedStatus?.toLowerCase();

        const matchesSearch = product.categorie_product?.toLowerCase().includes(searchTerm?.toLowerCase());

        return displayedStatus?.includes(product.statut?.toLowerCase()) && matchesStatus && matchesSearch;
    });

    const paginatedProducts = filteredProducts.slice(

        (currentPage - 1) * itemsPerPage,

        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="mt-6 w-full style_bg">

            <nav className="flex flex-row items-center gap-2 m-2 style_bg">

                <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />

                </svg>

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">{t('TableRecap.title')}</h2>

            </nav>

            <div className="m-2 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 style_bg">

                <select

                    value={selectedStatus}

                    onChange={(e) => setSelectedStatus(e.target.value)}

                    className="px-3 py-2 border rounded-md shadow-sm  bg-gray-100 border border-gray-300 rounded-lg style_bg"

                >
                    <option value="">{t('TableRecap.statusAll')}</option>

                    {displayedStatus.map(status => (

                        <option key={status} value={status}>{status}</option>

                    ))}

                </select>



                {/* Recherche */}
                <div className="relative w-full sm:w-auto">

                    <input
                        type="text"
                        placeholder={t('TableRecap.searchPlaceholder')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        aria-label="Recherche dans la table"
                    />

                </div>

            </div>

            <div className="overflow-x-auto rounded-md shadow">

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left">

                    <thead className="bg-gray-100 dark:bg-gray-700 style_bg">

                        <tr>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.name')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.categories')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.status')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.price')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.operationDate')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.endDate')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.operation')}</th>

                            <th className="px-4 py-3">{t('TableRecap.tableHeaders.actions')}</th>

                            <th scope="col" className="px-6 py-3">{t('TableRecap.tableHeaders.view')}</th>

                        </tr>

                    </thead>

                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 style_bg">

                        {paginatedProducts.length === 0 ? (

                            <tr>

                                <td colSpan="7" className="text-center p-4 text-gray-500 dark:text-gray-300">
                                    {t('TableRecap.noProducts')}
                                </td>

                            </tr>

                        ) : (
                                paginatedProducts.map((item, _) => (

                                    <tr key={item?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item?.description_product}</td>

                                    <td className="px-4 py-3">{item?.categorie_product}</td>

                                    <td className="px-4 py-3 capitalize">{"en cours "}</td>

                                    <td className="px-4 py-3">{item?.price_product}</td>

                                    <td className="px-4 py-3">{item?.date_emprunt || 'N/A'}</td>

                                    <td className="px-4 py-3">{item?.date_fin_emprunt || '-'}</td>

                                    <td className="px-4 py-3">{item?.operation_product || '-'}</td>

                                    <td className="px-4 py-3">

                                        <button
                                            onClick={() => handleDelete(item?.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600 text-sm cursor-pointer"
                                        >
                                            <svg className="w-[25px] h-[20px] text-gray-800 boder-red-200 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>

                                        </button>

                                    </td>

                                    <td className="px-6 py-3">

                                        <button
                                            className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" onClick={() => setPoverOpen(true)}
                                                aria-label={`Voir ${item?.id}`}
                                            
                                        >
                                            <svg className="w-[25px] h-[25px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="0.8" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                <path stroke="currentColor" strokeWidth="0.8" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>

                                        </button>

                                    </td>

                                 </tr>
                            ))
                        )}

                    </tbody>

                </table>

                {/* Popover overlay */}
                {popoverOpen && (
                    <>
                        {/* Fond semi-transparent */}
                        <div

                            className="fixed inset-0  bg-opacity-30 z-40"

                            onClick={closePopover}

                        ></div>

                        {/* Popover */}
                        <div

                            className="fixed top-1/2 left-1/2 z-50 max-w-full  bg-white  rounded-md shadow-lg p-4 transform -translate-x-1/2 -translate-y-1/2"

                            role="dialog"

                            aria-modal="true"

                            aria-labelledby="popover-title"
                        >
                            <div className="flex  items-center  max-w-full ">

                                <ViewProduct />

                            </div>
             
                        </div>
                    </>
                )}


            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">

                <span>
                    {t('TableRecap.pagination.page')} {currentPage} {t('TableRecap.pagination.of')} {totalPages}
                </span>

                <div className="space-x-2">

                    <button

                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}

                        disabled={currentPage === 1}

                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {t('TableRecap.pagination.previous')}

                    </button>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}

                        disabled={currentPage === totalPages}

                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        {t('TableRecap.pagination.next')}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductsRecapTable;
