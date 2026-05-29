import React, { useEffect, useState, useRef, lazy } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Eye } from "lucide-react"; // Utilisation de Lucide pour plus de finesse
import OwnerAvatar from "./OwnerProfil";
import ScrollingContent from "./ScrollContain";
import { addMessageNotif } from "../slices/chatSlice";
import { addToCart } from "../slices/cartSlice";

const PrintNumberStars = lazy(() => import("./SystemStar"));

const ProductCard = ({ item, isInCart, owner, openModal}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const variantProduct = item?.variants ;
    const nberVariants = variantProduct.length;
    const imageIndexRef = useRef(0);
    const [currentImage, setCurrentImage] = useState(variantProduct[0]?.image);

    // Diaporama automatique fluide
    useEffect(() => {
        if (nberVariants <= 1) return;
        const interval = setInterval(() => {
            imageIndexRef.current = (imageIndexRef.current + 1) % nberVariants;
            setCurrentImage(variantProduct[imageIndexRef.current]?.image);
        }, 3500);
        return () => clearInterval(interval);
    }, [nberVariants, variantProduct]);

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Évite d'ouvrir la modal en cliquant sur le panier
        dispatch(addToCart(item));
        dispatch(addMessageNotif(`Produit ${item?.code_reference} ajouté !`));
    };

    return (
        <div
            className={`
                group relative flex flex-col bg-white 
                rounded-2xl border border-gray-100 overflow-hidden
                transition-all duration-300 hover:shadow-2xl hover:border-blue-100 h-full w-full md:max-w-[30vw] 
                ${isInCart ? "opacity-75 grayscale-[0.5]" : ""}
            `}
        >
            {/* Image & Modal Trigger */}
            <div className="relative group"> {/* Ajout de group pour l'overlay hover */}

                {/* Badge Quantité */}
                {item?.quantity_product > 0 && (

                    <div className="absolute top-3 left-3 z-20">

                        <p className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-full shadow-sm text-yellow-700 border border-white/50 ">
                            {item.quantity_product} {t("disponible")}
                        </p>

                    </div>
                )}

                <div
                    onClick={() => openModal(item)}
                    className="
                        relative
                        w-full
                        h-auto
                        aspect-[4/5]
                        overflow-hidden
                        rounded-lg
                        cursor-pointer
                        bg-gray-100
                        shadow-md
                        hover:shadow-xl
                        transition-all
                        duration-300
                        /* ACTIONS POUR CENTRER : */
                        flex
                        items-center
                        justify-center
                    "
                >
                    {/* Image de fond floutée */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-sm scale-110 opacity-40 transition-transform duration-500"
                        style={{ backgroundImage: `url(${currentImage})` }}
                    />

                    {/* Image principale du produit centrée */}
                    <img
                        src={currentImage}
                        alt={item?.name_product || "Produit"}
                        loading="lazy"
                        className="
                            relative
                            z-10
                            /* TAILLE INTELLIGENTE : */
                            max-w-full 
                            w-auto
                            h-auto
                            object-contain /* Important pour ne pas déformer */
                            transition-transform
                            duration-300
                            ease-in-out
                            group-hover:scale-110
                        "
                        onError={(e) => {
                            if (!e.target.src.includes("default-product.jpg")) {
                                e.target.src = "/default-product.jpg";
                            }
                        }}
                    />

                    {/* Overlay Action Rapide */}
                    <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-20 hidden md:flex">
                        <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center justify-center gap-2 text-gray-800 hover:bg-white">
                            <Eye size={16} />
                            <span>{t("voir_details")}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Infos Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Vendeur & Stars */}
                <div className="flex justify-between items-start mb-2">
                    <OwnerAvatar owner={owner} />
                    <div className="scale-90 origin-right">
                        <PrintNumberStars productNbViews={item?.view_count} t={t} />
                    </div>
                </div>

                {/* Nom & Description */}
                <div className="flex-grow">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
                        {item?.name_product || "Sans nom"}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {item?.description_product?.toLowerCase()}
                    </p>
                </div>

                {/* Prix & Boutons */}
                <div className="flex justify-between items-center">

                    <ScrollingContent item={item} t={t} qut_sold={item?.quantity_product_sold} />

                    <button

                        title="Ajouter au panier"

                        onClick={(e) => handleAddToCart(e) }

                        aria-disabled="true"

                        className="whitespace-nowrap flex flex-row gap-2 cursor-pointer p-1 rounded-full hover:bg-green-100 transition"
                    >  
                        <svg
                            className="w-8 h-6 text-gray-800 dark:text-white border border-green-200 rounded-lg"
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
    );
};

export default ProductCard;