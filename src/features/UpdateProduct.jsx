import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import AttentionAlertMesage, { showMessage } from "../components/AlertMessage";
//import { setCurrentNav } from "../slices/navigateSlice";
import { addMessageNotif } from "../slices/chatSlice";
import LoadingCard from "../components/LoardingSpin";
import { ButtonSimple } from "../components/Button";
import TitleCompGen from "../components/TitleComponentGen";
import FormElementFileUpload from "./FormFile";
//import { ENDPOINTS } from "../utils";
import InputBox from "../components/InputBoxFloat";
import { LIST_CATEGORIES } from "../utils";


const AddUploadProduct = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const bottomRef = useRef(null);

    const user = useSelector((state) => state.auth.user);
    const currentUserCompte = useSelector((state) => state.auth.compteUser);

    const [imageFile, setImageFile] = useState(null);
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    const [currentSection, setCurrentSection] = useState(1);
    var initDataProduct = {
        date_emprunt: "",
        price_product: "",
        currency_price: "",
        color_product: "",
        date_fin_emprunt: "",
        categorie_product: "",
        code_reference: "",
        operation_product: "",
        image_product: null,
        description_product: "",
        fournisseur: "",
        quantity_product: 1,
        name_product: "",
        paymentMethod: "",
        adress: "",
        delivery: "",
        taille_product: "MEDIUM",
        Currency_price: "",
        type_choice: "DURABLE",
        promotion: false,
        shipping_price: 0,
        is_available: true,
        is_active: true,
        is_verified: false,
        commission_percentage: 10,
    }
    const [dataProduct, setDataProduct] = useState(initDataProduct); 
    const [imageLoaded, setImageLoaded] = useState(null); 

    function getImage(image) {

        setImageLoaded(image)
    }


    const handleFileSelect = (file) => setImageFile(file);

    const onChangeClick = (e) => {
        const { name, value } = e.target;
        setDataProduct((prev) => ({ ...prev, [name]: value }));
    };

    const isLoanOptionSelected = dataProduct.operation_product === "PRETER";

    const formatToISOString = (datetimeStr) => {
        if (!datetimeStr) return null;
        const date = new Date(datetimeStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
    };

    const notify = (title, msg) => showMessage(dispatch, { Type: title, Message: msg });

    const nextSection = () => {
        setCurrentSection((prev) => prev + 1);
        // scroll vers le début de la section
        requestAnimationFrame(() => {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        });
    };

    const saveDataForSubmitForm = (e) => {

        e.preventDefault();

        if (!currentUserCompte?.id) {
            notify("Erreur", "Pas de compte utilisateur associé.");
            return;
        }

        setIsLoading(true);

        try {
            const requiredFields = ["categorie_product", "operation_product", "code_reference", "description_product", "adress"];
            for (let field of requiredFields) {
                if (!dataProduct[field]?.trim()) {
                    notify("Erreur", `Le champ "${field}" est requis.`);
                    return;
                }
            }

            if (!imageFile) {
                notify("Erreur", "L'image du produit est requise.");
                return;
            }

            if (isLoanOptionSelected && (!dataProduct.date_emprunt || !dataProduct.date_fin_emprunt)) {
                notify("Erreur", "Les dates d'emprunt et de fin sont requises.");
                return;
            }

            setIsProductAdded(true);

        } catch (error) {
            //console.log("Erreur", error)
            notify("Erreur", "Erreur inconnue lors de la création du produit.");

        } finally {
            setIsLoading(false);
        }

    }

    const submitForm = async (e) => {
        e.preventDefault();

        if (!currentUserCompte?.id) {
            notify("Erreur", "Pas de compte utilisateur associé.");
            return;
        }

        try {
            const requiredFields = ["categorie_product", "operation_product", "code_reference", "description_product", "adress"];
            for (let field of requiredFields) {
                if (!dataProduct[field]?.trim()) {
                    notify("Erreur", `Le champ "${field}" est requis.`);
                    return;
                }
            }

            if (!imageFile) {
                notify("Erreur", "L'image du produit est requise.");
                return;
            }

            if (isLoanOptionSelected && (!dataProduct.date_emprunt || !dataProduct.date_fin_emprunt)) {
                notify("Erreur", "Les dates d'emprunt et de fin sont requises.");
                return;
            }

            setIsLoadingSubmit(true);

            const formData = new FormData();
            Object.entries(dataProduct).forEach(([key, value]) => {
                if (value !== null) formData.append(key, value);
            });
            formData.append("image_product", imageFile);
            formData.append("fournisseur", parseInt(currentUserCompte.user));
            formData.append("type_choice", dataProduct.type_choice);
            formData.append("shipping_price", dataProduct.shipping_price);
            formData.append("promotion", dataProduct.promotion);
            formData.append("is_available", dataProduct.is_available);
            formData.append("is_active", dataProduct.is_active);
            formData.append("is_verified", dataProduct.is_verified);
            formData.append("commission_percentage", dataProduct.commission_percentage);
            if (isLoanOptionSelected) {
                formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));
                formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
            }

            await api.post("/produits/", formData, { headers: { "Content-Type": "multipart/form-data" } });

            notify("Message", "Produit créé avec succès !");
            dispatch(addMessageNotif(`Produit ${dataProduct?.code_reference} créé le ${new Date().toLocaleString()}`));
            setDataProduct(initDataProduct);
            setImageFile(null);
            setCurrentSection(1);
            setIsProductAdded(false);

        } catch (error) {
            //console.log("Erreur", error)
            notify("Erreur", error?.response?.data?.code_reference || error?.Message ||"Erreur inconnue lors de la création du produit.");

        } finally {
            setIsLoadingSubmit(false);
            setIsProductAdded(false);
        }
    };

    return (
        <div className="rounded-md flex flex-col justify-center items-center pb-[10dvh] overflow-x-hidden">

            <span className={`${isProductAdded && "hidden"}`}>
                <TitleCompGen title={t("add_product.add_or_update_product")} />
            </span>

            <span className={`text-gray-500 dark:text-gray-400 text-2xl z-10 ${!isProductAdded && "hidden"}`}>
                <TitleCompGen title={t("product_summary")} />
            </span>

            <div className="mb-4">
                <AttentionAlertMesage />
            </div>

            {isProductAdded ? (
                <ProductSummary
                    isLoadingSubmit={isLoadingSubmit}
                    product={dataProduct}
                    t={t}
                    onEdit={() => {
                        setCurrentSection(5)
                        setDataProduct({ ...dataProduct});
                        setIsProductAdded(false);

                    }}
                    onDelete={() => {
                        setDataProduct({ ...initDataProduct});
                        setIsProductAdded(false);
                        setCurrentSection(1)
                    }}
                    onAddNew={(e) => {
                        submitForm(e);
                    }}
                >
                    <img
                        src={imageLoaded}
                        alt="pt"
                        className="w-48 h-48 object-cover rounded-md shadow"
                    />

                </ProductSummary>
            ) : (
                <div className="py-1 lg:py-2 w-full md:w-1/2 lg:w-1/2 px-4 shadow-lg rounded-lg">

                    <form
                        onSubmit={saveDataForSubmitForm}
                        className={`${user?.is_fournisseur && user?.is_verified ? "w-full md:w-auto" : "opacity-50 pointer-events-none cursor-not-allowed"}`}
                    >
                        {/* Sections du formulaire */}
                        {currentSection >= 1 && (
                            <div>

                                <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.informations")}
                                </h2>

                                <InputBox
                                    type="text"
                                    id="name_product"
                                    name="name_product"
                                    value={dataProduct?.name_product}
                                    onChange={onChangeClick}
                                    placeholder="Nom du produit"
                                    required
                                />

                                <InputBox
                                    type="text"
                                    id="color_product"
                                    name="color_product"
                                    value={dataProduct?.color_product}
                                    onChange={onChangeClick}
                                    placeholder="Jaune"
                                />
                                <InputBox
                                    type="text"
                                    id="code_reference"
                                    name="code_reference"
                                    value={dataProduct?.code_reference}
                                    onChange={onChangeClick}
                                    placeholder="Ex: ABC-123"
                                    required
                                />
                                <InputBox
                                    type="text"
                                    id="price_product"
                                    name="price_product"
                                    value={dataProduct?.price_product}
                                    onChange={onChangeClick}
                                    placeholder={t("price")}
                                    required
                                />
                                <select
                                    id="taille_product"
                                    name="taille_product"
                                    value={dataProduct?.taille_product}
                                    onChange={onChangeClick}
                                    className="border-0 border-gray-300 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                >
                                    <option value="">{t("add_product.select_size")}</option>
                                    <option value="SMALL">{t("add_product.SMALL")}</option>
                                    <option value="MEDIUM">{t("add_product.MEDIUM")}</option>
                                    <option value="BIG">{t("add_product.BIG")}</option>
                                    <option value="L">{t("L")}</option>

                                    <option value="XL">{t("XL")}</option>

                                    <option value="M">{t("M")}</option>

                                    <option value="SM">{t("SM")}</option>

                                </select>
                                    <button type="button" onClick={nextSection} className={` ${currentSection>=2?"hidden":""}  px-4 py-2 bg-blue-600 text-white rounded-lg mt-4`}>
                                    {t("next")}
                                </button>
                            </div>
                        )}

                        {currentSection >= 2 && (
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.details")}
                                </h2>

                                <select
                                    id="categorie_product"
                                    name="categorie_product"
                                    value={dataProduct?.categorie_product}
                                    onChange={onChangeClick}
                                    className="my-4 border-0 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                    required
                                >
                                        <option value="">{t("add_product.select_category")}</option>
                                        {
                                            LIST_CATEGORIES?.map(

                                                (value, idx) => <option key={idx} value={`${value}`}>{t(`add_product.categories.${value}`)}</option>

                                            )
                                        }
                                </select>

                                    <FormElementFileUpload
                                        label={t("add_product.ChooseImage")}
                                        getFile={handleFileSelect}
                                        getImage={getImage}
                                    />

                                <textarea
                                    id="description_product"
                                    name="description_product"
                                    value={dataProduct?.description_product}
                                    onChange={onChangeClick}
                                    rows="6"
                                    className="my-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg"
                                    placeholder="Description du produit..."
                                    required
                                />
                                    <button type="button" onClick={nextSection} className={` ${currentSection >= 3 ? "hidden" : ""}  px-4 py-2 bg-blue-600 text-white rounded-lg mt-4`}>
                                    {t("next")}
                                </button>
                            </div>
                        )}

                        {currentSection >= 3 && (
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.paimement_infos")}
                                </h2>
                                <select
                                    id="Currency_price"
                                    name="Currency_price"
                                    value={dataProduct?.Currency_price}
                                    onChange={onChangeClick}
                                    className="my-4 border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                >
                                    <option value="">{t("add_product.select_currency")}</option>
                                    <option value="EURO">{t("add_product.euro")}</option>
                                    <option value="DOLLAR">{t("add_product.dollar")}</option>
                                    <option value="FRANC">{t("add_product.franc")}</option>
                                </select>
                                <select
                                    id="operation_product"
                                    name="operation_product"
                                    value={dataProduct.operation_product}
                                    onChange={onChangeClick}
                                        className="my-4 bg-gray-50 border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                    required
                                >
                                    <option value="">{t("add_product.select_operation")}</option>
                                    <option value="PRETER">{t("add_product.PRETER")}</option>
                                    <option value="VENDRE">{t("add_product.VENDRE")}</option>
                                </select>
                                {isLoanOptionSelected && (
                                    <>
                                        <InputBox type="datetime-local" id="date_emprunt" name="date_emprunt" value={dataProduct.date_emprunt} onChange={onChangeClick} />
                                        <InputBox type="datetime-local" id="date_fin_emprunt" name="date_fin_emprunt" value={dataProduct.date_fin_emprunt} onChange={onChangeClick} />
                                    </>
                                )}
                                    <button type="button" onClick={nextSection} className={` ${currentSection >= 4 ? "hidden" : ""}  px-4 py-2 bg-blue-600 text-white rounded-lg mt-4`}>
                                    {t("next")}
                                    </button>
                            </div>
                        )}

                        {currentSection >= 4 && (
                            <div>

                                <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.informations_livraison")}
                                </h2>

                                <select
                                    id="delivery"
                                    name="delivery"
                                    value={dataProduct?.delivery}
                                    onChange={onChangeClick}
                                    className="border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                    required
                                >
                                    <option value="FREE">{t("add_product.FREE")}</option>
                                    <option value="DELPAID">{t("add_product.DELPAID")}</option>
                                </select>

                                <InputBox
                                    type="text"
                                    id="adress"
                                    name="adress"
                                    value={dataProduct?.adress}
                                    onChange={onChangeClick}
                                    placeholder={t("adress")}
                                    required
                                />

                                <InputBox type="number" name="shipping_price" value={dataProduct.shipping_price} onChange={onChangeClick} placeholder="Prix de livraison 0.0" />

                                 <InputBox placeholder={t("add_product.quantity")} type="number" id="quantity_product" name="quantity_product" value={dataProduct?.quantity_product} onChange={onChangeClick} min="1" />
                                
                                <div className="flex gap-3 justify-center items-center m-auto my-2">
                                    {isLoading ? <LoadingCard /> : <ButtonSimple title={t("save")} />}
                                </div>

                            </div>
                        )}

                        <div ref={bottomRef} />

                    </form>
                </div>
            )}
        </div>
    );
};

export default AddUploadProduct;


const ProductField = ({ label, value, isLong }) => (

    <div className="grid grid-cols-[150px_1fr] gap-7 items-start bg-gray-50 p-2">
        <span className="font-medium text-[16px] ">{label.slice(0, 1).toUpperCase()}{label.slice(1,)}</span>
        <span className={isLong ? "max-h-32 overflow-y-auto justify-start " : " text-green"}>{value}</span>
    </div>
);

const ProductSummary = ({
    product,
    onEdit,
    onDelete,
    onAddNew,
    t,
    isLoadingSubmit,
    children
}) => {

    if (!product) return null;

    return (

        <div
            className="flex flex-col gap-4  p-6 rounded-lg w-full max-w-2xl m-auto bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >

            {/* INFORMATIONS DU PRODUIT */}
            <div className="flex flex-col gap-2 text-sm">
                <ProductField label={t("name")} value={product.name_product} />
                <ProductField
                    label={t("price")}
                    value={`${product.price_product} ${product.Currency_price}`}
                />
                <ProductField label={t("size")} value={product.taille_product} />
                <ProductField label={t("color")} value={product.color_product} />
                <ProductField label={t("quantity")} value={product.quantity_product} />
                <ProductField label={t("description")} value={product.description_product} isLong />

                <ProductField
                    label={t("delivery")}
                    value={`${product.delivery || ""} ${product.adress || ""}`}
                />

                <ProductField label={t("shipping_price")} value={`${product.shipping_price}`} />

                <ProductField label={t("adress")} value={`${product.adress}`} />

                <ProductField label={t("operation")} value={product.operation_product} />

                {product.type_choice && (
                    <ProductField label={t("type_choice")} value={product.type_choice} />
                )}

                <ProductField label={t("availability")} value={product.is_available ? t("yes") : t("no")} />
                <ProductField label={t("promotion")} value={product.promotion ? t("yes") : t("no")} />
                <ProductField label={t("active")} value={product.is_active ? t("yes") : t("no")} />
                <ProductField label={t("verified")} value={product.is_verified ? t("yes") : t("no")} />

                {
                    children
                }

            </div>

            {/* ACTIONS */}
            <div className="flex justify-start mt-4 gap-2">

                <button
                    onClick={onEdit}
                    className="bg-yellow-100 hover:bg-yellow-200 text-white px-3 py-1 rounded-full transition-colors"
                >
                    {t("edit")}
                </button>

                <button
                    onClick={onDelete}
                    className="bg-red-100 hover:bg-red-200 text-white px-3 py-1 rounded-full transition-colors"
                >
                    {t("delete")}

                </button>

                {
                    isLoadingSubmit ?
                    <LoadingCard /> 
                    :
                    <button
                        onClick={onAddNew}
                        className="bg-green-100 hover:bg-green-200 text-white px-3 py-1 rounded-full transition-colors"
                    >
                        {t("submit")}

                    </button>
                }

            </div>

        </div>
    );
};
