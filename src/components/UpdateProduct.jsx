import React, { useState } from 'react';
import FormElementFileUpload from './FormFile';
import axios from "axios"
import {  useSelector } from 'react-redux';


const UpdateProduct = () => {

    const [imageFile, setImageFile] = useState(null);

    const handleFileSelect = (file) => {
        setImageFile(file);
    };

    const currentUserCompte = useSelector((state) => state.auth.compteUser)


    //const currentUser = useSelector((state)=>state.auth.user)

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

        // Validation côté client
        const requiredFields = [
            'categorie_product',
            'operation_product',
            'code_reference',
            'description_product',
        ];

        for (let field of requiredFields) {
            if (!dataProduct[field]) {
                alert(`Le champ ${field} est requis.`);
                return;
            }
        }

        if (!imageFile) {
            alert("L'image du produit est requise.");
            return;
        }

        if (isLoanOptionSelected) {
            if (!dataProduct.date_emprunt || !dataProduct.date_fin_emprunt) {
                alert("Les dates d'emprunt et de fin sont requises pour un prêt.");
                return;
            }
        }

        // FormData
        const formData = new FormData();
        formData.append("categorie_product", dataProduct.categorie_product);
        formData.append("operation_product", dataProduct.operation_product);
        formData.append("code_reference", dataProduct.code_reference);
        formData.append("description_product", dataProduct.description_product);
        formData.append("fournisseur", currentUserCompte?.id);
        formData.append("image_product", imageFile);

        if (isLoanOptionSelected) {
            formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));
            formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/produits/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log("Réponse :", response.data);
            alert("Produit créé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la création :", error.response?.data || error.message);
            alert("Erreur lors de la création du produit.");
        }
    };


    return (
        <section className="bg-white dark:bg-gray-900">

            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">

                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                    Ajouter / Modifier un produit
                </h2>

                <form onSubmit={submitForm}>

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

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            Enregistrer le produit
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateProduct;
