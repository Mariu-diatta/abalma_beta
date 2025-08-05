import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessageNotif } from "../slices/chatSlice";
import WalletModal from "../features/WalletModal";
import ProfilPopPov from "../features/PopovProfile";
import { addToCart } from "../slices/cartSlice";
import api from "../services/Axios";
import { useTranslation } from 'react-i18next';
import { numberStarsViews } from "../utils";


const ProductModal = ({ isOpen, onClose, dataProduct }) => {

    const { t } = useTranslation();

    const currentUser = useSelector(state => state.auth.user)

    const selectedUser = useSelector(state => state.chat.userSlected)

    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const dispatch = useDispatch();

    const [isProductAdd, setIsProductAdd] = useState(false);

    const [productNbViews, setProductNbViews] = useState(null);

    const buttonRef = useRef(null)

    const popovRef = useRef(null)

    useEffect(() => {
        // Appelle l'API => déclenche record_view automatiquement côté backend
        api.get(`/products_details/${dataProduct?.id}/`)
            .then(response => {
                setProductNbViews(response.data?.total_views);
            })
            .catch(error => {
                console.error('Erreur de chargement du produit:', error);
            });
    }, [dataProduct?.id]);

    useEffect(
        () => {

            var isCurrent_User = () => !(currentUser?.id === selectedUser?.id)

            setIsCurrentUser(isCurrent_User)

        }, [currentUser?.id, selectedUser?.id]

    )

    // Sans paramètre, pour un appel manuel
    const handleAddToCart_ = () => {

        if (!dataProduct) return;

        dispatch(addToCart(dataProduct));

        setIsProductAdd(true);

        const dateAjout = new Date().toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        dispatch(

            addMessageNotif(`Produit ${dataProduct.code_reference} sélectionné le ${dateAjout}`)
        );
    };

    if (!isOpen) return null;

    return (

        <div className="relative z-40 " role="dialog" aria-modal="true" ref={popovRef}>

            <div
                className="fixed inset-0 bg-gray-500/75 transition-opacity md:block"
                aria-hidden="true"
                onClick={onClose}
                ref={buttonRef}
            >
            </div>

            <div className="fixed inset-0 z-40 w-screen overflow-y-auto">

                <div className="flex min-h-full items-stretch justify-center text-center md:items-center">

                    <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">

                        <div

                            className="relative flex w-full items-center overflow-hidden "

                            style={
                                {
                                    backgroundColor: "var(--color-bg)",
                                    color: "var(--color-text)"
                                }
                            }

                        >

                            <div className="flex gap-2">

                                <div className="absolute bottom-0 left-2 mt-5 lg:mt-auto  lg:left-auto lg:right-12 lg:top-0 lg:bottom-auto md:top-1 md:bottom-auto flex items-between gap-1 ">

                                    {
                                        !isProductAdd &&
                                        <button

                                            onClick={(e) => handleAddToCart_(e)}

                                            title="Ajouter au panier"

                                            className="flex items-center justify-center p-3 rounded-full  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

                                            aria-label="Ajouter au panier"

                                        >
                                            <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                            </svg>

                                        </button>
                                    }

                                    <WalletModal>

                                        <button

                                            title="Payer"

                                            className="rounded-full flex items-center justify-center p-3  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

                                            aria-label="Payer"
                                        >
                                            <svg style={{ color: "black" }}  className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                            </svg>

                                        </button>

                                    </WalletModal>

                                    {
                                        isCurrentUser &&

                                        <div
                                            title="Profil Produit Popov"

                                            className="z-20 rounded-full "

                                            tabIndex={0}

                                            aria-label="Profil Produit Popov"

                                        >
                                            <ProfilPopPov/>

                                        </div>
                                    }

                                </div>

                                <div className="fixed lg:absolute top-0 right-0">

                                    <button

                                        type="button"

                                        onClick={onClose}

                                        className="z-0 rounded-full flex items-center justify-center p-3  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <span className="sr-only">Close</span>

                                        <svg
                                            className="z-0  size-4"

                                            fill="none"

                                            viewBox="0 0 24 24"

                                            strokeWidth={1}

                                            stroke="currentColor"

                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>

                                    </button>

                                </div>

                            </div>

                            <div className="gap-y-8  grid w-full grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-1">

                                <img

                                    src={dataProduct?.image_product}

                                    alt="Product"

                                    className="aspect-4/5 w-full  object-cover sm:col-span-6 lg:col-span-7"
                                />

                                <div className="sm:col-span-6 lg:col-span-5  lg:mt-6 lg:pt-2 p-2  mb-8 pb-8 gap-y-8 ">

                                    <h2 className="text-2xl font-bold  sm:pr-12">

                                        {dataProduct?.categorie_product}

                                    </h2>

                                    <section className="mt-2 ">

                                        <p className="text-2xl 0">${dataProduct?.price_product}</p>

                                        <div className="mt-6">

                                            <div className="flex items-center">

                                                <div className="flex items-center">

                                                    {[...Array(parseInt(numberStarsViews(productNbViews)))].map((_, i) => (

                                                        <svg

                                                            key={i}

                                                            className="size-5 text-gray-900"

                                                            fill="currentColor"

                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ))}

                                                </div>

                                                <a
                                                    href="/home"

                                                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    {productNbViews} {t('reviews')}

                                                </a>

                                            </div>

                                        </div>

                                    </section>

                                    {/* Color Options */}
                                    <fieldset>

                                        <legend className="text-sm font-medium ">

                                            {dataProduct?.color_prouct}

                                        </legend>

                                        <div className="mt-4 flex items-center gap-x-3">

                                            {["white", "gray", "black"].map((color) => (

                                                <div

                                                    key={color}

                                                    className="flex rounded-full outline outline-black/10"

                                                >
                                                    <input

                                                        type="radio"

                                                        name="color"

                                                        value={color}

                                                        className={`size-8 appearance-none rounded-full ${color === "white"

                                                            ? "bg-white"

                                                            : color === "gray"

                                                                ? "bg-gray-200"

                                                                : "bg-gray-900"

                                                            } checked:outline-2 checked:outline-offset-2 checked:outline-gray-400 focus-visible:outline-3 focus-visible:outline-offset-3`}

                                                        defaultChecked={color === "white"}
                                                    />

                                                </div>
                                            ))}

                                        </div>

                                    </fieldset>

                                    <h2 className="text-sm  mt-5">

                                        {dataProduct?.description_product}

                                    </h2>

                                    {/* Size Options */}
                                    <fieldset className="mt-10">

                                        <div className="flex items-center justify-between">

                                            <div className="text-sm font-medium">

                                                {dataProduct?.color_prouct}

                                            </div>

                                        </div>

                                        <div className="z-0 mt-4 mb-2 sm:mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">

                                            {[
                                                { label: "Type", value: dataProduct?.type_choice },
                                                { label: "Quantité", value: dataProduct?.quantity_product },
                                                { label: "Taille", value: dataProduct?.taille_product },
                                                { label: "Opération", value: dataProduct?.operation_product },
                                                { label: "Catégorie", value: dataProduct?.categorie_product },

                                            ].map(({ label, value }, idx) => (

                                                <label

                                                    key={`${label}-${idx}`}

                                                    htmlFor={`${label}-${value}`}

                                                    className="group relative flex flex-col items-center justify-center border border-gray-300  rounded-md px-1 py-1 text-xs text-gray-800 hover:bg-gray-100 transition-all duration-150"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="productDetail"
                                                        id={`${label}-${value}`}
                                                        value={value}
                                                        className="sr-only lowercase"
                                                    />

                                                    <span className="text-xs">{label.toLowerCase()}</span>

                                                    <span className="text-xs">{value.toLowerCase() || "N/A"}</span>

                                                </label>
                                            ))}

                                        </div>

                                    </fieldset>

                                    <fieldset className="absolute bottom-2 right-2 text-xs text-gray-500">

                                        {(() => {

                                            const createdDate = new Date(dataProduct?.created);

                                            const now = new Date();

                                            const isToday = createdDate.toDateString() === now.toDateString();

                                            const formattedTime = createdDate.toLocaleTimeString("fr-FR", {

                                                hour: "2-digit",

                                                minute: "2-digit",
                                            });

                                            const formattedDate = createdDate.toLocaleDateString("fr-FR");

                                            return isToday

                                                ? `${t("phrasaleDate")} ${formattedTime}`

                                                : `${formattedDate} ${t('at')} ${formattedTime}`;
                                        })()}

                                    </fieldset>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductModal;