import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import { useSelector } from "react-redux";
import CenteredModal from "./ModalProductDetailsViewsCentered";
import { TitleCompGenLitle } from "../components/TitleComponentGen";

const ITEMS_PER_PAGE = 5;

const MyProductList = () => {

    const { t } = useTranslation();

    const getUpdateProduct = useSelector((state) => state.cart.productUpdate);
    const currentUser = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedBtnProduct, setSelectedBtnProduct] = useState(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    /** 🔄 Mise à jour locale après modification */
    useEffect(() => {
        if (!getUpdateProduct?.id) return;

        setProducts((prev) =>
            prev.map((prod) =>
                prod?.code_reference === getUpdateProduct?.code_reference
                    ? getUpdateProduct
                    : prod
            )
        );
    }, [getUpdateProduct]);

    /** 📥 Charger les produits */
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await api.get("owner/product");
                setProducts(res?.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentUser]);

    /** ❌ Suppression */
    const handleDelete = async (id) => {
        if (!window.confirm(t("modifyProduct.confirmDeleteProduct"))) return;

        setLoadingDelete(true);
        setSelectedBtnProduct(id);

        try {
            await api.delete(`produits/${id}/`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingDelete(false);
            setSelectedBtnProduct(null);
        }
    };

    /** 🔍 Filtrage + pagination */
    const filteredProducts = useMemo(() => {
        return products.filter((prod) =>
            prod?.name_product?.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    /** Navigation pagination */
    const nextPage = () => page < totalPages && setPage(page + 1);
    const prevPage = () => page > 1 && setPage(page - 1);

    return (

        <div className="overflow-x-auto sm:rounded-md p-1 shadow-sm dark:text-white text-gray-100">

            {/* 🔍 BARRE DE RECHERCHE */}
            <div className="mb-4 flex justify-between items-center">

                <nav className="flex items-center gap-2 m-2">

                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
                    </svg>

                    <TitleCompGenLitle title={t("myProducts")} />

                </nav>

                <input
                    type="text"
                    placeholder={t("search")}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 rounded-full border   focus:border-blue-500 ring-0 focus:ring-blue-0 focus:outline-none"
                />

            </div>

            {loading ? (
                <LoadingCard />
            ) : (
                <>
                    <table
                       className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg p-1"
                    >

                        <thead className="bg-gray-100">

                            <tr>
                                <th className="px-16 py-3">
                                    <span className="sr-only">{t("tableEntries.image")}</span>
                                </th>
                                <th className="px-6 py-3">{t("tableEntries.product")}</th>
                                <th className="px-6 py-3">{t("tableEntries.category")}</th>
                                <th className="px-6 py-3">{t("tableEntries.quantity")}</th>
                                <th className="px-6 py-3">{t("tableEntries.price")}</th>
                                <th className="px-6 py-3"></th>
                                <th className="px-6 py-3"></th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                (paginatedProducts?.length === 0) ? (

                                    <tr className="">
                                         <td colSpan="4" className="text-center p-4 ">{t('TableRecap.noProducts')}</td>
                                    </tr>
                                )
                                :
                                (
                                    paginatedProducts.map((prod) => (
                                        <tr
                                            key={prod?.id}
                                            className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td className="p-1">
                                                <div className="w-10 h-10 md:w-20 md:h-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                                                    <img
                                                        src={prod?.image_product}
                                                        alt={prod?.name_product}
                                                        className="object-contain w-auto h-auto"
                                                    />
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                    {prod?.description_product?.slice(0, 40)}...
                                            </td>

                                            <td className="px-6 py-4">{prod?.categorie_product}</td>

                                            <td className="px-6 py-4">{prod?.quantity_product}</td>

                                            <td className="px-6 py-4">
                                                <RendrePrixProduitMonnaie item={prod} />
                                            </td>

                                            <td className="px-6 py-4 ">

                                                <CenteredModal product={prod} >
                                                    <img
                                                        src={prod?.image_product}
                                                        alt="Aperçu de l'image sélectionnée"
                                                        className="w-32 h-32 rounded border border-gray-100 shadow object-cover"
                                                    />
                                                </CenteredModal>

                                            </td>

                                            <td className="px-6 py-4">
                                                {loadingDelete && selectedBtnProduct === prod?.id ? (
                                                    <LoadingCard />
                                                ) : (
                                                <button
                                                    onClick={() => handleDelete(prod?.id)}
                                                    className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 bg-gradient-to-br from-pink-100 to-orange-50 hover:bg-gradient-to-br hover:to-orange-500 hover:bg-pink-200"
                                                    title={t('delete')}
                                                >
                                                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.4" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                        </svg>

                                                </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )
                            }

                        </tbody>

                    </table>

                    {/* 🔵 PAGINATION */}
                    <div className="flex justify-between items-center mt-1 pb-6 px-1">

                        <span className="text-sm">
                            Page {page} / {totalPages}
                        </span>

                        <div>
                            <button
                                onClick={prevPage}
                                disabled={page === 1}
                                className="px-3 py-1 border-gray-200 rounded-full disabled:opacity-40"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m15 19-7-7 7-7" />
                                </svg>
                            </button>


                            <button
                                onClick={nextPage}
                                disabled={page === totalPages}
                                className="px-3 py-1 border-gray-200 rounded-full disabled:opacity-40"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m9 5 7 7-7 7" />
                                </svg>

                            </button>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default MyProductList;



