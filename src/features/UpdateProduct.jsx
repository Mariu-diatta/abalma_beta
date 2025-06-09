import React, { useState } from 'react';
import FormElementFileUpload from './FormFile';
import {  useDispatch, useSelector } from 'react-redux';
import api from '../services/Axios';
import AttentionAlertMesage, { showMessage } from '../components/AlertMessage';
import { setCurrentNav } from '../slices/navigateSlice';


const UpdateProduct = () => {

    const [imageFile, setImageFile] = useState(null);

    const handleFileSelect = (file) => {

        setImageFile(file);
    };

    const currentUserCompte = useSelector((state) => state.auth.compteUser)

    const messageAlert = useSelector((state) => state.navigate.messageAlert)

    const user = useSelector((state) => state.auth.user)

    const dispatch = useDispatch();

    const [dataProduct, setDataProduct] = useState({
        date_emprunt: "",
        date_fin_emprunt: "",
        categorie_product: "",
        code_reference: "",
        operation_product: "",
        image_product: imageFile,
        description_product: "",
        fournisseur: ""
    });

    const onChangeClick = (e) => {

        const { name, value } = e.target;

        setDataProduct((prev) => ({

            ...prev,

            [name]: value,
        }));
    };

    const isLoanOptionSelected = dataProduct.operation_product === "PRETER";

    const formatToISOString = (datetimeStr) => {

        if (!datetimeStr) return null; // évite l'erreur si vide

        const date = new Date(datetimeStr);

        if (isNaN(date.getTime())) return null; // évite l'erreur si invalide

        return date.toISOString();
    };


    const submitForm = async (e) => {

        e.preventDefault();

        if (!currentUserCompte?.id) alert("Pas de compte ");

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

                    showMessage(dispatch, `Le champ "${field}" est requis.`);

                    return;
                }
            }

            // ✅ Validation image obligatoire
            if (!imageFile) {

                showMessage(dispatch, "L'image du produit est requise.");

                return;
            }

            // ✅ Validation des dates de prêt
            if (isLoanOptionSelected) {

                if (!dataProduct.date_emprunt || !dataProduct.date_fin_emprunt) {

                    showMessage(dispatch, "Les dates d'emprunt et de fin sont requises.");

                    return;
                }
            }

            // ✅ Préparation des données à envoyer
            const formData = new FormData();
            formData.append("categorie_product", dataProduct.categorie_product);
            formData.append("operation_product", dataProduct.operation_product);
            formData.append("code_reference", dataProduct.code_reference.trim());
            formData.append("description_product", dataProduct.description_product.trim());
            formData.append("image_product", imageFile);

            // ✅ Ajout de l'ID du fournisseur lié à l'utilisateur
            formData.append("fournisseur", parseInt(currentUserCompte.user));

            if (isLoanOptionSelected) {
                formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));
                formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
            }

            // ✅ Envoi à l'API
            await api.post("/produits/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            showMessage(dispatch, "Produit créé avec succès !");
            // Optionnel : reset du formulaire

        } catch (error) {
            showMessage(dispatch, error);

            if (error.response && error.response.data) {
                const errors = error.response.data;
                const messages = Object.entries(errors)
                    .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
                    .join('\n');

                showMessage(dispatch, `Erreur lors de la création du produit :\n${messages}`);
            } else {
                showMessage(dispatch, "Erreur inconnue lors de la création du produit.");
            }
        }
    };




    return (
        <section className="bg-white dark:bg-gray-900">

            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">

                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Ajouter / Modifier un produit
                </h2>

                <form onSubmit={submitForm} className={` ${user.is_fournisseur ? "" : "opacity-50 pointer-events-none cursor-not-allowed"}`}>

                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">

                        <div className="sm:col-span-2">

                            <label htmlFor="code_reference" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code Référence</label>

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

                            <label htmlFor="categorie_product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie</label>

                            <select
                                id="categorie_product"
                                name="categorie_product"
                                value={dataProduct.categorie_product}
                                onChange={onChangeClick}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            >
                                <option value="">-- Choisir une catégorie --</option>
                                <option value="JOUET">Jouet</option>
                                <option value="HABITS">Habits</option>
                                <option value="MATERIELS_INFORMATIQUES">Matériels Informatiques</option>
                                <option value="CAHIERS">Cahiers</option>
                                <option value="SACS">Sacs</option>
                                <option value="LIVRES">Livres</option>
                                <option value="ELECTROMENAGER">Électroménager</option>
                                <option value="TELEPHONIE">Téléphonie</option>
                                <option value="ACCESSOIRES">Accessoires</option>
                                <option value="SPORT">Équipements de sport</option>
                                <option value="JEUX_VIDEO">Jeux vidéo</option>
                                <option value="MEUBLES">Meubles</option>
                                <option value="VEHICULES">Véhicules</option>
                                <option value="FOURNITURES_SCOLAIRES">Fournitures scolaires</option>
                                <option value="DIVERS">Autres / Divers</option>>
                                <option value="HB">Habits</option>
                            </select>
                        </div>

                        <div className="w-full">

                            <label htmlFor="operation_product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type d'opération</label>

                            <select
                                id="operation_product"
                                name="operation_product"
                                value={dataProduct.operation_product}
                                onChange={onChangeClick}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            >
                                <option value="">-- Choisir l'opération --</option>
                                <option value="PRETER">Prêter</option>
                                <option value="VENDRE">Vendre</option>
                                <option value="DONNER">Donner</option>
                                <option value="ECHANGER">Échanger</option>
                                <option value="LOCATION">Louer</option>
                                <option value="RESERVER">Réserver</option>
                            </select>

                        </div>

                        {isLoanOptionSelected && (
                            <>
                                <div>
                                    <label htmlFor="date_emprunt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Date de début d'emprunt
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
                                    <label htmlFor="date_fin_emprunt" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Date de fin d'emprunt
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="date_fin_emprunt"
                                        name="date_fin_emprunt"
                                        value={dataProduct.date_fin_emprunt}
                                        onChange={onChangeClick}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    />
                                </div>
                            </>
                        )}

                        <div className="sm:col-span-2 hidden">
                            <label htmlFor="fournisseur" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fournisseur</label>
                            <input
                                type="text"
                                id="fournisseur"
                                name="fournisseur"
                                value={dataProduct.fournisseur}
                                onChange={onChangeClick}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Nom du fournisseur"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="description_product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="description_product"
                                name="description_product"
                                value={dataProduct.description_product}
                                onChange={onChangeClick}
                                rows="6"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                placeholder="Description du produit..."
                            />
                        </div>

                        <div className="sm:col-span-2">

                            <label htmlFor="image_product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image du produit</label>

                            <FormElementFileUpload

                                label="Choisissez une image"

                                getFile={handleFileSelect}
                            />

                        </div>
                    </div>

                    {messageAlert && <AttentionAlertMesage title="Message" content={messageAlert} />}

                    <div className="flex items-center space-x-4">

                        <button

                            className={`cursor-pointer bg-blue-700 text-white rounded px-4 py-2`}
                        >
                            Enregistrer le produit

                        </button>

                    </div>

                </form>

                {
                    !(user.is_fournisseur) &&

                    <button

                        className={`bg-blue-700 text-white rounded px-4 py-2 mt-5`}

                        onClick={() => dispatch(setCurrentNav("profile")) }
                    >
                        Passer au compte fournisseur

                    </button>
                }


            </div>

        </section>
    );
};

export default UpdateProduct;
