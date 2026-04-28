import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addToCart } from "../slices/cartSlice";

import PrintNumberStars from "../components/SystemStar";
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import TextParagraphs from "../components/TextToParagraph";

import express_delivery from "../../src/assets/express-delivery_1981844.png";
import home_5657414 from "../../src/assets/home-address_12248895.png";
import pay_8331969 from "../../src/assets/pay_8331969.png";
import ProfilPopPov from "../features/PopovProfile";
import api from "../services/Axios";

const ProductDetailsSection = ({ isOpen, onClose}) => {

    const [selectedColor, setSelectedColor] = useState(null);

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const product = useSelector(state => state.cart.selectedProductView);

    const [index, setIndex] = useState(0);

    const handleAddToCart = () => {

        dispatch(addToCart(product));
    };

    const createdDate = new Date(product?.created);

    const now = new Date();

    const isToday = createdDate.toDateString() === now.toDateString();

    const formattedTime = createdDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const formattedDate = createdDate.toLocaleDateString("fr-FR");

    const operations = [
        { logo: express_delivery, title: t("delivery"), value: product?.delivery },
        { logo: home_5657414, title: t("adress"), value: product?.adress },
        { logo: pay_8331969, title: t("paymentMethod"), value: product?.payment_method }
    ];

    const variantsProduct = product?.variants

    const imageCurrentVariantImage = product?.variants?.[index]?.image

    const getPrevImageVariant = (index) => index < (variantsProduct.length - 1) ? (index + 1) : 0 

    const isAllowToOpen = !isOpen || !product?.id

    const socialIcons = {
        twitter: "🐦",
        facebook: "📘",
        instagram: "📸",
        tiktok: "🎵",
    };

    const infos = [
        { label: "Type", value: product?.type_choice },
        { label: "Quantité", value: product?.quantity_product },
        {
            label: "Taille",
            value: variantsProduct?.map(v => v.size).filter(Boolean).join(", ")
        },
        { label: "Opération", value: product?.operation_product },
        { label: "Catégorie", value: product?.categorie_product }
    ];

    const [expandedKey, setExpandedKey] = useState(null);

    useEffect(() => {
        if (!product?.id || isAllowToOpen) return;

        const controller = new AbortController();

        const updateViewCount = async () => {
            try {
                await api.get(`products_details/${product.id}/`, {
                    signal: controller.signal,
                    withCredentials: true
                });
            } catch (err) {
                console.log("Erreur update view count:", err);
                if (err.name !== "CanceledError" && err.name !== "AbortError") {
                    console.error("Erreur update view count:", err);
                }
            }
        };

        updateViewCount();

        return () => {
            controller.abort(); // 🔥 clean cancel
        };
    }, [product?.id, isAllowToOpen]);

    if (isAllowToOpen) return;

    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center shodow-2xl">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={() => { onClose(); setIndex(0) }}
            />

            {/* Modal */}
            <div className="relative bg-white max-w-5xl w-full rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh] scrollbor_hidden">

                {/* Close */}
                <button
                    onClick={() => { onClose();  setIndex(0)}}
                    className="absolute right-4 top-4 text-gray-500 hover:text-black"
                >
                    ✖
                </button>

                <section className="py-4">

                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">

                        {/* IMAGE */}
                        <div className="max-w-md mx-auto">

                            <img
                                src={imageCurrentVariantImage}
                                alt={product?.name_product}
                                className="w-full object-contain"
                                onClick={() => setIndex(getPrevImageVariant(index))}
                            />

                        </div>

                        {/* DETAILS */}
                        <div className="mt-6 lg:mt-0 shadow-md p-3">

                            <div className="flex justify-between">

                                <h1 className="text-xl font-semibold text-gray-900 ">
                                    {product?.name_product}
                                </h1>

                                <ProfilPopPov/>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                {t("code_ref")} #{product?.code_reference}
                            </p>

                            {/* PRICE */}
                            <div className="mt-2 flex items-center gap-4">

                                <p className="text-2xl font-extrabold">
                                    <RendrePrixProduitMonnaie item={product} />
                                </p>

                                <PrintNumberStars
                                    t={t}
                                    productNbViews={product?.view_count}
                                />

                            </div>

                            {/* ACTIONS */}
                            <div className="mt-5 flex gap-4">

                                <button
                                    className="hidden flex gap-2 items-center px-4 py-2 bg-gradient-to-l from-red-50 to-gray-200 hover:bg-gradient-to-r hover:from-blue-300 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    ❤️
                                    <>{t("add_favorite")}</>

                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex gap-2 items-center px-4 py-2 bg-gradient-to-l from-red-50 to-gray-200 hover:bg-gradient-to-r hover:from-blue-300 text-white rounded-lg hover:bg-blue-600 transition"
                                >

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                                    </svg>

                                    <>{t("add_in_basket")}</>

                                </button>

                            </div>

                            <hr className="my-6 border-gray-300" />

                            {/* COLOR */}
                            {Array.isArray(variantsProduct) && variantsProduct[0]?.color && <fieldset>

                                <legend className="text-sm font-medium">
                                    {t("color_prod")}
                                </legend>
                                <div className="flex gap-2 mt-2">

                                    {Array.isArray(variantsProduct) && variantsProduct?.map((variant, index) => (

                                        <div
                                            key={index}
                                            onClick={
                                                () => {
                                                    setSelectedColor(variant?.color);
                                                    setIndex(index)
                                                }
                                            }
                                            className={`w-8 h-8 rounded-full border cursor-pointer  border-gray-100 shadow-md
                                                ${selectedColor === variant?.color ? "ring-2 ring-blue-300" : ""}
                                              `}
                                            style={{ backgroundColor: variant?.color }}
                                        />

                                    ))}

                                </div>

                            </fieldset>}

                            {/* DESCRIPTION */}
                            <div className="mt-6">

                                <h3 className="font-semibold mb-2">
                                    {t("description_prod")}
                                </h3>

                                <TextParagraphs
                                    text={product?.description_product?.toLowerCase()}
                                />

                            </div>

                            {/* INFO GRID */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 flex overflow-x-auto  w-full scrollbor_hidden">

                                    {
                                        Object.entries(product?.attributes || {}).length > 0 ? (

                                        Object.entries(product.attributes).map(([key, value]) => {

                                            const isExpanded = expandedKey === key;

                                            return (
                                                <span
                                                    key={key}
                                                    onClick={() => setExpandedKey(isExpanded ? null : key)}
                                                    className="group relative flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm w-full hover:shadow-lg transition cursor-pointer"
                                                >
                                                    <span className="text-gray-500 font-medium tracking-wide uppercase text-xs">
                                                        {key}
                                                    </span>

                                                    <span
                                                        className={`font-bold text-blue-900 capitalize transition-all duration-200 ${isExpanded
                                                                ? "whitespace-normal break-words"
                                                                : "truncate max-w-[120px]"
                                                            }`}
                                                    >
                                                        {String(value)}

                                                    </span>

                                                    {/* Tooltip uniquement si NON ouvert */}
                                                    {!isExpanded && (
                                                        <div className="
                                                            absolute left-1/2 -translate-x-1/2 -top-10
                                                            opacity-0 group-hover:opacity-100
                                                            transition-all duration-200
                                                            bg-blue-100 text-white text-xs px-3 py-1 rounded-md shadow-lg
                                                            whitespace-nowrap z-50
                                                        ">
                                                            {String(value)}
                                                        </div>
                                                    )}
                                                </span>
                                            );
                                        })

                                    ) : (
                                            <>
                                                {infos?.map((item, index) => (
                                                    item?.value && (
                                                        <Info
                                                            key={index}
                                                            label={item.label}
                                                            value={item.value}
                                                        />
                                                    )
                                                ))}
                                            </>
                                        )
                                    }
                            </div>

                            <hr className="my-6 border-gray-300" />

                            {
                                Object.entries(product?.social_links || {}).length > 0 &&
                                Object.entries(product?.social_links).map(([key, value]) => {

                                    const isSocial = socialIcons[key?.toLowerCase()];

                                    return (
                                        <span
                                            key={key}
                                            className="flex items-center justify-between gap-3 px-3 py-1.5 my-2 rounded-lg bg-gray-50 border border-gray-200 text-sm"
                                        >
                                            {/* clé */}
                                            <span className="text-gray-500 font-medium tracking-wide uppercase text-xs">
                                                {isSocial} {key}
                                            </span>

                                            {/* valeur */}
                                            {isSocial ? (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    <span className="text-green-800 ">{String(value)} </span>
                                                </a>
                                            ) : (
                                                <span className="font-bold text-blue-900 capitalize">
                                                    {String(value)}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })
                            }


                            <hr className="my-6 border-gray-300" />

                            {/* OPERATIONS */}
                            <div className="flex gap-4 mt-6 flex-wrap">

                                {operations?.map((op, i) => (
                                    <span key={i} className="flex items-center gap-2 text-sm">

                                        <img src={op.logo} width="20" alt="" />

                                        <span>{op.title}:</span>

                                        <span className="font-medium">
                                            {op.value?.toLowerCase()}
                                        </span>

                                    </span>
                                ))}

                            </div> 

                            <hr className="my-6 border-gray-300" />

                            {/* DATE */}
                            <div className="flex mt-6 text-sm text-gray-500 flex items-center gap-2 justify-end">

                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span>
                                    {isToday
                                        ? `${t("phrasaleDate")} ${formattedTime}`
                                        : `${formattedDate} ${t("at")} ${formattedTime}`}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default ProductDetailsSection;

const Info = ({ label, value }) => {

    const [size, setSize] = useState(null)

    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (

        <div className="text-sm">

            <strong>{label}</strong>

            <div className="mt-1 text-gray-700 dark:text-gray-300 flex flex-wrap gap-2">

                {Array.isArray(value) ? (

                    value.map((item, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 border rounded border-gray-300 shadow-md ${size===item && "bg-green-400"}`}
                            oncClick={()=>setSize(item) }
                        >
                            {String(item).toLowerCase()}
                        </span>
                    ))

                ) : (

                    <span>{String(value).toLowerCase()}</span>

                )}

            </div>

        </div>

    );
};