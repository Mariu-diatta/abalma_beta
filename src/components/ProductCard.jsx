import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import OwnerAvatar from "./OwnerProfil";
import ScrollingContent from "./ScrollContain";
import { useTranslation } from 'react-i18next';
import { addMessageNotif, addUser } from "../slices/chatSlice";
import { addToCart } from "../slices/cartSlice";
import { useRef } from "react";

// Import lazy du composant
const PrintNumberStars = React.lazy(() => import("./SystemStar"));


const ProductCard = ({
    item,
    isInCart,
    owner,
    openModal,
    owners,

}) => {


    const dispatch = useDispatch();

    const quantityProduct = (item?.quantity_product !== "0")

    const { t } = useTranslation();

    const variantProduct = item?.variants

    const nberVariants = variantProduct.length

    const imageIndexRef = useRef(0)

    const [currentImage, setCurrentImage] = useState(
        variantProduct[0]?.image
    )

    useEffect(() => {

        if (nberVariants <= 1) return

        const interval = setInterval(() => {

            imageIndexRef.current =
                (imageIndexRef.current + 1) % nberVariants

            setCurrentImage(
                variantProduct[imageIndexRef.current]?.image
            )

        }, 3000)

        return () => clearInterval(interval)

    }, [nberVariants, variantProduct])


    return (

        <div
            className={`
                rounded-lg
                w-auto md:max-w-100 
                shadow-xs transition transform
                hover:-translate-y-1 hover:shadow-lg
                ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
            }`}
        >
            {/* Image & Modal Trigger */}

            <div
                onClick={() => {
                    openModal(item);
                    dispatch(addUser(owners[item?.fournisseur]));
                }}
                className="
                    relative
                    w-full
                    aspect-[4/5]
                    overflow-hidden
                    rounded-xl
                    cursor-pointer
                    bg-gray-100
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    duration-300
                    group
                "
            >

                {/* 🔥 BACKGROUND (remplit tout) */}
                <div
                    className="
                        absolute inset-0
                        bg-cover bg-center
                        blur-2xl
                        scale-110
                        opacity-40
                    "
                    style={{ backgroundImage: `url(${currentImage})` }}
                />

                {/* 🔥 IMAGE PRINCIPALE (100% visible) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                    <img
                        src={currentImage}
                        alt={item?.name_product || "Produit"}
                        loading="lazy"
                        className="
                            max-w-full
                            max-h-full
                            object-contain
                            transition-transform
                            duration-500
                            group-hover:scale-105
                        "
                        onError={(e) => {
                            if (!e.target.src.includes("default-product.jpg")) {
                                e.target.src = "/default-product.jpg";
                            }
                        }}
                    />
                </div>

            </div>

            {/* Infos Produit */}
            <div className="p-1">

                {/* Avatar & Quantité */}
                <div className="flex justify-between items-center mb-1">

                    <OwnerAvatar owner={owner}/>

                    {
                        quantityProduct &&
                        (
                            <span className="text-xs text-gray-600 bg-gray-100 p-1 rounded-lg">

                                {t("quantity")} {item?.quantity_product}

                            </span>
                        )
                    }

                </div>

                {/* Étoiles & Reviews */}
                <PrintNumberStars productNbViews={item?.view_count} t={t} />

                {/* Description */}
                <p className="text-xs text-start truncate mb-1 md:text-sm whitespace-nowrap overflow-y-auto w-full scrollbor_hidden px-2">
                    {item?.description_product.toLowerCase()}
                </p>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center w-full">

                    <ScrollingContent item={item} t={t} qut_sold={item?.quantity_product_sold} />

                    <div className="flex gap-2">

                        <button

                            title="Ajouter au panier"

                            onClick={
                                () => {

                                    dispatch(

                                        addToCart(item)

                                    );

                                    dispatch(

                                        addMessageNotif(

                                            `Produit ${item?.code_reference} sélectionné le ${Date.now()}`
                                        )
                                    );
                                }}

                            aria-disabled="true"

                            className="cursor-pointer p-1 rounded-full hover:bg-green-100 transition"
                        >
                            <svg
                                className="w-8 h-6 text-gray-800 dark:text-white border-1 rounded-lg"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                                />
                            </svg>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductCard;

