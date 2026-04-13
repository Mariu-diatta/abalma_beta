import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import { useSelector } from "react-redux";
import CenteredModal from "./ModalProductDetailsViewsCentered";
import { TitleCompGenLitle } from "../components/TitleComponentGen";
import ButtonSearchGeneric from "../components/ButtonSearchGeneric";

const ITEMS_PER_PAGE = 5;

// ─── Sous-composant : ligne produit ───────────────────────────────────────────
const ProductRow = ({ prod, onDelete, loadingDelete, selectedBtnProduct, t }) => {

    const isDeleting = loadingDelete && selectedBtnProduct === prod?.id;

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">

            {/* Image */}
            <td className="p-2">
                <div className="w-10 h-10 md:w-16 md:h-16 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50">
                    <img
                        src={prod?.variants?.[0]?.image ?? prod?.image_product}
                        alt={prod?.name_product}
                        className="object-contain w-full h-full"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                    />
                </div>
            </td>

            {/* Nom + description */}
            <td className="px-4 py-3">
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                    {prod?.name_product}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">
                    {prod?.description_product}
                </p>
            </td>

            {/* Catégorie */}
            <td className="px-4 py-3">
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                    {prod?.categorie_product ?? "—"}
                </span>
            </td>

            {/* Quantité */}
            <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {prod?.quantity_product ?? 0}
            </td>

            {/* Prix */}
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                <RendrePrixProduitMonnaie item={prod} />
            </td>

            {/* Modifier */}
            <td className="px-4 py-3">
                <CenteredModal product={prod}>
                    <img
                        src={prod?.image_product}
                        alt="Aperçu"
                        className="w-28 h-28 rounded border border-gray-100 shadow object-cover"
                    />
                </CenteredModal>
            </td>

            {/* Supprimer */}
            <td className="px-4 py-3">
                {isDeleting ? (
                    <LoadingCard />
                ) : (
                    <button
                        onClick={() => onDelete(prod?.id)}
                        title={t("delete")}
                        className="p-1.5 rounded-lg cursor-pointer bg-gradient-to-br from-pink-50 to-orange-50 hover:from-pink-200 hover:to-orange-200 transition"
                    >
                        <svg className="w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth="1.5" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                    </button>
                )}
            </td>

        </tr>
    );
};

// ─── Sous-composant : pagination ──────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPrev, onNext }) => (
    <div className="flex justify-between items-center mt-3 pb-6 px-1">
        <span className="text-xs text-gray-500">
            Page {page} / {totalPages || 1}
        </span>
        <div className="flex gap-1">
            <button
                onClick={onPrev}
                disabled={page === 1}
                className="p-1 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-100 transition"
                aria-label="Page précédente"
            >
                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5" d="m15 19-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={onNext}
                disabled={page === totalPages || totalPages === 0}
                className="p-1 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-100 transition"
                aria-label="Page suivante"
            >
                <svg className="w-5 h-5 text-gray-700" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth="1.5" d="m9 5 7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const MyProductList = () => {

    const { t } = useTranslation();
    const getUpdateProduct = useSelector((state) => state.cart.productUpdate);
    const currentUser = useSelector((state) => state.auth.user);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedBtnProduct, setSelectedBtnProduct] = useState(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Mise à jour locale après modification via Redux
    useEffect(() => {
        if (!getUpdateProduct?.id) return;
        setProducts((prev) =>
            prev.map((prod) =>
                prod.id === getUpdateProduct.id ? { ...prod, ...getUpdateProduct } : prod
            )
        );
    }, [getUpdateProduct]);

    // Chargement des produits
    useEffect(() => {
        if (!currentUser?.id) return;
        let cancelled = false;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get("owner/product");
                if (!cancelled) setProducts(res?.data ?? []);
            } catch (err) {
                if (!cancelled) setError(t("errors.fetchFailed") || "Erreur de chargement.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProducts();
        return () => { cancelled = true; }; // Nettoyage si le composant est démonté
    }, [currentUser?.id, t]);

    // Suppression
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm(t("modifyProduct.confirmDeleteProduct"))) return;
        setLoadingDelete(true);
        setSelectedBtnProduct(id);
        try {
            await api.delete(`produits/${id}/`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            // Revient à la page précédente si la page courante devient vide
            setPage((prev) => (prev > 1 ? prev - 1 : prev));
        } catch {
            alert(t("errors.deleteFailed") || "Erreur lors de la suppression.");
        } finally {
            setLoadingDelete(false);
            setSelectedBtnProduct(null);
        }
    }, [t]);

    // Filtrage
    const filteredProducts = useMemo(() =>
        products.filter((prod) =>
            prod?.name_product?.toLowerCase().includes(search.toLowerCase())
        ),
        [products, search]
    );

    // Reset page si la recherche change
    useEffect(() => { setPage(1); }, [search]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    return (
        <div className="overflow-x-auto sm:rounded-md p-1 shadow-sm dark:text-white">

            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
                <nav className="flex items-center gap-2 m-2">
                    <TitleCompGenLitle title={t("myProducts")} />
                </nav>
                <ButtonSearchGeneric
                    search={search}
                    setSearch={setSearch}
                    setPage={setPage}
                    t={t}
                />
            </div>

            {/* État : chargement */}
            {loading && <LoadingCard />}

            {/* État : erreur */}
            {!loading && error && (
                <p className="text-center text-red-500 text-sm p-4">{error}</p>
            )}

            {/* État : données */}
            {!loading && !error && (
                <>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-sm">

                        <thead className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">{t("tableEntries.image")}</th>
                                <th className="px-4 py-3">{t("tableEntries.product")}</th>
                                <th className="px-4 py-3">{t("tableEntries.category")}</th>
                                <th className="px-4 py-3 text-center">{t("tableEntries.quantity")}</th>
                                <th className="px-4 py-3">{t("tableEntries.price")}</th>
                                <th className="px-4 py-3"></th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-8 text-gray-400 text-sm">
                                        {search
                                            ? t("TableRecap.noResults") || "Aucun résultat pour cette recherche."
                                            : t("TableRecap.noProducts")}
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((prod) => (
                                    <ProductRow
                                        key={prod?.id}
                                        prod={prod}
                                        onDelete={handleDelete}
                                        loadingDelete={loadingDelete}
                                        selectedBtnProduct={selectedBtnProduct}
                                        t={t}
                                    />
                                ))
                            )}
                        </tbody>

                    </table>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => p - 1)}
                        onNext={() => setPage((p) => p + 1)}
                    />
                </>
            )}

        </div>
    );
};

export default MyProductList;