import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ViewProduct from '../components/ViewProduct';
import {
    API_URL_BACKEND, CONSTANTS, MODE, NAMES_TABLES, OPERATIONS_STATUS,
    STATUS_FLOW_SUBTRANSACTION, STATUS_FLOW_TRANSACTION, convertDate,
    updateStatusTransaction,
} from '../utils';
import TransactionsDropdown from './TransactionsDropdown';
import api from '../services/Axios';
import LoadingCard from '../components/LoardingSpin';
import TransactionAndSubTransactionCard from './SubTransactionCard';
import {createPortal} from "react-dom"

// ─── Constantes ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

// ─── Icônes ───────────────────────────────────────────────────────────────────
const EyeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1.8" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
        <path stroke="currentColor" strokeWidth="1.8" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
    </svg>
);

const ChevronIcon = ({ dir }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d={dir === 'left' ? 'm15 19-7-7 7-7' : 'm9 5 7 7-7 7'} />
    </svg>
);

// ─── Composant ────────────────────────────────────────────────────────────────
const ProductsRecapTable = ({ products = [], setProductsTrasaction, title, mode }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [currentProductDeleted, setCurrentProductDeleted] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [productView, setProductView] = useState(null);
    const [inLoadUpdateTransStatus, setInloadUpdateTransStatus] = useState(false);
    const [inloadUpdateSubTransStatus, setInloadUpdateSubTransStatus] = useState(false);
    const [selectedSubTransaction, setSelectedSubTransaction] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactionsData, setTransactionsData] = useState([]);
    const [subTransactionsData, setSubTransactionsData] = useState([]);
    const [deletedSubTrans, setDeletedSubTrans] = useState(false);
    const [deletedTrans, setDeletedTrans] = useState(false);

    const statusLabels = useMemo(() => OPERATIONS_STATUS, []);

    // ── Reset sous-transaction quand la transaction change ──
    useEffect(() => { setSelectedSubTransaction(null); }, [selectedTransaction]);

    // ── Fetch transactions ──
    useEffect(() => {
        api.get('transactions/products/', { params: { mode } })
            .then(({ data }) => setTransactionsData(data?.results || data))
            .catch((err) => console.error('Erreur transactions:', err));
        setDeletedTrans(false);
    }, [mode]);

    // ── Fetch sous-transactions ──
    useEffect(() => {
        if (!selectedTransaction?.id) return;
        api.get('sub/transaction/', { params: { trans_id: selectedTransaction.id, mode } })
            .then(({ data }) => setSubTransactionsData(data?.sub_transactions))
            .catch((err) => console.error('Erreur sous-transactions:', err));
        setDeletedSubTrans(false);
    }, [selectedTransaction, mode]);

    // ── Fetch produits de la sous-transaction ──
    useEffect(() => {
        if (!selectedSubTransaction?.id) return;
        api.get('item/products/transaction/', { params: { subTrans_id: selectedSubTransaction.id } })
            .then(({ data }) => setProductsTrasaction(data?.products_transactions))
            .catch((err) => console.error('Erreur produits transaction:', err));
    }, [selectedSubTransaction, setProductsTrasaction]);

    // ── Suppression produit ──
    const deleteProduct = async (item) => {
        setCurrentProductDeleted(item?.id);
        setLoadingDelete(true);
        try {
            await api.delete(`produits/${item?.id}/`);
        } catch (err) {
            alert(err?.response?.data?.detail || 'Erreur lors de la suppression');
        } finally {
            setLoadingDelete(false);
            setCurrentProductDeleted(null);
        }
    };

    // ── Extraction produits ──
    const extractAllProducts = (list) =>
        list.flatMap((p) => p.items?.flatMap((sub) => sub.items?.map((i) => i.product) || []) || []);

    // ── Filtrage + sélection transaction ──
    const filteredProducts = useMemo(() => {
        setDeletedTrans(false);
        setDeletedSubTrans(false);

        if (selectedTransaction && !selectedSubTransaction) return [];

        if (selectedSubTransaction) {
            return products.filter((item) => item?.product).map((item) => item.product);
        }

        let result = extractAllProducts(products);

        if (selectedStatus) {
            result = result.filter((p) => statusLabels[p.operation_product] === selectedStatus);
        }
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter((p) => p?.description_product?.toLowerCase().includes(term));
        }

        return result;
    }, [products, selectedSubTransaction, selectedTransaction, selectedStatus, searchTerm, statusLabels]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedProducts = useMemo(() => {
        const start = (safePage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, safePage]);

    // ── Handler mise à jour statut transaction ──
    const handleUpdateTransStatus = async () => {
        try {
            const resp = await updateStatusTransaction(
                API_URL_BACKEND?.STATUS_TRANSACTION,
                { transaction_id: selectedTransaction?.id, new_status: STATUS_FLOW_TRANSACTION[selectedTransaction?.status] },
                setInloadUpdateTransStatus,
                dispatch
            );
            setTransactionsData((prev) =>
                prev.map((el) => el.id === selectedTransaction?.id ? { ...el, status: resp?.new_status } : el)
            );
        } catch (err) { console.error(err); }
    };

    const handleUpdateSubTransStatus = async () => {
        try {
            const resp = await updateStatusTransaction(
                API_URL_BACKEND?.STATUS_SUB_TRANSACTION,
                { sub_transaction_id: selectedSubTransaction?.id, new_status: STATUS_FLOW_SUBTRANSACTION[selectedSubTransaction?.status] },
                setInloadUpdateSubTransStatus,
                dispatch
            );
            setSubTransactionsData((prev) =>
                prev.map((el) => el.id === selectedSubTransaction?.id ? { ...el, status: resp?.new_status } : el)
            );
        } catch (err) { console.error(err); }
    };

    const isBuyMode = mode === MODE.BUY;

    return (
        <>
            <div className="prt-root prt-wrap">

                {/* Toolbar */}
                <div className="prt-toolbar">
                    <h2 className="prt-title">
                        📋 {title}
                        {filteredProducts.length > 0 && (
                            <span className="prt-count">{filteredProducts.length}</span>
                        )}
                    </h2>
                </div>

                {/* Filtres */}
                <div className="prt-filters">
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setSelectedSubTransaction(null);
                            setSelectedTransaction(null);
                        }}
                        className="prt-select"
                        aria-label="Filtrer par statut"
                    >
                        <option value="">{t('TableRecap.statusAll')}</option>
                        {Object.values(statusLabels).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {!selectedStatus && (
                        <TransactionsDropdown
                            transactionsData={transactionsData}
                            subTransactionsData={subTransactionsData}
                            onSelectTransaction={setSelectedTransaction}
                            onSubTransactionSelect={setSelectedSubTransaction}
                        />
                    )}

                    <div className="prt-search-wrap">
                        <span className="prt-search-icon">
                            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('TableRecap.searchPlaceholder')}
                            className="prt-search"
                            aria-label={t('TableRecap.searchPlaceholder')}
                        />
                    </div>
                </div>

                {/* Cartes transaction / sous-transaction */}
                {(selectedTransaction || selectedSubTransaction) && (
                    <div className="prt-trans-row">
                        {selectedTransaction && !deletedTrans && (
                            <TransactionAndSubTransactionCard
                                title="Transaction"
                                icon={<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z" /></svg>}
                                status={selectedTransaction?.status}
                                url="transactions/products"
                                pk={selectedTransaction?.id}
                                data={transactionsData}
                                setData={setTransactionsData}
                                setDeleted={setDeletedTrans}
                                createdAt={convertDate(selectedTransaction?.created_at)}
                                code={selectedTransaction?.code}
                                price={selectedTransaction?.price}
                                priceLabel={t('recaptTransaction.price')}
                                showAction={!isBuyMode}
                                isLoading={inLoadUpdateTransStatus}
                                actionDisabled={false}
                                actionLabel={STATUS_FLOW_TRANSACTION[selectedTransaction?.status]}
                                onClick={handleUpdateTransStatus}
                            />
                        )}

                        {selectedSubTransaction && !deletedSubTrans && (
                            <TransactionAndSubTransactionCard
                                title="Sous-transaction"
                                icon={<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z" /></svg>}
                                url="sub/transaction"
                                pk={selectedSubTransaction?.id}
                                status={selectedSubTransaction?.status}
                                data={subTransactionsData}
                                setData={setSubTransactionsData}
                                setDeleted={setDeletedSubTrans}
                                createdAt={convertDate(selectedSubTransaction?.created_at)}
                                code={selectedSubTransaction?.code}
                                price={selectedSubTransaction?.price}
                                priceLabel={t('recaptTransaction.price')}
                                showAction={!isBuyMode}
                                isLoading={inloadUpdateSubTransStatus}
                                actionLabel={STATUS_FLOW_SUBTRANSACTION[selectedSubTransaction?.status]}
                                actionDisabled={false}
                                onClick={handleUpdateSubTransStatus}
                            />
                        )}
                    </div>
                )}

                {/* Tableau */}
                <div className="prt-table-wrap scrollbor_hidden">
                    <table className="prt-table">
                        <thead>
                            <tr>
                                {NAMES_TABLES?.map((header) => {
                                    const isHidden = isBuyMode && (header === CONSTANTS.UPDATE || header === CONSTANTS.ACTION);
                                    if (isHidden) return null;
                                    return (
                                        <th key={header}>
                                            {t(`TableRecap.tableHeaders.${header}`)}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={NAMES_TABLES?.length} className="prt-empty">
                                        {t('TableRecap.noProducts')}
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((item, idx) => (
                                    <tr key={item?.id ?? idx}>
                                        <td>{item?.name_product?.slice(0, 20) || '—'}</td>
                                        <td>{item?.categorie_product?.name || item?.categorie_product || '—'}</td>
                                        <td>
                                            <span className={`prt-badge ${item?.is_active ? 'prt-badge-active' : 'prt-badge-inactive'}`}>
                                                {item?.is_active ? '✓ Actif' : '✗ Inactif'}
                                            </span>
                                        </td>
                                        <td>{item?.price_product ? `${item.price_product} ${item?.currency_price || ''}` : '—'}</td>
                                        <td>{item?.created_at ? convertDate(item.created_at) : item?.created ? convertDate(item.created) : '—'}</td>
                                        <td>
                                            <span className={`prt-badge ${item?.is_available ? 'prt-badge-avail' : 'prt-badge-unavail'}`}>
                                                {item?.is_available ? '● Disponible' : '○ Indisponible'}
                                            </span>
                                        </td>
                                        <td>{item?.operation_product || '—'}</td>
                                        <td>{item?.created ? convertDate(item.created) : '—'}</td>
                                        <td>{item?.date_fin_emprunt || '—'}</td>
                                        <td>{item?.date_fin_stock || '—'}</td>

                                        {/* Voir */}
                                        <td>
                                            <button
                                                type="button"
                                                className="prt-btn-view"
                                                onClick={() => { setPopoverOpen(true); setProductView(item); }}
                                                aria-label="Voir le produit"
                                                title="Voir"
                                            >
                                                <EyeIcon />
                                            </button>
                                        </td>

                                        {/* Supprimer (caché en mode achat) */}
                                        {!isBuyMode && (
                                            <td>
                                                {loadingDelete && currentProductDeleted === item?.id ? (
                                                    <LoadingCard />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="prt-btn-del"
                                                        onClick={() => deleteProduct(item)}
                                                        aria-label={t('delete')}
                                                        title={t('delete')}
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredProducts.length > ITEMS_PER_PAGE && (
                    <div className="prt-pagination">
                        <p className="prt-page-info">
                            Page <strong>{safePage}</strong> / {totalPages}
                            <span style={{ margin: '0 6px', color: '#cbd5e1' }}>·</span>
                            {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''}
                        </p>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button
                                type="button"
                                className="prt-page-btn"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={safePage === 1}
                                aria-label="Page précédente"
                            >
                                <ChevronIcon dir="left" />
                            </button>
                            <button
                                type="button"
                                className="prt-page-btn"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={safePage === totalPages}
                                aria-label="Page suivante"
                            >
                                <ChevronIcon dir="right" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal aperçu produit */}
                {popoverOpen && productView && createPortal(
                    <div
                        className="prt-overlay"
                        onClick={() => setPopoverOpen(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Aperçu du produit"
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <ViewProduct productSelected={productView} />
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </>
    );
};

export default ProductsRecapTable;