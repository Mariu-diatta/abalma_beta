import React, { useCallback, useState } from "react";
import { setProductUpdate } from "../slices/cartSlice";
import FormElementFileUpload from "../features/FormFile";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import LoadingCard from "../components/LoardingSpin";
import api from "../services/Axios";
import { createPortal } from "react-dom";

function CenteredModal({ product, children }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ text: "", type: "success" });
    const [imageFile, setImageFile] = useState(null);

    const [dataProduct, setDataProduct] = useState({
        date_emprunt: product?.date_emprunt ?? "",
        date_fin_emprunt: product?.date_fin_emprunt ?? "",
        price_product: product?.price_product ?? "",
        Currency_price: product?.Currency_price ?? "",
        color_product: product?.color_product ?? "",
        categorie_product: product?.categorie_product ?? "",
        code_reference: product?.code_reference ?? "",
        operation_product: product?.operation_product ?? "",
        description_product: product?.description_product ?? "",
        fournisseur: product?.fournisseur ?? "",
        quantity_product: product?.quantity_product ?? "",
        name_product: product?.name_product ?? "",
        taille_product: product?.taille_product ?? "",
        image_product: product?.image_product ?? "",
        id: product?.id,
    });

    const currentUserCompte = useSelector((state) => state.auth.compteUser);

    // Réinitialise le formulaire aux valeurs d'origine
    const resetForm = useCallback(() => {
        setDataProduct({
            date_emprunt: product?.date_emprunt ?? "",
            date_fin_emprunt: product?.date_fin_emprunt ?? "",
            price_product: product?.price_product ?? "",
            Currency_price: product?.Currency_price ?? "",
            color_product: product?.color_product ?? "",
            categorie_product: product?.categorie_product ?? "",
            code_reference: product?.code_reference ?? "",
            operation_product: product?.operation_product ?? "",
            description_product: product?.description_product ?? "",
            fournisseur: product?.fournisseur ?? "",
            quantity_product: product?.quantity_product ?? "",
            name_product: product?.name_product ?? "",
            taille_product: product?.taille_product ?? "",
            image_product: product?.image_product ?? "",
            id: product?.id,
        });
        setImageFile(null);
        setAlertMessage({ text: "", type: "success" });
    }, [product]);

    const handleFileSelect = useCallback((file) => setImageFile(file), []);

    const onChangeClick = useCallback((e) => {
        const { name, value } = e.target;
        setDataProduct((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setLoading(true);
            setAlertMessage({ text: "", type: "success" });

            const formData = new FormData();
            const fields = [
                "categorie_product", "Currency_price", "quantity_product",
                "price_product", "color_product", "operation_product",
                "taille_product", "name_product",
            ];

            fields.forEach((field) => formData.append(field, dataProduct[field] ?? ""));
            formData.append("code_reference", dataProduct.code_reference?.trim() ?? "");
            formData.append("description_product", dataProduct.description_product?.trim() ?? "");
            formData.append("fournisseur", parseInt(currentUserCompte?.user));

            if (imageFile) formData.append("image_product", imageFile);

            try {
                const { data } = await api.put(`produits/${product?.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                // Met à jour Redux avec les données retournées par l'API
                dispatch(setProductUpdate({ ...dataProduct, ...data }));
                setAlertMessage({ text: t("addProductModify"), type: "success" });

                setTimeout(() => setIsOpen(false), 1500); // Ferme après confirmation visible

            } catch (error) {
                const msg = error?.response?.data?.detail || "Erreur lors de la modification ❌";
                setAlertMessage({ text: msg, type: "error" });
            } finally {
                setLoading(false);
            }
        },
        [dataProduct, imageFile, currentUserCompte?.user, product?.id, dispatch, t]
    );

    const handleOpen = useCallback(() => {
        resetForm();
        setIsOpen(true);
    }, [resetForm]);

    const handleClose = useCallback(() => {
        if (loading) return; // Empêche la fermeture pendant l'envoi
        setIsOpen(false);
        resetForm();
    }, [loading, resetForm]);

    // Fermeture en cliquant sur le fond
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) handleClose();
    }, [handleClose]);

    const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-300 transition";

    return (
        <div>
            <button
                onClick={handleOpen}
                title={t("modifyProduct.title_modify_product")}
                className="p-1 bg-gradient-to-br from-purple-100 hover:from-purple-400 text-white rounded-lg text-xs transition"
            >
                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                </svg>
            </button>

            {isOpen && createPortal(
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 overflow-y-auto py-6"
                    onClick={handleBackdropClick}
                >
                    <div className="flex flex-col gap-3 shadow-lg p-6 rounded-lg bg-white max-w-2xl w-full mx-4">

                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {t("modifyProduct.title_modify_product")}
                            </h2>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="rounded-full p-1 hover:bg-gray-100 transition disabled:opacity-50"
                                title={t("modifyProduct.cancel_modify_product")}
                            >
                                <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                        strokeWidth="1.5" d="M6 18 17.94 6M18 18 6.06 6" />
                                </svg>
                            </button>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">

                            <input
                                type="text"
                                name="name_product"
                                value={dataProduct.name_product}
                                onChange={onChangeClick}
                                placeholder="Nom du produit"
                                className={inputClass}
                                required
                            />

                            <select
                                name="operation_product"
                                value={dataProduct.operation_product}
                                onChange={onChangeClick}
                                className={inputClass}
                                required
                            >
                                <option value="">{t("add_product.select_operation")}</option>
                                <option value="PRETER">{t("add_product.PRETER")}</option>
                                <option value="VENDRE">{t("add_product.VENDRE")}</option>
                                <option value="ECHANGER">{t("add_product.ECHANGER")}</option>
                                <option value="LOCATION">{t("add_product.LOCATION")}</option>
                            </select>

                            <select
                                name="Currency_price"
                                value={dataProduct.Currency_price}
                                onChange={onChangeClick}
                                className={inputClass}
                            >
                                <option value="">{t("add_product.select_currency")}</option>
                                <option value="EURO">{t("add_product.euro")}</option>
                                <option value="DOLLAR">{t("add_product.dollar")}</option>
                                <option value="FRANC">{t("add_product.franc")}</option>
                            </select>

                            <input
                                type="number"
                                name="price_product"
                                value={dataProduct.price_product}
                                onChange={onChangeClick}
                                placeholder="Prix"
                                className={inputClass}
                                min="0"
                            />

                            <input
                                type="number"
                                name="quantity_product"
                                value={dataProduct.quantity_product}
                                onChange={onChangeClick}
                                placeholder="Quantité"
                                className={inputClass}
                                min="0"
                            />

                            <textarea
                                name="description_product"
                                value={dataProduct.description_product}
                                onChange={onChangeClick}
                                rows="3"
                                className={`col-span-2 ${inputClass} h-20 resize-none`}
                                placeholder="Description du produit..."
                                required
                            />

                            <div className="col-span-2">
                                <FormElementFileUpload
                                    label="Choisissez une image"
                                    getFile={handleFileSelect}
                                    getImage={() => { }}
                                />
                            </div>

                            {children}

                            {/* Bouton submit */}
                            <div className="col-span-2 flex justify-center mt-2">
                                {loading ? (
                                    <LoadingCard />
                                ) : (
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 rounded-full border border-blue-100 px-5 py-2 text-sm text-gray-800 bg-gradient-to-br from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="1.5" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                        </svg>
                                        {t("modifyProduct.title_modify_product")}
                                    </button>
                                )}
                            </div>

                        </form>

                        {/* Message de retour */}
                        {alertMessage.text && (
                            <p className={`mt-1 text-sm font-medium ${alertMessage.type === "success" ? "text-green-600" : "text-red-500"
                                }`}>
                                {alertMessage.text}
                            </p>
                        )}

                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default CenteredModal;