import React, { useCallback, useEffect, useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import api from "../services/Axios";
import FormElementFileUpload from "../features/FormFile";
import { setProductUpdate } from "../slices/cartSlice";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import LoadingCard from "../components/LoardingSpin";
import { ButtonSimple } from "../components/Button";

const MyProductList = () => {

    const { t } = useTranslation();

    const getUpdateProduct = useSelector((state) => state.cart.productUpdate);
    const currentUser = useSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedBtnProduct, setSelectedBtnProduct] = useState(null);

    /** 🟢 Mise à jour locale du produit modifié */
    useEffect(() => {

        if (!getUpdateProduct?.id) return;

        setProducts((prevProducts) =>

            prevProducts.map((prod) =>

                prod?.code_reference === getUpdateProduct?.code_reference

                    ? getUpdateProduct

                    : prod
            )
        );

    }, [getUpdateProduct]);

    /** 🟢 Charger les produits de l’utilisateur */
    useEffect(() => {

        if (!currentUser?.id) return;

        const fetchProducts = async () => {

            setLoading(true);

            try {

                const productsOwner = await api.get("owner/product");

                setProducts(productsOwner?.data);

            } catch (error) {

                //console.error("Erreur lors du chargement des produits:", error);

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, [currentUser]);

    /** 🟢 Supprimer un produit */
    const handleDelete = async (id) => {

        if (!window.confirm(t("modifyProduct.confirmDeleteProduct"))) return;

        setLoadingDelete(true);

        setSelectedBtnProduct(id)

        try {

            await api.delete(`produits/${id}/`);

            setProducts((prev) => prev.filter((p) => p.id !== id)); // Mise à jour locale

        } catch (error) {

            console.error("Erreur de suppression:", error);

        } finally {

            setLoadingDelete(false);

            setSelectedBtnProduct(null)
        }
    };

    return (

        <div

            className="style_bg mb-2 relative overflow-x-auto sm:rounded-md p-2"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)",
            }}
        >
            <nav className="flex flex-row items-center gap-2">

                <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z"
                    />
                </svg>

                <h2 className="ms-2 font-extrabold text-gray-500 dark:text-gray-400">
                    {t("myProducts")}
                </h2>

            </nav>

            {
                loading ? (
                    <LoadingCard/>
                )
                :
                (
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-sm p-2">
                    
                        <thead className="text-sm style_bg">
                        
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
                                Array.isArray(products) &&

                                products?.map((prod,_) => (

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

                                        <td className="px-6 py-1 ">
                                            <div className="overflow-y-auto h-[12dvh] scrollbor_hidden text-sm">
                                                {prod?.description_product?.slice(0, 6)}...
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {prod?.categorie_product}
                                        </td>

                                        <td className="px-6 py-4">
                                            {prod?.quantity_product}
                                        </td>

                                        <td className="px-6 py-4">
                                            <RendrePrixProduitMonnaie item={prod} />
                                        </td>

                                        <td className="px-6 py-4 gap-2">
                                            <CenteredModal product={prod} />
                                        </td>

                                        <td className="px-6 py-4 gap-2">

                                            {
                                                loadingDelete && (selectedBtnProduct === prod?.id) ?
                                                <LoadingCard/>
                                                :
                                                <ButtonSimple

                                                    onHandleClick={() => handleDelete(prod?.id)}

                                                    className="px-3 rounded-md hover:bg-gray-100 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-br hover:to-orange-500"

                                                    title={t("delete")}
                                                />
                                            }

                                        </td>

                                    </tr>
                                ))}
                        </tbody>
                </table>
                )
            }

        </div>
    );
};

export default MyProductList;


export function CenteredModal({ product }) {

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

            <ButtonSimple

                onHandleClick={() => setIsOpen(true)}

                title={t('modifyProduct.modify_product')}

                className="px-2 py-1 bg-gradient-to-br from-purple-400 hover:bg-gradient-to-br hover:from-purple-400 text-white rounded-lg hover:bg-blue-700 text-xs"
            />
          
            {
                isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 overflow-y-auto h-full pt-6">

                    <div className="flex flex-col gap-3 shadow-lg p-6 rounded-lg bg-white max-w-2xl w-full">

                        <h2 className="text-lg font-sm text-gray-800">{t('modifyProduct.title_modify_product')}</h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
                            
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

                            <div className="col-span-2 flex justify-between mt-2">

                                <ButtonSimple
                                    type="button"
                                    onHandleClick={handleClose}
                                    className="px-3  border rounded-md hover:bg-gray-100 bg-gradient-to-br from-pink-500 to-orange-400"
                                    title={t('modifyProduct.cancel_modify_product')}
                                />

                                {
                                    loading && (selectedBtnUpdate === dataProduct?.id)?
                                    (
                                        <LoadingCard />
                                    ) :
                                    (
                                        <ButtonSimple
                                            title={t('modifyProduct.modify_product')}
                                        />
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


