import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { addMessageNotif } from "../slices/chatSlice";

import ProfilPopPov from "./PopovProfile";
import WalletModal from "./WalletModal";

const HorizontalCard = ({ children, item }) => {
    const dispatch = useDispatch();

    const [isProductAdd, setIsProductAdd] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const handleAddToCart = () => {
        dispatch(addToCart(item));
        setIsProductAdd(true);
        dispatch(
            addMessageNotif(
                `Produit ${item?.code_reference} sélectionné le ${new Date().toLocaleString()}`
            )
        );
    };

    return (
        <section className="overflow-y-auto p-0 relative flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-0 transition hover:shadow-lg">
            {/* Toggle button petits écrans */}
            <button
                onClick={() => setShowActions((prev) => !prev)}
                className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={showActions ? "Cacher les actions" : "Afficher les actions"}
            >
                {showActions ? "✕" : "☰"}
            </button>

            {/* Actions petits écrans */}
            {showActions && (

                <div className="absolute bottom-14 right-3 bottom-3 z-10 flex flex-wrap items-center gap-3 lg:hidden bg-gray-50 dark:bg-gray-900 rounded-lg p-2 shadow-md">

                    {!isProductAdd && (
                        <button
                            onClick={handleAddToCart}
                            title="Ajouter au panier"
                            className="flex items-center justify-center p-3 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Ajouter au panier"
                        >
                            🛒
                        </button>
                    )}

                    <WalletModal>
                        <button
                            title="Payer"
                            className="flex items-center justify-center p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Payer"
                        >
                            💳
                        </button>
                    </WalletModal>

                    <div className="md:relative md:right-3 z-10 top:2 flex justify-center">
                     
                            <ProfilPopPov />
                       
                    </div>

                </div>
            )}

            {/* Actions grands écrans */}
            <div className="hidden z-10 lg:absolute lg:flex lg:top-3 lg:right-3 lg:flex-wrap lg:items-center lg:gap-3">
                {!isProductAdd && (
                    <button
                        onClick={handleAddToCart}
                        title="Ajouter au panier"
                        className="flex items-center justify-center p-3 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Ajouter au panier"
                    >
                        🛒
                    </button>
                )}

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
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus-within:ring-2 focus-within:ring-blue-500"
                    tabIndex={0}
                    aria-label="Profil Produit Popov"
                >
                    <ProfilPopPov />
                </div>
            </div>

            {/* Image / contenu */}
            <div className="w-full md:w-1/2 mb-4 md:mb-0 z-0">{children}</div>

            {/* Détails produit */}
            <div className="w-full md:w-1/2 px-2 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md relative text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {item?.description_product}
                </h2>

                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    <InfoLine emoji="📂" label="Catégorie" value={item?.categorie_product} />
                    <InfoLine emoji="📏" label="Taille" value={item?.taille_product} />
                    <InfoLine emoji="🎨" label="Couleur" value={item?.color_product} />
                    <InfoLine emoji="📦" label="Quantité" value={item?.quantity_product} />
                    <InfoLine emoji="🏷️" label="Type" value={item?.type_choice} />
                    <InfoLine emoji="🔖" label="Référence" value={item?.code_reference} />
                    <InfoLine emoji="⚙️" label="Opération" value={item?.operation_product} />
                    {item?.date_emprunt && (
                        <InfoLine emoji="📅" label="Date emprunt" value={item?.date_emprunt} />
                    )}
                    {item?.date_fin_emprunt && (
                        <InfoLine emoji="⏰" label="Date fin d'emprunt" value={item?.date_fin_emprunt} />
                    )}
                </div>

                <div className="mt-2 bg-green-600 dark:bg-green-500 text-white text-lg sm:text-xl font-extrabold px-4 py-2 rounded-lg shadow-lg">
                    {item?.price_product} {item?.Currency_price}
                </div>
            </div>
        </section>
    );
};

const InfoLine = ({ emoji, label, value }) => (
    <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <strong className="w-28">{label} :</strong> <span>{value}</span>
    </div>
);

export default HorizontalCard;
