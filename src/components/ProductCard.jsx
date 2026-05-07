import React, { useEffect, useState, useRef, lazy } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Eye } from "lucide-react"; // Utilisation de Lucide pour plus de finesse
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
                group relative flex flex-col w-full bg-white 
                rounded-2xl border border-gray-100 overflow-hidden
                transition-all duration-300 hover:shadow-2xl hover:border-blue-100
                ${isInCart ? "opacity-75 grayscale-[0.5]" : ""}
            `}
        >
            {/* Zone Image */}
            <div
                onClick={() => openModal(item)}
                className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer bg-gray-50"
            >
                {/* Effet de fond flouté (Amélioré) */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110 transition-transform duration-700 group-hover:scale-125"
                    style={{ backgroundImage: `url(${currentImage})` }}
                />

                {/* Badge Quantité (Top Left) */}
                {item?.quantity_product > 0 && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-full shadow-sm text-gray-700 border border-white/50">
                            {item.quantity_product} {t("disponible")}
                        </span>
                    </div>
                )}

                {/* Image Principale */}
                <div className="relative z-10 w-50 h-50 flex items-center justify-center p-2">
                    <img
                        src={currentImage}
                        alt={item?.name_product}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Overlay Action Rapide (Mobile friendly) */}
                <div className="w-10 h-10 rounded-full absolute bg-white inset-x-0 bottom-0 p-4 m-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent z-20 hidden md:block">
                    <button className="w-full h-full bg-none backdrop-blur shadow-xl py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-gray-800">
                        <Eye size={14} />
                    </button>
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

                {/* Prix & Panier */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            {t("prix_unitaire")}
                        </span>
                        <div className="text-blue-600 font-black text-lg">
                            <ScrollingContent item={item} t={t} qut_sold={item?.quantity_product_sold} />
                        </div>
                    </div>

                    <button
                        disabled={isInCart}
                        onClick={handleAddToCart}
                        className={`
                            p-3 rounded-xl transition-all duration-300
                            ${isInCart
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-[#2563EB] text-white shadow-lg shadow-blue-200 hover:bg-[#1D4ED8] hover:scale-110 active:scale-95"
                            }
                        `}
                    >
                        <ShoppingCart size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;