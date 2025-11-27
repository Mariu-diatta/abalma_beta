import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import LoadingCard from "../components/LoardingSpin";
import { ButtonSimple } from "../components/Button";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import { setProductUpdate } from "../slices/cartSlice";
import FormElementFileUpload from "../features/FormFile";

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
        <div
            className="style_bg relative overflow-x-auto sm:rounded-md p-2 shadow-sm "
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        >
            {/* 🔍 BARRE DE RECHERCHE */}
            <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-3">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4" />
                    </svg>

                    <h2 className="font-bold text-gray-600 dark:text-gray-300">
                        {t("myProducts")}
                    </h2>
                </div>

                <input
                    type="text"
                    placeholder={t("search")}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="px-3 py-2 rounded-full border dark:bg-gray-700 dark:border-gray-600 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 "
                />
            </div>

            {loading ? (
                <LoadingCard />
            ) : (
                <>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

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
                            {paginatedProducts.map((prod) => (
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
                                        <CenteredModal product={prod} />
                                    </td>

                                    <td className="px-6 py-4">
                                        {loadingDelete && selectedBtnProduct === prod?.id ? (
                                            <LoadingCard />
                                        ) : (
                                        <button
                                            onClick={() => handleDelete(prod?.id)}
                                            className="cursor-pointer p-1 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400"
                                            title={t('delete')}
                                        >
                                                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.4" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                </svg>

                                        </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 🔵 PAGINATION */}
                    <div className="mt-4 flex justify-between items-center">

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

function CenteredModal({ product }) {

    const { t } = useTranslation();

    const [selectedBtnUpdate, setSelectedBtnUpdate] = useState(null);

    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);

    const [dataProduct, setDataProduct] = useState({
        date_emprunt: product?.date_emprunt,
        date_fin_emprunt: product?.date_fin_emprunt,
        price_product: product?.price_product,
        Currency_price: product?.Currency_price,
        color_product: product?.color_product,
        categorie_product: product?.categorie_product,
        code_reference: product?.code_reference,
        operation_product: product?.operation_product,
        description_product: product?.description_product,
        fournisseur: product?.fournisseur,
        quantity_product: product?.quantity_product,
        name_product: product?.name_product,
        taille_product: product?.taille_product,
        image_product: product?.image_product,
        id: product?.id
    });

    const [alertMessage, setAlertMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [imageFile, setImageFile] = useState(dataProduct?.image_product || null);

    const currentUserCompte = useSelector((state) => state.auth.compteUser);

    const handleFileSelect = (file) => setImageFile(file);

    const onChangeClick = useCallback((e) => {

        const { name, value } = e.target;

        setDataProduct((prev) => ({
            ...prev,
            [name]: value,
        }));

    }, []);

    const handleSubmit = useCallback(

        async (e) => {

            e.preventDefault();

            setLoading(true);
            const formData = new FormData();
            formData.append("categorie_product", dataProduct?.categorie_product);
            formData.append("Currency_price", dataProduct?.Currency_price);
            formData.append("quantity_product", dataProduct?.quantity_product);
            formData.append("price_product", dataProduct?.price_product);
            formData.append("color_product", dataProduct?.color_product);
            formData.append("operation_product", dataProduct?.operation_product);
            formData.append("code_reference", dataProduct?.code_reference?.trim());
            formData.append("taille_product", dataProduct?.taille_product);
            formData.append("description_product", dataProduct?.description_product?.trim());

            if (imageFile) {
                formData.append("image_product", imageFile);
            }

            formData.append("name_product", dataProduct?.name_product);

            formData.append("fournisseur", parseInt(currentUserCompte?.user));

            try {

                setSelectedBtnUpdate(product?.id)

                await api.put(`produits/${product?.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                dispatch(setProductUpdate(dataProduct))

                setAlertMessage(t("addProductModify"));

                setIsOpen(false);

            } catch (error) {

                //console.error("Erreur lors de la modification du produit :", error);

                setAlertMessage("Erreur lors de la modification ❌");

            } finally {

                setLoading(false);

                setSelectedBtnUpdate(null)
            }
        },
        [dataProduct, imageFile, currentUserCompte?.user, product?.id, dispatch,t]
    );

    const handleClose = useCallback(() => {

        setIsOpen(false);

        setImageFile(null);

        setAlertMessage("");

    }, []);

    return (

        <div>

            <button

                onClick={() => setIsOpen(true)}

                className="p-1 bg-gradient-to-br from-purple-400 hover:bg-gradient-to-br hover:from-purple-400 text-white rounded-lg hover:bg-blue-700 text-xs"
            >
                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>

            </button>
          
            {
                isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 overflow-y-auto h-full pt-6">

                    <div className="flex flex-col gap-3 shadow-lg p-6 rounded-lg bg-white max-w-2xl w-full">

                        <h2 className="text-lg font-sm text-gray-800">{t('modifyProduct.title_modify_product')}</h2>


                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

                           <>

                                <input
                                    type="text"
                                    name="name_product"
                                    value={dataProduct?.name_product}
                                    onChange={onChangeClick}
                                    placeholder="Nom du produit"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                />

                                <select
                                    id="operation_product"
                                    name="operation_product"
                                    value={dataProduct?.operation_product}
                                    onChange={onChangeClick}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                    required
                                >
                                    <option value="">{t("add_product.select_operation")}</option>
                                    <option value="PRETER">{t("add_product.PRETER")}</option>
                                    <option value="VENDRE">{t("add_product.VENDRE")}</option>
                                    <option value="ECHANGER">{t("add_product.ECHANGER")}</option>
                                    <option value="LOCATION">{t("add_product.LOCATION")}</option>
                                </select>

                                <select
                                    id="Currency_price"
                                    name="Currency_price"
                                    value={dataProduct?.Currency_price}
                                    onChange={onChangeClick}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                >
                                    <option value="">{t("add_product.select_currency")}</option>
                                    <option value="EURO">{t("add_product.euro")}</option>
                                    <option value="DOLLAR">{t("add_product.dollar")}</option>
                                    <option value="FRANC">{t("add_product.franc")}</option>
                                </select>

                                <input
                                    type="number"
                                    name="price_product"
                                    value={dataProduct?.price_product}
                                    onChange={onChangeClick}
                                    placeholder="Prix"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                    min="0"
                                />

                                <input
                                    type="number"
                                    name="quantity_product"
                                    value={dataProduct?.quantity_product}
                                    onChange={onChangeClick}
                                    placeholder="Quantité"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                />

                                <textarea
                                    id="description_product"
                                    name="description_product"
                                    value={dataProduct?.description_product}
                                    onChange={onChangeClick}
                                    rows="4"
                                    className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 h-20 overflo-y-auto scrollbor_hidden"
                                    placeholder="Description du produit..."
                                    required
                                />

                                <FormElementFileUpload label="Choisissez une image" getFile={handleFileSelect} />

                            </>

                            <div className="relative col-span-2 flex justify-center mt-2">

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className=" items-center border rounded-full hover:bg-gray-100 bg-gradient-to-br from-pink-500 to-orange-400"
                                    title={t('modifyProduct.cancel_modify_product')}
                                 >
                                    <svg className="w-6 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18 17.94 6M18 18 6.06 6" />
                                    </svg>
                                </button>

                                {
                                    loading && (selectedBtnUpdate === dataProduct?.id)?
                                    (
                                        <LoadingCard />
                                    ) :
                                    (
                                        <button
                                           type="submit"  
                                           className="w-auto flex items-center m-auto cursor-pointer rounded-full border border-blue-100 bg-blue-0 px-5 py-2 text-base  text-white-900 transition bg-gradient-to-br from-purple-0 to-blue-100 hover:bg-gradient-to-br hover:from-purple-100 px-2 "
                                        >
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>

                                        </button>
                                    )
                                }

                            </div>

                        </form>

                        {
                            alertMessage && (

                                <p className="mt-2 text-green-600 font-medium">{alertMessage}</p>
                            )
                        }

                    </div>

                </div>
            )}
        </div>
    );
}


