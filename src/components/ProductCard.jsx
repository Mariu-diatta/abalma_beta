import { useDispatch } from "react-redux";
import OwnerAvatar from "./OwnerProfil";
import ScrollingContent from "./ScrollContain";
import { useTranslation } from 'react-i18next';
import { addMessageNotif, addUser } from "../slices/chatSlice";
import { addToCart } from "../slices/cartSlice";
import React from "react";

// Import lazy du composant
const PrintNumberStars = React.lazy(() => import("./SystemStar"));


const ProductCard = ({
    item,
    qut_sold,
    isInCart,
    owner,
    openModal,
    owners,
    id

}) => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (

        <div

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}

            className={`var(--color-text) var(--color-bg) rounded-lg shadow-xs transition transform hover:-translate-y-1 hover:shadow-lg ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                }`}
        >

            {/* Image & Modal Trigger */}
            <div>

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
                        rounded-lg
                        cursor-pointer
                        bg-gray-100
                    "
                >
                    <img
                        src={item?.image_product}
                        alt={item?.name_product}
                        loading="lazy"
                        className="
                          w-full
                          h-full
                          object-cover
                          object-center
                          transition
                          duration-300
                          ease-in-out
                          hover:scale-105
                        cursor-pointer

                          hover:brightness-90
                        "
                        onClick={() => {
                            openModal(item);
                            dispatch(addUser(owners[item?.fournisseur]));
                        }}
                        onError={(e) => {
                            if (e.target.src !== window.location.origin + "/default-product.jpg") {
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

                    <OwnerAvatar owner={owner} />

                    {
                        (item?.quantity_product !== "0") &&
                        (
                            <span className="text-xs text-gray-600">

                                {t("quantity")} {item?.quantity_product}

                            </span>
                        )
                    }

                </div>


                {/* Étoiles & Reviews */}
                <PrintNumberStars productNbViews={item?.total_views} t={t} />


                {/* Description */}
                <p className="text-xs text-start truncate mb-1 md:text-sm whitespace-nowrap overflow-y-auto w-full scrollbor_hidden ">
                    {item?.description_product.toLowerCase()}
                </p>

                <div className="whitespace-nowrap flex text-xs gap-1 md:hidden bg-grey-200 text-green dark:bg-white-100 my-auto w-auto p-1 rounded-lg"><p>{t('quantity_sold')}</p>{qut_sold} </div>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center">

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
