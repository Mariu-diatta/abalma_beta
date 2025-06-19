import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addMessageNotif } from "../slices/chatSlice";
import WalletModal from "../features/WalletModal";
import ProfilPopPov from "../features/PopovProfile";
import { addToCart } from "../slices/cartSlice";

const ProductModal = ({ isOpen, onClose, dataProduct }) => {



    const dispatch = useDispatch();

    const [isProductAdd, setIsProductAdd] = useState(false);
    const [showActions, setShowActions] = useState(false);

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
        <div className="relative z-40  " role="dialog" aria-modal="true">

            <div
                className="fixed inset-0 bg-gray-500/75 transition-opacity md:block"
                aria-hidden="true"
                onClick={onClose}
            >
            </div>

            <div className="fixed inset-0 z-40 w-screen overflow-y-auto">

                <div className="flex min-h-full items-stretch justify-center text-center md:items-center">

                    <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">

                        <div className="relative flex w-full items-center overflow-hidden bg-white">

                            <div className="z-0 absolute top-1 right-2 ">

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="z-0 flex items-center justify-center p-3  bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="z-0  size-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
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

                            <div className="absolute top-1 right-20  flex items-center gap-4 ">

                                {!isProductAdd && <button
                                    onClick={(e) => handleAddToCart_(e)}
                                    title="Ajouter au panier"
                                    className="flex items-center justify-center p-3 rounded-full bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Ajouter au panier"
                                >
                                    🛒
                                </button>}

                                <WalletModal>
                                    <button
                                        title="Payer"
                                        className="flex items-center justify-center p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        aria-label="Payer"
                                    >
                                        💳
                                    </button>
                                </WalletModal>

                                <div
                                    title="Profil Produit Popov"
                                    className="z-20 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus-within:ring-2 focus-within:ring-blue-500"
                                    tabIndex={0}
                                    aria-label="Profil Produit Popov"
                                >
                                    <ProfilPopPov />
                                </div>

                            </div>


                            <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 ">

                                <img
                                    src={dataProduct?.image_product}
                                    alt="Product"
                                    className="aspect-4/5 w-full bg-gray-100 object-cover sm:col-span-6 lg:col-span-6"
                                />

                                <div className="sm:col-span-6 lg:col-span-6 lg:mt-8 lg:pt-8 p-5">

                                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                                        {dataProduct?.description_product}
                                    </h2>

                                    <section className="mt-2 ">

                                        <p className="text-2xl text-gray-900">${dataProduct?.price_product}</p>

                                        <div className="mt-6">
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    {[...Array(4)].map((_, i) => (
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
                                                    <svg
                                                        className="size-5 text-gray-200"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <a
                                                    href="#"
                                                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    117 reviews
                                                </a>
                                            </div>
                                        </div>
                                    </section>


                                    {/* Color Options */}
                                    <fieldset>

                                        <legend className="text-sm font-medium text-gray-900">
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

                                    {/* Size Options */}
                                    <fieldset className="mt-10">

                                        <div className="flex items-center justify-between">

                                            <div className="text-sm font-medium text-gray-900">
                                                {dataProduct?.color_prouct}
                                            </div>

                                            {/*<a*/}
                                            {/*    href="#"*/}
                                            {/*    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"*/}
                                            {/*>*/}
                                            {/*    Size guide*/}
                                            {/*</a>*/}

                                        </div>

                                        <div className="z-0 mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

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
                                                    className="group relative flex flex-col items-center justify-center border border-gray-300 bg-white rounded-md px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-all duration-150"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="productDetail"
                                                        id={`${label}-${value}`}
                                                        value={value}
                                                        className="sr-only lowercase"
                                                    />

                                                    <span className="text-xs text-gray-500">{label}</span>

                                                    <span className="">{value.toLowerCase() || "N/A"}</span>

                                                </label>
                                            ))}
                                        </div>

                                    </fieldset>

                                    <fieldset className="absolute bottom-2 right-2 text-xs text-gray-500">
                                        {(() => {
                                            const createdDate = new Date(dataProduct?.created);
                                            const now = new Date();

                                            const isToday =
                                                createdDate.toDateString() === now.toDateString();

                                            const formattedTime = createdDate.toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            });

                                            const formattedDate = createdDate.toLocaleDateString("fr-FR");

                                            return isToday
                                                ? `Aujourd'hui à ${formattedTime}`
                                                : `${formattedDate} à ${formattedTime}`;
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