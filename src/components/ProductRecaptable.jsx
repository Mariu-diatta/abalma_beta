import React, { useState } from 'react';
import ViewProduct from './ViewProduct';

const ProductsRecapTable = ({ products }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [productList, setProductList] = useState(products);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [popoverOpen, setPoverOpen] = useState(false)

    const closePopover = () => setPoverOpen(false)
    const displayedStatus = ['en cours', 'offert', 'preter'];
    const itemsPerPage = 5;

    const handleDelete = (id) => {
        const updatedList = productList.filter(product => product.id !== id);
        setProductList(updatedList);
    };

    const filteredProducts = productList.filter(product => {
        const matchesStatus = selectedStatus === '' || product.statut.toLowerCase() === selectedStatus.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return displayedStatus.includes(product.statut.toLowerCase()) && matchesStatus && matchesSearch;
    });

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="mt-6 w-full">

            <nav className="flex flex-row items-center gap-2 m-2">

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>

                <h2 className="text-2xl font-semibold  text-gray-800 dark:text-white">Mes achats</h2>

            </nav>

            <div className="m-2 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md shadow-sm  bg-gray-100 border border-gray-300 rounded-lg"

                >
                    <option value="">Tous</option>
                    {displayedStatus.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>



                {/* Recherche */}
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        aria-label="Recherche dans la table"
                    />
                </div>

            </div>

            <div className="overflow-x-auto rounded-md shadow">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Nom</th>
                            <th className="px-4 py-3">Categorie</th>
                            <th className="px-4 py-3">Statut</th>
                            <th className="px-4 py-3">Prix</th>
                            <th className="px-4 py-3">Date d operation</th>
                            <th className="px-4 py-3">Date de fin</th>
                            <th className="px-4 py-3">Actions</th>
                            <th scope="col" className="px-6 py-3">Consulter</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-500 dark:text-gray-300">
                                    Aucun produit a afficher.
                                </td>
                            </tr>
                        ) : (
                            paginatedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                    <td className="px-4 py-3">{product.category}</td>
                                    <td className="px-4 py-3 capitalize">{product.statut}</td>
                                    <td className="px-4 py-3">{product.price}</td>
                                    <td className="px-4 py-3">{product.date || 'N/A'}</td>
                                    <td className="px-4 py-3">{product.endDate || '-'}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600 text-sm cursor-pointer"
                                        >
                                            <svg className="w-6 h-5 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd" />
                                            </svg>

                                        </button>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" onClick={() => setPoverOpen(true)}
                                            aria-label={`Voir ${product.id}`}
                                            
                                        >
                                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
                                <ViewProduct/>
                            </div>
             
                        </div>
                    </>
                )}


            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                <span>
                    Page {currentPage} sur {totalPages}
                </span>
                <div className="space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Precedent
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsRecapTable;
