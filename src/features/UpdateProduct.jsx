import React, { useState, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import api from "../services/Axios";
import AttentionAlertMesage, { showMessage } from "../components/AlertMessage";
import { addMessageNotif } from "../slices/chatSlice";
import LoadingCard from "../components/LoardingSpin";
import { ButtonSimple } from "../components/Button";
import TitleCompGen from "../components/TitleComponentGen";
import FormElementFileUpload from "./FormFile";
import InputBox from "../components/InputBoxFloat";
import { ENDPOINTS, LIST_CATEGORIES_KEYS, PAYEMENTMODE, availableColors, availableSizes, socialLinks } from "../utils";
import { NavLink } from 'react-router-dom';
import { setCurrentNav } from "../slices/navigateSlice";
import LocationSearchPopover from "./LocationSearch";
import { FaDollarSign, FaBoxes, FaTruck, FaTag, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash} from "react-icons/fa";


const AddUploadProduct = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const bottomRef = useRef(null);

    const user = useSelector((state) => state.auth.user);
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    const [currentSection, setCurrentSection] = useState(1);

    const [imageVariants, setImageVariants] = useState([]);

    var initDataProduct = {
        "code_reference": "",
        "name_product": "",
        "description_product": "",
        "categorie_product": null,
        "operation_product": null,
        "price_product": null,
        "discount_price": null,
        "currency_price": null,
        "promotion": false,
        "quantity_product": null,
        "is_available": false,
        "delivery": null,
        "shipping_price": null,
        "adress": "",
        "date_emprunt": null,
        "date_fin_emprunt": null,
        "type_choice": null,
        "payment_method": null,
        "social_links": null,
        "is_active": false,
        "is_verified": false,
        "commission_percentage": null,
        "images": [],
        "variants": []
    }

    const [dataProduct, setDataProduct] = useState(initDataProduct); 

    const getAdress = (newAdress) => {
        setDataProduct(prev => ({ ...prev, adress: newAdress }))
    }

    const [imageLoaded, setImageLoaded] = useState(null); 

    const OptionSelector = ({ options, selectedOption, onSelect, isColor }) => (

        <div className="flex gap-2 flex-wrap">

            {
                options.map(opt => {
                const isSelected = selectedOption === opt;

                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onSelect(opt)}
                        className={`
                                relative cursor-pointer my-2 border-2 transition-all duration-150
            
                                ${isColor
                                ? "w-6 h-6 rounded-full"
                                : "px-3 py-1 rounded-full text-sm"
                            }

                                ${isSelected
                                ? "border-green-400 ring-2 ring-green-300 scale-110"
                                : "border-gray-300 hover:border-gray-400"
                            }

                                ${!isColor && (
                                isSelected
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                            )}
                        `}
                        style={isColor ? { backgroundColor: opt } : {}}
                    >

                        {!isColor && opt}

                        {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-white drop-shadow">
                                ✓
                            </span>
                        )}

                    </button>
                );
                })
            }

        </div>
    );

    const isUserVerified =user?.is_fournisseur && user?.is_verified
    function getImage(image) {

        setImageLoaded(image)
    }

    const handleFileSelect = (files) => {
        const filesArray = Array.from(files);
        const newImages = filesArray.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            color: null,
            size: null
        }));

        setImageVariants(prev => [...prev, ...newImages]);
    };

    const ImageVariantSelector = ({ imgIndex }) => {

        const img = imageVariants[imgIndex];

        const toggleColorForImage = (color) => {

            setImageVariants(prev => {
                const updated = [...prev];
                updated[imgIndex].color = color;
                return updated;
            });
        };

        const toggleSizeForImage = (size) => {

            setImageVariants(prev => {
                const updated = [...prev];
                updated[imgIndex].size = size;
                return updated;
            });
        };

        return (

            <div className="flex flex-wrap gap-2 mb-4 border p-2 rounded border border-gray-100">

                <div className="relative w-24 h-24">

                    <img src={img.preview} alt="preview" className="w-24 h-24 object-cover rounded-md shadow mb-2 border border-gray-100" />

                    <span
                        onClick={() =>
                            setImageVariants(prev => prev.filter((item, idx) => idx !== imgIndex))
                        }
                        className="absolute top-0 right-0 m-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 h-5 w-5 flex items-center justify-center cursor-pointer"
                    >
                        x
                    </span>

                </div>

                <div>
                    <div>
                        <OptionSelector
                            options={availableColors}
                            selectedOption={img.color}
                            onSelect={toggleColorForImage}
                            isColor
                        />
                    </div>
                    <div>
                        <OptionSelector
                            options={availableSizes}
                            selectedOption={img.size}
                            onSelect={toggleSizeForImage}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const onChangeClick = (e) => {
        const { name, value } = e.target;
        setDataProduct(prev => ({
            ...prev,
            [name]: value
        }));
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
        setIsProductAdded(true);
    };

    const submitForm = async (e) => {

        e.preventDefault();

        setIsLoadingSubmit(true);

        const social_links = {};

        ["link_facebook", "link_instagramme", "link_tiktok", "link_twitter"].forEach(key => {
            if (dataProduct[key]) social_links[key.replace("link_", "")] = dataProduct[key];
        });
       

        try {

            const formData = new FormData();

            // Préparer images pour l'envoi
            const variantsToSend = imageVariants.map(img => {
                if (!img.color || !img.size) {
                    throw new Error("Chaque image doit avoir une couleur et une taille");
                }
                formData.append("variant_images", img.file);
                return {
                    color: img.color,
                    size: img.size,
                };
            });


            // Tous les champs
            Object.entries(dataProduct).forEach(([key, value]) => {
                if (!socialLinks.includes(key)) formData.append(key, value ?? "");
            });

            formData.append("social_links", JSON.stringify(social_links));

            // Préparer images pour l'envoi
            const imagesToSend = imageVariants.map(img => ({
                image: img.file,
            }));

            formData.append("variants", JSON.stringify(variantsToSend));

            setDataProduct(prev => ({
                ...prev,
                images: imagesToSend,
                variants: variantsToSend
            }));

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1])
            }

            // Dates si PRETER
            if (isLoanOptionSelected) {
                formData.append("date_emprunt", formatToISOString(dataProduct.date_emprunt));
                formData.append("date_fin_emprunt", formatToISOString(dataProduct.date_fin_emprunt));
            }

            if (!dataProduct?.price_product) {

                notify("Erreur", "price product obligatoire!");

                throw new Error("price product obligatoire")
            }

            if (dataProduct?.categorie_product) {

                const category = await api.post("/categories/", { name: dataProduct.categorie_product });

                formData.append("categorie_product", category?.data?.slug);

            } else {

                notify("Erreur", " Categorie obligatoire!");

                throw new Error("Categorie obligatoire"); // évite d'envoyer vide

            }

            await api.post("/produits/", formData, { headers: { "Content-Type": "multipart/form-data" } });

            notify("Message", "Produit créé avec succès !");

            dispatch(addMessageNotif(`Produit ${dataProduct?.code_reference} créé le ${new Date().toLocaleString()}`));
;
        } catch (err) {

            console.log("Erreur de la donnée", err)

            const responseData = err?.response?.data

            var resp=""

            if (typeof responseData === "object" && !Array.isArray(responseData) && responseData !== null) {
                var i = 0;
                while (i <= responseData.length) {
                    i++;
                    resp += `${responseData[i]}`
                }
            } else if (Array.isArray(responseData)) {
                var j = 0;
                while (j<= responseData.length) {
                    j++;
                    resp += `${responseData[i]}`
                }

            }

            notify("Erreur", `${resp}`);

        } finally {
            setDataProduct(initDataProduct);
            setIsLoadingSubmit(false)
        }
    };

    return (

        <div className="rounded-md flex flex-col justify-center items-center pb-[10dvh] overflow-x-hidden ">

            <span className={`${isProductAdded && "hidden"}`}>

                <TitleCompGen title={t("add_product.add_or_update_product")} />

                {
                    !isUserVerified && (
                        <NavLink
                            to={`/${ENDPOINTS.USER_PROFIL}`}
                            className="whitespace-nowrap text-blue-800 hover:underline text-sm lg:text-md m-auto w-full"
                            onClick={() => dispatch(setCurrentNav(ENDPOINTS.USER_PROFIL))}
                        >
                            {t("verifyAccount")}

                        </NavLink>
                    )
                }

            </span>

            <span className={`text-gray-500  text-2xl z-10 ${!isProductAdded && "hidden"}`}>
                <TitleCompGen title={t("product_summary")} />
            </span>

            <div className="mb-4">
                <AttentionAlertMesage />
            </div>

            {isProductAdded ? (
                <ProductSummary
                    isLoading={isLoadingSubmit}
                    product={dataProduct}
                    t={t}
                    onEdit={() => {
                        setCurrentSection(5)
                        setDataProduct({ ...dataProduct });
                        setIsProductAdded(false);
                        setIsLoadingSubmit(false)
                        setIsProductAdded(false)
                    }}
                    onDelete={() => {
                        setDataProduct({ ...initDataProduct});
                        setIsProductAdded(false);
                        setCurrentSection(1)
                        setImageVariants([])
                        setIsLoadingSubmit(false)
                        setIsProductAdded(false)

                    }}
                    onAddNew={(e) => {
                        submitForm(e);
                        if (!isLoadingSubmit) {
                            setIsLoadingSubmit(false)
                            setIsProductAdded(false)
                            setImageVariants([])
                        }
                    }}
                >
                    <img
                        src={imageLoaded}
                        alt="pt"
                        className="w-48 h-48 object-cover rounded-md shadow"
                    />

                </ProductSummary>
            ) : (
                    <div className="py-1 lg:py-2 w-full md:w-1/2 lg:w-1/2 px-4 shadow-lg rounded-lg bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 p-2">

                    <form
                        onSubmit={saveDataForSubmitForm}
                        className={` ${isUserVerified ? "w-full md:w-auto" : "opacity-50 pointer-events-none cursor-not-allowed"}`}
                    >
                        {/* Sections du formulaire */}
                        {currentSection >= 1 && (
                            <div>

                                <h2 className="text-lg font-extrabold text-gray-500 pt-4 pb-1 mb-1 sm:col-span-2">
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

                                {/*<OptionSelector*/}
                                {/*    options={availableColors}*/}
                                {/*    selectedOptions={selectedColors}*/}
                                {/*    toggleOption={toggleColor}*/}
                                {/*    isColor*/}
                                {/*/>*/}

                                {/*<InputBox*/}
                                {/*    type="text"*/}
                                {/*    id="code_reference"*/}
                                {/*    name="code_reference"*/}
                                {/*    value={dataProduct?.code_reference}*/}
                                {/*    onChange={onChangeClick}*/}
                                {/*    placeholder="Reference ex: ABC-123"*/}

                                {/*/>*/}

                                <InputBox
                                        type="Number"
                                        min="0"
                                        id="price_product"
                                        name="price_product"
                                        value={dataProduct?.price_product}
                                        onChange={onChangeClick}
                                        placeholder={t("price")}
                                        required={true}
                                />

                                <select
                                    required={true}
                                    id="Currency_price"
                                    name="Currency_price"
                                    value={dataProduct?.Currency_price}
                                    onChange={onChangeClick}
                                    className="my-4 border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                >
                                    <option value="" disabled>{t("add_product.select_currency")}</option>
                                    <option value="EURO">{t("add_product.euro")}</option>
                                    <option value="DOLLAR">{t("add_product.dollar")}</option>
                                    <option value="FRANC">{t("add_product.franc")}</option>
                                </select>

                                {/*<OptionSelector*/}
                                {/*    options={availableSizes}*/}
                                {/*    selectedOptions={selectedSizes}*/}
                                {/*    toggleOption={toggleSize}*/}
                                {/*/>*/}

                                <button type="button" onClick={nextSection} className={` ${currentSection >= 2 ? "hidden" : ""}  px-4 py-2 bg-gradient-to-l from-red-50 to-gray-200 text-white rounded-lg mt-4`}>
                                    <svg className="w-[33px] h-[33px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z" />
                                    </svg>
                                </button>


                            </div>
                        )}

                        {currentSection >= 2 && (
                            <div>
                                <h2 className="text-lg font-extrabold text-gray-500  pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.details")}
                                </h2>

                                <select
                                        id="categorie_product"
                                        name="categorie_product"
                                        value={dataProduct.categorie_product || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setDataProduct(prev => ({ ...prev, categorie_product: value })); // <-- assure que l'état principal est mis à jour
                                        }}
                                        className="my-4 border-0 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                        required={true}
                                >
                                <option value="" disabled>{t("add_product.select_category")}</option>
                                    {
                                        LIST_CATEGORIES_KEYS?.map((value, idx) => (
                                            <option key={idx} value={value}>
                                                {t(`add_product.categories.${value}`)}
                                            </option>
                                        ))
                                    }
                                </select>

                                <FormElementFileUpload
                                    label={t("add_product.ChooseImage")}
                                    getFile={handleFileSelect}
                                    getImage={getImage}
                                    multiple  // Permet de choisir plusieurs images
                                />
                                    <div className="flex flex-col gap-2 my-2">
                                        {imageVariants.map((img, idx) => (
                                            <div key={idx} className="
                                                  flex gap-4 
                                                  p-3 
                                                  rounded-xl 
                                                  border border-gray-100 
                                                  bg-gray-50
                                                  hover:shadow-md
                                                  transition
                                                  cursor-pointer
                                                ">
                                                <ImageVariantSelector imgIndex={idx} />
                                            </div>
                                        ))}
                                    </div>
                                <textarea
                                    id="description_product"
                                    name="description_product"
                                    value={dataProduct?.description_product}
                                    onChange={onChangeClick}
                                    rows="6"
                                    className="my-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg focus:outline-none border border-gray-300 focus:bg-yellow-100"
                                    placeholder="Description du produit entre 20 et 100 caractères..."
                                    required={true}
                                    minLength={20}
                                    maxLength={100}
                                />

                                <button type="button" onClick={nextSection} className={` ${currentSection >= 3 ? "hidden" : ""}  px-4 py-2 bg-gradient-to-l from-red-50 to-gray-200 text-white rounded-lg mt-4`}>
                                    <svg className="w-[33px] h-[33px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z" />
                                    </svg>
                                </button>

                            </div>
                        )}

                        {currentSection >= 3 && (
                            <div>

                                <h2 className="text-lg font-extrabold text-gray-500  pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("add_product.paimement_infos")}
                                </h2>

                                <select
                                    id="operation_product"
                                    name="operation_product"
                                    value={dataProduct.operation_product}
                                    onChange={onChangeClick}
                                    className="my-4 bg-gray-50 border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                    required
                                >
                                    <option value="" disabled>{t("add_product.select_operation")}</option>
                                    <option value="PRETER">{t("add_product.PRETER")}</option>
                                    <option value="VENDRE">{t("add_product.VENDRE")}</option>
                                </select>

                                {isLoanOptionSelected && (
                                    <>
                                        <InputBox type="datetime-local" id="date_emprunt" name="date_emprunt" value={dataProduct.date_emprunt} onChange={onChangeClick} />
                                        <InputBox type="datetime-local" id="date_fin_emprunt" name="date_fin_emprunt" value={dataProduct.date_fin_emprunt} onChange={onChangeClick} />
                                    </>
                                )}


                                <select
                                    id="payment_method "
                                    name="payment_method "
                                    value={dataProduct.payment_method}
                                    onChange={onChangeClick}
                                    className="my-4 bg-gray-50 border-0 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-0"
                                    required
                                >
                                    <option value="" disabled>{t("payment_mode")}</option>
                                    <option value={PAYEMENTMODE[0]}>{t("CASH")}</option>
                                    <option value={PAYEMENTMODE[1]}>{t("CARD")}</option>
                                    <option value={PAYEMENTMODE[2]}>{t("MOBILE")}</option>

                                </select>


                                <button type="button" onClick={nextSection} className={` ${currentSection >= 4 ? "hidden" : ""} px-4 py-2 bg-gradient-to-l from-red-50 to-gray-200 text-white rounded-lg mt-4`}>
                                    <svg className="w-[33px] h-[33px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16.153 19 21 12l-4.847-7H3l4.848 7L3 19h13.153Z" />
                                    </svg>
                                </button>

                            </div>
                        )}

                        {currentSection >= 4 && (
                            <div>

                                <h2 className="text-lg font-extrabold text-gray-500  pt-4 pb-1 mb-1 sm:col-span-2">
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

                                <LocationSearchPopover setLocationSearch={getAdress} />

                                {/*<InputBox*/}
                                {/*    type="text"*/}
                                {/*    id="adress"*/}
                                {/*    name="adress"*/}
                                {/*    value={dataProduct?.adress}*/}
                                {/*    onChange={onChangeClick}*/}
                                {/*    placeholder={t("adress")}*/}
                                {/*    required*/}
                                {/*/>*/}

                                <InputBox
                                    type="number"
                                    name="shipping_price"
                                    min="0"
                                    value={dataProduct.shipping_price} 
                                    onChange={onChangeClick} placeholder="Prix de livraison 0.0"
                                />

                                <InputBox
                                    placeholder={t("add_product.quantity")}
                                    type="number"
                                    id="quantity_product"
                                    name="quantity_product"
                                    value={dataProduct?.quantity_product}
                                    onChange={onChangeClick}
                                    min="1"
                                />

                                <h2 className="text-lg font-extrabold text-gray-500 pt-4 pb-1 mb-1 sm:col-span-2">
                                    {t("Links")}
                                </h2>

                                <div className="flex w-full justify-center">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                                    </svg>

                                    <InputBox
                                        placeholder={t("Twitter")}
                                        type="url"
                                        id="link_twitter"
                                        name="link_twitter"
                                        value={dataProduct?.link_twitter}
                                        onChange={onChangeClick}
                                    />
                                </div>

                                <div className="flex w-full justify-center">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd" />
                                    </svg>

                                    <InputBox
                                        placeholder={t("Facebook")}
                                        type="url"
                                        id="link_facebook"
                                        name="link_facebook"
                                        value={dataProduct?.link_facebook}
                                        onChange={onChangeClick}
                                    />

                                </div>

                                <div className="flex w-full justify-center">

                                    <svg className="w-6 h-6 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd" />
                                    </svg>

                                    <InputBox
                                        placeholder={t("Instagram")}
                                        type="url"
                                        id="link_instagramme"
                                        name="link_instagramme"
                                        value={dataProduct?.link_instagramme}
                                        onChange={onChangeClick}
                                    />

                                </div>

                                <div className="flex w-full justify-center">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.5 13C7.567 13 6 14.567 6 16.5S7.567 20 9.5 20s3.5-1.567 3.5-3.5S11.433 13 9.5 13Z" />
                                        <path fill-rule="evenodd" d="M11 5c0-.55228.4477-1 1-1 1.5438 0 3.3242.75435 4.5149 2.16836 1.2348 1.46632 1.7886 3.5834.9338 6.14784-.1747.524-.741.8071-1.2649.6325-.524-.1747-.8071-.741-.6325-1.2649.6452-1.93556.199-3.31848-.5662-4.22716C14.4407 6.8102 13.7107 6.37433 13 6.15825V16.5c0 .5523-.4477 1-1 1s-1-.4477-1-1V5Z" clip-rule="evenodd" />
                                    </svg>

                                    <InputBox
                                        placeholder={t('TicToc')}
                                        type="url"
                                        id="link_tictoc"
                                        name="link_tictoc"
                                        value={dataProduct?.link_tictoc}
                                        onChange={onChangeClick}
                                    />

                                </div>

                                <div className="flex gap-3 justify-center items-center m-auto my-2">
                                    {isLoadingSubmit ? <LoadingCard /> : <ButtonSimple title={t("save")} />}
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


const ProductField = ({ label, value, isLong }) => {
    if (!value) return null;

    return (
        <div className="grid grid-cols-[150px_1fr] gap-7 items-start bg-gray-50 p-2 rounded">
            <span className="font-medium text-[16px]">
                {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>
            <span className={isLong ? "max-h-32 overflow-y-auto" : ""}>
                {typeof value === "string" || typeof value === "number" ? value : value}
            </span>
        </div>
    );
};



const ProductSummary = ({
    product,
    onEdit,
    onDelete,
    onAddNew,
    t,
    isLoading,
    children,
}) => {
    if (!product) return null;

    const simpleFields = [
        { icon: <FaDollarSign className="text-yellow-500" />, label: t("price"), value: `${product.price_product} ${product.Currency_price}` },
        { icon: <FaBoxes className="text-blue-500" />, label: t("quantity"), value: product.quantity_product },
        { icon: <FaTruck className="text-gray-600" />, label: t("shipping_price"), value: `${product.shipping_price} ${ product.Currency_price }` },
        { icon: <FaTag className="text-purple-500" />, label: t("category"), value: product.categorie_product || "" },
        { icon: product.is_available ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />, label: t("availability"), value: product.is_available ? t("yes") : t("no") },
        { icon: product.promotion ? <FaTag className="text-pink-500" /> : null, label: t("promotion"), value: product.promotion ? t("yes") : t("no") },
        { icon: product.is_active ? <FaCheckCircle className="text-green-400" /> : <FaTimesCircle className="text-red-400" />, label: t("active"), value: product.is_active ? t("yes") : t("no") },
        { icon: product.is_verified ? <FaCheckCircle className="text-blue-400" /> : <FaTimesCircle className="text-gray-400" />, label: t("verified"), value: product.is_verified ? t("yes") : t("no") },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-0 to-blue-50 rounded-2xl shadow-xl text-gray-900 dark:text-gray-100 flex flex-col gap-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{product.name_product}</h2>
                {product.promotion && (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {t("promotion")}
                    </span>
                )}
            </div>

            {/* VARIANTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProductField
                    label={t("size")}
                    value={Array.isArray(product.taille_product) ? product.taille_product.join(", ") : product.taille_product}
                />

                <ProductField
                    label={t("color")}
                    value={
                        Array.isArray(product.color_product) ? (
                            <div className="flex flex-wrap gap-2">
                                {product.color_product.map((c, i) => (
                                    <span
                                        key={i}
                                        className="w-6 h-6 rounded-full border border-gray-300 shadow-inner"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        ) : product.color_product
                    }
                />
            </div>

            {/* DESCRIPTION */}
            <ProductField
                label={t("description")}
                value={product.description_product}
                isLong
            />

            {/* CHAMPS AVEC ICONES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {simpleFields.map((field, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                        {field.icon && <div className="text-lg">{field.icon}</div>}
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">{field.label}</span>
                            <span className="font-medium">{field.value}</span>
                        </div>
                    </div>
                ))}

                {product.type_choice && (
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <span className="text-xs text-gray-500">{t("type_choice")}</span>
                        <span className="font-medium">{product.type_choice}</span>
                    </div>
                )}
            </div>

            {children}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 mt-4 justify-end">
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-green-100 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    <FaEdit /> {t("edit")}
                </button>

                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 bg-red-100 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    <FaTrash /> {t("delete")}
                </button>

                {isLoading ? (
                    <LoadingCard />
                ) : (
                    <button
                        type="submit"
                        onClick={onAddNew}
                        className="bg-blue-100 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
                    >
                        {t("submit")}
                    </button>
                )}
            </div>
        </div>
    );
};