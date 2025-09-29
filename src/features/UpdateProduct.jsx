
import React, { useState } from 'react';
import FormElementFileUpload from './FormFile';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { setCurrentNav } from '../slices/navigateSlice';
import { addMessageNotif } from '../slices/chatSlice';
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';
import { ButtonSimple } from '../components/Button';
import TitleCompGen from '../components/TitleComponentGen';

const UpdateProduct = () => {

    const [imageFile, setImageFile] = useState(null);
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUserCompte = useSelector((state) => state.auth.compteUser);
    const user = useSelector((state) => state.auth.user);

    const [dataProduct, setDataProduct] = useState({
        date_emprunt: "",
        price_product: "",
        Currency_price: "",
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
        delivery:"",
        taille_product: "MEDIUM"
    });

    const handleFileSelect = (file) => setImageFile(file);

    const onChangeClick = (e) => {

        const { name, value } = e.target;

        setDataProduct(

            (prev) => (
                {
                    ...prev,
                    [name]: value,
                }
            )
        );
    };

    const isLoanOptionSelected = dataProduct.operation_product === "PRETER";

    const formatToISOString = (datetimeStr) => {

        if (!datetimeStr) return null;

        const date = new Date(datetimeStr);

        return isNaN(date.getTime()) ? null : date.toISOString();
    };

    /** Fonction pour gérer les notifications */
    const notify = (title, msg) => {

        showMessage(dispatch, { Type: title, Message: msg });
    };

    const submitForm = async (e) => {

        e.preventDefault();

        if (!currentUserCompte?.id) {

            notify("Erreur", "Pas de compte utilisateur associé.");

            return;
        }

        try {
            // ✅ Validation des champs requis
            const requiredFields = [
                'categorie_product',
                'operation_product',
                'code_reference',
                'description_product',
            ];

            for (let field of requiredFields) {

                if (!dataProduct[field]?.trim()) {

                    notify("Erreur", `Le champ "${field}" est requis.`);

                    return;
                }
            }

            // ✅ Validation image obligatoire
            if (!imageFile) {
                notify("Erreur", "L'image du produit est requise.");
                return;
            }

            // ✅ Validation des dates de prêt
            if (isLoanOptionSelected) {

                if (!dataProduct.date_emprunt || !dataProduct.date_fin_emprunt) {

                    notify("Erreur", "Les dates d'emprunt et de fin sont requises.");

                    return;
                }
            }

            setIsLoading(true)

            // ✅ Préparation des données à envoyer
            const formData = new FormData();
            formData.append("categorie_product", dataProduct.categorie_product);
            formData.append("Currency_price", dataProduct.Currency_price);
            formData.append("quantity_product", dataProduct.quantity_product);
            formData.append("price_product", dataProduct.price_product);
            formData.append("color_product", dataProduct.color_product);
            formData.append("operation_product", dataProduct.operation_product);
            formData.append("code_reference", dataProduct.code_reference.trim());
            formData.append("taille_product", dataProduct.taille_product);
            formData.append("description_product", dataProduct.description_product.trim());
            formData.append("image_product", imageFile);
            formData.append("paymentMethod", dataProduct.paymentMethod);
            formData.append("adress", dataProduct.adress);
            formData.append("delivery", dataProduct.delivery);
            formData.append("name_product", dataProduct.name_product);
            formData.append("fournisseur", parseInt(currentUserCompte.user));

            if (isLoanOptionSelected) {

                formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));

                formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
            }

            // ✅ Envoi à l'API
            await api.post("/produits/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            notify("Message", "Produit créé avec succès !");

            dispatch(addMessageNotif(`Produit ${dataProduct?.code_reference} créé le ${new Date().toLocaleString()}`));

            // Reset formulaire
            handleFileSelect(null);

            setDataProduct({
                date_emprunt: "",
                taille_product: "MEDIUM",
                price_product: "",
                Currency_price: "",
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
                delivery:""
            });

            setIsProductAdded(true)

        } catch (error) {

            notify("Erreur", error?.message || error?.request?.response || "Erreur inconnue lors de la création du produit.");

            if (error.response?.data) {

                const errors = error.response.data;

                const messages = Object.entries(errors)

                .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)

                .join('\n');

                notify("Erreur", `Erreur lors de la création du produit :\n${messages}`);
            }

        } finally {

            setIsLoading(false);
        }
    };

    return (

        <div

            className="bg-white dark:bg-gray-900 rounded-md flex flex-col justify-center items-center  w-full"

            style={
                {
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }
            }
        >
            <span className="font-extrabold text-gray-500 dark:text-gray-400 text-2xl ">

                <TitleCompGen title={t('add_product.add_or_update_product')} />

            </span>

            {/* ✅ Message d’alerte toujours visible s’il existe */}
            <div className="mb-4">
                <AttentionAlertMesage />
            </div>

            {
                isProductAdded ?
                (
                    <div
                        className="absolute flex flex-col gap-3 
                                    left-1/2 top-1/2 
                                    -translate-x-1/2 -translate-y-1/2
                                    shadow-lg p-2 rounded-lg bg-white"
                    >

                        <button
                            onClick={() => setIsProductAdded(false)}
                            className="border p-1 rounded-md"
                        >
                            {t('add_new_product')}

                        </button>

                    </div>
                )
                :
                (
                    <div className="shadow-lg max-w-2xl px-2 py-1 lg:py-2" >

                        <form
                            onSubmit={submitForm}
                            className={
                                `${((user?.is_fournisseur && user?.is_verified)) ?
                                    "w-100  md:w-auto"
                                    :
                                    "opacity-50 pointer-events-none cursor-not-allowed"
                                }`}
                        >
                            {/* 🔽 Ici on garde tous tes champs de formulaire (inchangés) */}
                            {/* ... ton grand bloc avec les inputs/select/textarea ... */}
                                <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-2 sm:mb-5">

                                    <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                        {t('add_product.informations')}
                                    </h2>

                                    <div className="w-full">

                                        <label htmlFor="name_product" className="block mb-2 text-sm font-medium ">{t('add_product.name_product')}</label>

                                        <input
                                            type="text"
                                            id="name_product"
                                            name="name_product"
                                            value={dataProduct?.name_product}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            placeholder="Nom du produit"
                                        />

                                    </div>

                                    <div className="w-full">

                                        <div>

                                            <label htmlFor="color_product" className="block mb-2 text-sm font-medium "> {t('add_product.product_color')}</label>

                                            <input
                                                type="text"
                                                name="color_product"
                                                id="color_product"
                                                value={dataProduct.color_product}
                                                onChange={onChangeClick}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="Jaune"

                                            />

                                        </div>
                                    </div>

                                    <div className="w-full">

                                        <label htmlFor="code_reference" className="block mb-2 text-sm font-medium ">

                                            {t('add_product.code_reference')}

                                            <span className="text-red-500">*</span>

                                        </label>

                                        <input
                                            type="text"
                                            name="code_reference"
                                            id="code_reference"
                                            value={dataProduct.code_reference}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            placeholder="Ex: ABC-123"
                                            required
                                        />

                                    </div>

                                    <div className="w-full">

                                        <label htmlFor="categorie_product" className="block mb-2 text-sm font-medium ">

                                            {t('add_product.product_category')}

                                            <span className="text-red-500">*</span>

                                        </label>

                                        <select
                                            id="categorie_product"
                                            name="categorie_product"
                                            value={dataProduct.categorie_product}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            required
                                        >
                                            <option value="">{t('add_product.select_category')}</option>
                                            <option value="JOUET">{t('add_product.categories.JOUET')}</option>
                                            <option value="HABITS">{t('add_product.categories.HABITS')}</option>
                                            <option value="MATERIELS_INFORMATIQUES">{t('add_product.categories.MATERIELS_INFORMATIQUES')}</option>
                                            <option value="CAHIERS">{t('add_product.categories.CAHIERS')}</option>
                                            <option value="SACS">{t('add_product.categories.SACS')}</option>
                                            <option value="LIVRES">{t('add_product.categories.LIVRES')} </option>
                                            <option value="ELECTROMENAGER">{t('add_product.categories.ELECTROMENAGER')}</option>
                                            <option value="TELEPHONIE">{t('add_product.categories.TELEPHONIE')}</option>
                                            <option value="ACCESSOIRES">{t('add_product.categories.ACCESSOIRES')}</option>
                                            <option value="SPORT">{t('add_product.categories.SPORT')}</option>
                                            <option value="JEUX_VIDEO">{t('add_product.categories.JEUX_VIDEO')}</option>
                                            <option value="MEUBLES">{t('add_product.categories.MEUBLES')}</option>
                                            <option value="VEHICULES">{t('add_product.categories.VEHICULES')}</option>
                                            <option value="FOURNITURES_SCOLAIRES">{t('add_product.categories.FOURNITURES_SCOLAIRES')}</option>
                                            <option value="DIVERS">{t('add_product.categories.DIVERS')}</option>
                                            <option value="HB">{t('add_product.categories.HB')}</option>
                                        </select>

                                    </div>

                                    <div className="h-[0.5px] bg-gray-300 sm:col-span-2" />

                                    <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                        {t('add_product.paimement_infos')}
                                    </h2>

                                    <div className="w-full">

                                        <label htmlFor="Currency_price" className="block mb-2 text-sm font-medium ">{t('add_product.default_currency_label')}</label>

                                        <select
                                            id="Currency_price"
                                            name="Currency_price"
                                            value={dataProduct?.Currency_price}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        >
                                            <option value="">{t('add_product.select_currency')}</option>
                                            <option value="EURO">{t('add_product.euro')}</option>
                                            <option value="DOLLAR">{t('add_product.dollar')}</option>
                                            <option value="FRANC">{t('add_product.franc')}</option>

                                        </select>
                                    </div>

                                    <div className="w-full">

                                        <label htmlFor="operation_product" className="block mb-2 text-sm font-medium">

                                            {t('add_product.operation_type')}

                                            <span className="text-red-500">*</span>

                                        </label>

                                        <select
                                            id="operation_product"
                                            name="operation_product"
                                            value={dataProduct.operation_product}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            required
                                        >
                                            <option value="">

                                                {t('add_product.select_operation')}

                                            </option>

                                            <option value="PRETER">{t('add_product.PRETER')}</option>
                                            <option value="VENDRE">{t('add_product.VENDRE')}</option>
                                            <option value="ECHANGER">{t('add_product.ECHANGER')}</option>
                                            <option value="LOCATION">{t('add_product.LOCATION')}</option>

                                        </select>

                                    </div>

                                    {isLoanOptionSelected && (
                                        <>
                                            <div>

                                                <label htmlFor="date_emprunt" className="block mb-2 text-sm font-medium ">

                                                    {t('add_product.loan_start_date')}

                                                </label>

                                                <input
                                                    type="datetime-local"
                                                    id="date_emprunt"
                                                    name="date_emprunt"
                                                    value={dataProduct.date_emprunt}
                                                    onChange={onChangeClick}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                />

                                            </div>

                                            <div>

                                                <label htmlFor="date_fin_emprunt" className="block mb-2 text-sm font-medium ">

                                                    {t('add_product.loan_end_date')}

                                                </label>

                                                <input
                                                    type="datetime-local"
                                                    id="date_fin_emprunt"
                                                    name="date_fin_emprunt"
                                                    value={dataProduct?.date_fin_emprunt}
                                                    onChange={onChangeClick}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                />

                                            </div>
                                        </>
                                    )}

                                    <div className="w-full hidden">

                                        <label htmlFor="fournisseur" className="block mb-2 text-sm font-medium ">{t('add_product.supplier')}</label>

                                        <input
                                            type="text"
                                            id="fournisseur"
                                            name="fournisseur"
                                            value={dataProduct?.fournisseur}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            placeholder="Nom du fournisseur"
                                        />
                                    </div>

                                    <div className="w-full">

                                        <div>

                                            <label htmlFor="price_product" className="block mb-2 text-sm font-medium ">

                                                {t('add_product.product_price')}

                                                <span className="text-red-500">*</span>

                                            </label>

                                            <input
                                                type="text"
                                                name="price_product"
                                                id="price_product"
                                                value={dataProduct?.price_product}
                                                onChange={onChangeClick}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                                placeholder="120$"
                                                required
                                            />

                                        </div>

                                    </div>

                                    <div className="w-full">

                                        <label htmlFor="paymentMethod" className="block mb-2 text-sm font-medium ">{t('paymentMethod')}</label>

                                        <select
                                            type="text"
                                            id="paymentMethod"
                                            name="paymentMethod"
                                            value={dataProduct?.paymentMethod}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            placeholder="paymentMethod"
                                        >
                                            <option value="">{t('add_product.payement_methode')}</option>
                                            <option value="CASH">{t('Cash')}</option>
                                            <option value="CARD">{t('Card')}</option>
                                        </select>

                                    </div>

                                    <div className="h-[0.5px] bg-gray-300 sm:col-span-2" />

                                    <h2 className="text-lg font-extrabold text-gray-500 dark:text-white pt-4 pb-1 mb-1 sm:col-span-2">
                                        {t('add_product.informations_livraison')}
                                    </h2>

                                    <div className="w-full">

                                        <label htmlFor="delivery" className="block mb-2 text-sm font-medium ">{t('delivery')}</label>

                                        <select
                                            id="delivery"
                                            name="delivery"
                                            value={dataProduct?.delivery}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            required
                                        >

                                            <option value="FREE">{t('add_product.FREE')}</option>
                                            <option value="DELPAID">{t('add_product.DELPAID')}</option>

                                        </select>

                                    </div>

                                    {/* Taille produit */}
                                    <div>

                                        <label htmlFor="taille_product" className="block mb-2 text-sm font-medium ">
                                            {t('add_product.product_size')}
                                        </label>

                                        <select
                                            id="taille_product"
                                            name="taille_product"
                                            value={dataProduct?.taille_product}
                                            onChange={onChangeClick}
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                                        >
                                            <option value="">
                                                {t('add_product.select_size')}
                                            </option>

                                            <option value="SMALL">{t('add_product.SMALL')}</option>
                                            <option value="MEDIUM">{t('add_product.MEDIUM')}</option>
                                            <option value="BIG">{t('add_product.BIG')}</option>

                                        </select>

                                    </div>

                                    {/* Quantité */}
                                    <div>
                                        <label htmlFor="quantity_product" className="block mb-2 text-sm font-medium ">
                                            {t('add_product.quantity')}
                                        </label>

                                        <input
                                            type="number"
                                            id="quantity_product"
                                            name="quantity_product"
                                            value={dataProduct?.quantity_product}
                                            onChange={onChangeClick}
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                                            placeholder="Quantité"
                                            min="1"
                                        />
                                    </div>

                                    <div className="">

                                        {/*<label htmlFor="image_product" className="block mb-2 text-sm font-medium ">*/}
                                        {/*    {t('add_product.product_image')}*/}
                                        {/*    <span className="text-red-500">*</span>*/}
                                        {/*</label>*/}

                                        <FormElementFileUpload

                                            label={t("add_product.ChooseImage")}

                                            getFile={handleFileSelect}
                                        />

                                    </div>

                                    <div className="sm:col-span-2">

                                        <label htmlFor="adress" className="block mb-2 text-sm font-medium ">{t('adress')}</label>

                                        <input
                                            type="text"
                                            id="adress"
                                            name="adress"
                                            value={dataProduct?.adress}
                                            onChange={onChangeClick}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                            placeholder={t('adress')}
                                        />

                                    </div>

                                    <div className="sm:col-span-2">

                                        <label htmlFor="description_product" className="block mb-2 text-sm font-medium ">
                                            {t('add_product.product_description')}
                                            <span className="text-red-500">*</span>
                                        </label>

                                        <textarea
                                            id="description_product"
                                            name="description_product"
                                            value={dataProduct?.description_product}
                                            onChange={onChangeClick}
                                            rows="6"
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg "
                                            placeholder="Description du produit..."
                                            required
                                        />

                                    </div>

                                </div>

                            <div className="flex items-center space-x-4 mt-6">

                               { 
                                    isLoading?
                                    <LoadingCard/>
                                    :
                                    <>
                                        {
                                            <div className="flex gap-3 justify-center items-center m-auto my-2">
                                                <ButtonSimple
                                                    title={"Valider"}
                                                />
                                            </div>
                                        }
                                    </>
                                }

                            </div>

                        </form>

                        {
                            !(user?.is_fournisseur && user?.is_verified) && (

                                <ButtonSimple
                                    onHandleClick={() => {
                                        dispatch(setCurrentNav("user_profil"));
                                        navigate("/user_profil");
                                    }}
                                    title={t('add_product.switch_to_supplier')}
                                    type="button"
                                />
                            )
                        }

                    </div>
                )
            }

        </div>
    );
};

export default UpdateProduct;
