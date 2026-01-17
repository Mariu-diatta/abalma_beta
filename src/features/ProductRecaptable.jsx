import React, { useMemo, useState } from 'react';
import ViewProduct from '../components/ViewProduct';
import { useTranslation } from 'react-i18next';
import {
    API_URL_BACKEND, CONSTANTS, MODE, NAMES_TABLES, OPERATIONS_STATUS, STATUS_FLOW_ITEM,STATUS_FLOW_SUBTRANSACTION, STATUS_FLOW_TRANSACTION, convertDate } from '../utils';
import { TitleCompGenLitle } from '../components/TitleComponentGen';
import TransactionsDropdown from './TransactionsDropdown';
import { useEffect } from 'react';
import api from '../services/Axios';
import { useDispatch, } from 'react-redux';
import { showMessage } from '../components/AlertMessage';
import LoadingCard from '../components/LoardingSpin';
import SubTransactionCard from './SubTransactionCard';

const ProductsRecapTable = ({ products = [], setProductsTrasaction, title, mode }) => {

    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loadingDelet, setLoadingDelete] = useState(false);

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [product, setProductView] = useState(null);
    const [inLoadUpdateProductTransStatus, setInLoadUpdateProductTransStatus] = useState(false);
    const [inLoadUpdateTransStatus, setInloadUpdateTransStatus] = useState(false);
    const [inloadUpdateSubTransStatus, setInloadUpdateSubTransStatus] = useState(false);
    const dispatch = useDispatch();

    const [selectedSubTransaction, setSelectedSubTransaction] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionsData, setTransactionsData] = useState([]);
    const [subTransactionsData, setSubTransactionsData] = useState([]);
    const [deletedSubTrans, setDeletedSubTrans] = useState(false);
    const [deletedTrans, setDeletedTrans] = useState(false);
    const [currentProductDeleted, setCurrentProductDeleted] = useState(null);

    const itemsPerPage = 5;

    const statusLabels = useMemo(() => (OPERATIONS_STATUS), []);

    const deleteProduct = async (item) => {

        setCurrentProductDeleted(item?.id)

        setLoadingDelete(true)

        try {
            await api.delete(`produits/${item?.id}/`).then(

                resp => {
                    console.log("Response user :::", resp)
                }

            ).catch(

                err => {
                    //console.log("Erreur log :::", err)
                    alert(err?.response?.data?.detail)

                }

            )

        } catch (err) {

            alert(err?.response?.data?.detail)

        } finally {

            setLoadingDelete(false)
        }
    }

    /** 🔍 Extraction simple de TOUS les produits */
    const extractAllProducts = (products) => {
        return products.flatMap(p =>
            p.items?.flatMap(sub =>
                sub.items?.map(i => i.product) || []
            ) || []
        );
    };

    const filteredProducts = useMemo(() => {
        let result = extractAllProducts(products);
        setDeletedTrans(false)
        setDeletedSubTrans(false)

        // Filtrer par statut
        if (selectedStatus) {
            result = result.filter(p =>
                statusLabels[p.operation_product] === selectedStatus
            );
        }

        // Filtre de recherche
        if (searchTerm.trim()) {

            const term = searchTerm.toLowerCase();

            result = result.filter(p =>
                p?.description_product?.toLowerCase().includes(term)
            );
        }


        if (selectedTransaction && !selectedSubTransaction) {

            return []
        }

        if (selectedSubTransaction) {

            const listProdt = [];

            products?.forEach(item => {

                if (item?.product) {

                    listProdt.push(item.product);
                }
            });

            return listProdt;
        }

        return result;

    }, [
        products,
        selectedSubTransaction,
        selectedStatus,
        searchTerm,
        statusLabels,
        selectedTransaction
    ]);

    /** 📄 Pagination */
    const totalPages = Math.max(1, Math.ceil(filteredProducts?.length / itemsPerPage));

    const paginatedProducts = useMemo(() => {

        const start = (currentPage - 1) * itemsPerPage;

        return filteredProducts?.slice(start, start + itemsPerPage);

    }, [filteredProducts, currentPage]);

    const closePopover = () => setPopoverOpen(false);

    const updateStatusTransaction = (url, data, func) => {

        try {

            func(true)

            const response = api.post(`${url}/`, data).then(

                resp => console.log(resp)

            ).catch(

                err => console.log(err)
            )

            console.log(response?.message)

            const messSuccess = response?.message?.message || "Message success"

            showMessage(dispatch, { Type: "Success", Message: messSuccess || "Error not found: user not login" });

        } catch (e) {

            console.log("Erreur de la mise à jour", e)

            const errorMessage = e?.message || e?.response?.data?.detail || "Erreur de la mise à jour"

            func(false)

            showMessage(dispatch, { Type: "Erreur", Message: errorMessage || "Error not found: user not login" });

        } finally {

            func(false)
        }
    }

    useEffect(() => {setSelectedSubTransaction(null)}, [selectedTransaction] )

    useEffect(

        () => {

            api.get("transactions/products/", {

                params: {

                    mode: mode
                }

            }).then(

                resp => {

                    setTransactionsData(resp?.data?.results || resp?.data);
                }

            ).catch(

                err => console.log("ERREUR LIST TRANSACTION :::", err)
            )

            setDeletedTrans(false)

        }, [mode]
    )

    useEffect(

        () => {

            if (!selectedTransaction?.id) return

            api.get("sub/transaction/", {

                params: {

                    trans_id: selectedTransaction.id,

                    mode: mode

                }

            }).then(

                resp => {

                    setSubTransactionsData(resp?.data?.sub_transactions)
                }

            ).catch(

                err => console.log("ERREUR LIST SUB TRANSACTION :::", err)
            )

            setDeletedSubTrans(false)

        }, [selectedTransaction, mode]
    )

    useEffect(

        () => {

            if (!selectedSubTransaction?.id) return

            api.get("item/products/transaction/", {

                params: {

                    subTrans_id: selectedSubTransaction.id
                }

            }).then(

                resp => {

                    setProductsTrasaction(resp?.data?.products_transactions)
                }

            ).catch(

                err => console.log("ERREUR LIST SUB PRODUITS TRANSACTION :::", err)
            )

        }, [selectedSubTransaction, setProductsTrasaction]
    )


    return (

        <div className="style_bg overflow-x-auto sm:rounded-lg p-2 ">

            {/* TITRE */}
            <nav className="flex items-center gap-2 m-2">

                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />

                </svg>

                <TitleCompGenLitle title={title} />

            </nav>

            {/* FILTRES */}
            <div className="m-2 flex flex-wrap gap-4 items-center pb-4">

                {/* Filtre par statut */}
                <select

                    value={selectedStatus}

                    onChange={e => {

                        setSelectedStatus(e.target.value);

                        setSelectedSubTransaction(null);

                        setSelectedTransaction(null)
                    }}

                    className="px-2 py-2 border rounded-full flex border-blue-50  focus:border-blue-50 focus:ring-1 focus:ring-blue-100  "
                >
                    <option value="">{t('TableRecap.statusAll')}</option>

                    {
                        Object.values(statusLabels).map(s => (

                            <option key={s} value={s}>{s}</option>

                        ))
                    }

                </select>

                {/* Transactions */}
                {
                    (!selectedStatus) && (
                        <TransactionsDropdown
                            transactionsData={transactionsData}
                            subTransactionsData={subTransactionsData}
                            onSelectTransaction={setSelectedTransaction}
                            onSubTransactionSelect={setSelectedSubTransaction}
                        />
                    )
                }

                {/* Recherche */}
                <input
                    type="text"
                    placeholder={t('TableRecap.searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="focus:outline-none focus:ring-0 rounded-full border px-3 py-2 border-blue-50 focus:border-blue-50 focus:ring-1 focus:ring-blue-100"
                />

            </div>

            {
                (selectedTransaction || selectedSubTransaction) && (

                    <div className="flex flex-col md:flex-row md:justify-center md:w-auto md:mx-auto gap-7  mb-4 p-3 rounded-lg">

                        {
                            (selectedTransaction && !deletedTrans) && (

                                <SubTransactionCard
                                    title="Transaction"
                                    icon={
                                        <svg
                                            className="w-6 h-6 text-gray-800"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1"
                                                d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                                            />
                                        </svg>
                                    }
                                    url="transactions/products"
                                    pk={selectedTransaction?.id}
                                    data={transactionsData}
                                    setData={setTransactionsData}
                                    setDeleted={setDeletedTrans}
                                    status={selectedTransaction?.status}
                                    createdAt={convertDate(selectedTransaction?.created_at)}
                                    code={selectedTransaction?.code}
                                    price={selectedTransaction?.price}
                                    priceLabel={t("recaptTransaction.price")}
                                    showAction={mode !== MODE.BUY}
                                    isLoading={inLoadUpdateTransStatus}
                                    actionDisabled={currentPage === 1}
                                    actionLabel={STATUS_FLOW_TRANSACTION[selectedTransaction?.status]}
                                    onAction={() =>
                                        updateStatusTransaction(
                                            API_URL_BACKEND?.STATUS_TRANSACTION,
                                            {
                                                transaction_id: selectedTransaction?.id,
                                                new_status:
                                                    STATUS_FLOW_TRANSACTION[selectedTransaction?.status],
                                            },
                                            setInloadUpdateTransStatus
                                        )
                                    }
                                />
                            )
                        }

                        {
                            (selectedSubTransaction && !deletedSubTrans) && (

                                <SubTransactionCard
                                    title="Sous-transaction"
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z"
                                            />
                                        </svg>
                                    }
                                    url="sub/transaction"
                                    pk={selectedSubTransaction?.id}
                                    status={selectedSubTransaction?.status}
                                    data={subTransactionsData}
                                    setData={setSubTransactionsData}
                                    setDeleted={setDeletedSubTrans}
                                    createdAt={convertDate(selectedSubTransaction?.created_at)}
                                    code={selectedSubTransaction?.code}
                                    price={selectedSubTransaction?.price}
                                    priceLabel={t("recaptTransaction.price")}
                                    showAction={mode !== MODE.BUY}  
                                    isLoading={inloadUpdateSubTransStatus}
                                    actionLabel={STATUS_FLOW_SUBTRANSACTION[selectedSubTransaction?.status]}
                                    actionDisabled={currentPage === 1}
                                    onAction={() =>
                                        updateStatusTransaction(
                                            API_URL_BACKEND?.STATUS_SUB_TRANSACTION,
                                            {
                                                sub_transaction_id: selectedSubTransaction?.id,
                                                new_status:
                                                    STATUS_FLOW_TRANSACTION[selectedSubTransaction?.status],
                                            },
                                            setInloadUpdateSubTransStatus
                                        )
                                    }
                                />

                            )
                        }

                    </div>
                )
            }

            {/* TABLEAU */}
            <main className="style_bg overflow-x-auto sm:rounded-lg p-2 z-0 ">

                <table
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-2"
                >

                    <thead className="bg-gray-100">

                        <tr>
                            {
                                NAMES_TABLES?.map(header => (

                                        <th key={header}
                                        className={`px-4 py-3 ${(mode === MODE.BUY && (header === CONSTANTS.UPDATE || header === CONSTANTS.ACTION))?"hidden":""}`}
                                        >
                                          { t(`TableRecap.tableHeaders.${header}`)} 

                                        </th>
                                    )
                                )
                            }
                        </tr>

                    </thead>

                    <tbody className="bg-white">

                        {
                            (paginatedProducts?.length === 0) ?
                            (
                                <tr>
                                    <td colSpan="9" className="text-center p-4 text-gray-500">
                                        {t('TableRecap.noProducts')}
                                    </td>
                                </tr>
                            ) 
                            : 
                            (
                                paginatedProducts?.map((item, index) => (

                                    <tr
                                        key={index}
                                        className=" dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-3">{item?.description_product?.slice(0, 6) || '-'}</td>
                                        <td className="px-4 py-3">{item?.categorie_product || '-'}</td>
                                        <td className="px-4 py-3 capitalize">{item?.status || '-'}</td>
                                        <td className="px-4 py-3">{item?.price_product || '-'}</td>
                                        <td className="px-4 py-3">{item?.created_at ? convertDate(item?.created_at) : convertDate(item?.created) || '-'}</td>
                                        <td className="px-4 py-3">{convertDate(item?.created) || 'N/A'}</td>
                                        <td className="px-4 py-3">{item?.date_fin_emprunt || '-'}</td>
                                        <td className="px-4 py-3">{item?.operation_product || '-'}</td>
                                        <td className="px-4 py-3">

                                            <button
                                                onClick={() => {
                                                    setPopoverOpen(true);
                                                    setProductView(item);
                                                }}
                                                className="p-1 bg-gradient-to-br from-purple-100 hover:bg-gradient-to-br hover:from-purple-400 text-white rounded-lg hover:bg-blue-700 text-xs"
                                            >
                                                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeWidth="1" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                    <path stroke="currentColor" strokeWidth="1" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>

                                            </button>

                                        </td>

                                        <td className={`px-4 py-3 ${mode === MODE.BUY?"hidden":""}`}>
                                            {
                                                !(loadingDelet && currentProductDeleted === item?.id) ?
                                                <button
                                                    className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 bg-gradient-to-br from-pink-100 to-orange-50 hover:bg-gradient-to-br hover:to-orange-500 hover:bg-pink-200"
                                                    title={t('delete')}
                                                        onClick={
                                                            () => {
                                                                deleteProduct(item)
                                                             }
                                                        }
                                                >
                                                    <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.4" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                    </svg>

                                                </button>
                                                :
                                                <LoadingCard />
                                            }
                                        </td>

                                        {
                                            (MODE.BUY && mode !== MODE.BUY && STATUS_FLOW_ITEM[item?.status] !== CONSTANTS.CONFIRMED) &&
                                            <td className={`px-4 py-3 ${mode === MODE.BUY ? "hidden" : ""}`}>

                                                {
                                                    !inLoadUpdateProductTransStatus?
                                                    <button
                                                        onClick={() => updateStatusTransaction(
                                                            API_URL_BACKEND?.STATUS_TRANSACTION_PRODUCT,
                                                            {
                                                                item_id: item?.item_id,
                                                                new_status: STATUS_FLOW_ITEM[item?.status]
                                                            },
                                                            setInLoadUpdateProductTransStatus

                                                        )}
                                                        disabled={selectedSubTransaction ? false : true}
                                                        className="disabled:opacity-40 disabled:bg-gray-50 hover:bg-blue-300 px-2 cursor-pointer p-1 rounded-lg bg-gradient-to-br from-blue-100 to-orange-50"
                                                        title={t('update')}
                                                    >
                                                        {STATUS_FLOW_ITEM[item?.status]}

                                                    </button> 
                                                    :
                                                    <LoadingCard/>

                                                }

                                            </td>
                                        }
                                    </tr>
                                )
                            )
                        )}

                    </tbody>

                </table>

                {/* POPOVER VIEW */}
                {
                    (popoverOpen && product) && (

                        <div
                            style={{ zInddex: 9999 }}

                            className="fixed inset-0 flex items-center justify-center bg-black/40 " onClick={closePopover}
                        >

                            <ViewProduct productSelected={product} />

                        </div>
                    )
                }

            </main>

            {/* PAGINATION */}
            <div className=" flex justify-between items-center mt-1 pb-6 px-1">

                <span>
                    {/*{t('TableRecap.pagination.page')} {currentPage} {t('TableRecap.pagination.of')} {totalPages}*/}
                    Page {currentPage} / {totalPages}
                </span>

                <div>

                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border-gray-200 rounded-full disabled:opacity-40"

                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                        </svg>

                    </button>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border-gray-200 rounded-full disabled:opacity-40"
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




