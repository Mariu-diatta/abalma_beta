import React, { useState } from 'react';
import { addToCart } from '../slices/cartSlice'
import { useDispatch } from 'react-redux'
import ProfilPopPov from './PopovProfile';
import WalletModal from './WalletModal';
import { addMessageNotif } from '../slices/chatSlice';


const HorizontalCard = ({ children, item }) => {
    const dispatch = useDispatch()
    const [isProductAdd, setIsProductAdd] = useState(false);
    const [showActions, setShowActions] = useState(false);

    return (
        <section className="relative flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-1 transition hover:shadow-lg">

            {/* Bouton toggle visible uniquement petits écrans */}
            <button
                onClick={() => setShowActions(prev => !prev)}
                className="
                    absolute bottom-3 right-3 
                    p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                    z-0 text-xl
                    lg:hidden
                "
                title={showActions ? "Cacher les actions" : "Afficher les actions"}
            >
                ...
            </button>

            {/* Actions pour petits écrans, affichées seulement si showActions = true */}
            {showActions && (
                <div className="
                    absolute bottom-14 left-3 
                    flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3
                    z-10
                    lg:hidden
                ">
                    {/* Bouton Panier */}
                    {
                        !isProductAdd &&
                        <button
                            onClick={() => {
                                dispatch(addToCart(item))
                                setIsProductAdd(true)
                                dispatch(addMessageNotif(`Produit ${item?.code_reference} sélectionné le ${Date.now()}`))
                            }}
                            title="Ajouter au panier"
                            className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            🛒
                        </button>
                    }

                    {/* Bouton Paiement */}
                    <WalletModal>
                        <button
                            title="Payer"
                            className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            💳
                        </button>
                    </WalletModal>

                    {/* Profil */}
                    <div
                        title="Produit popov"
                        className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        <ProfilPopPov />
                    </div>
                </div>
            )}

            {/* Actions visibles uniquement grands écrans */}
            <div className="
                hidden lg:absolute lg:flex lg:top-3 lg:right-3 lg:flex-wrap lg:flex-nowrap lg:items-center lg:gap-2 lg:gap-3
            ">
                {/* Bouton Panier */}
                {
                    !isProductAdd &&
                    <button
                        onClick={() => {
                            dispatch(addToCart(item))
                            setIsProductAdd(true)
                            dispatch(addMessageNotif(`Produit ${item?.code_reference} sélectionné le ${Date.now()}`))
                        }}
                        title="Ajouter au panier"
                        className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        🛒
                    </button>
                }

                {/* Bouton Paiement */}
                <WalletModal>
                    <button
                        title="Payer"
                        className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        💳
                    </button>
                </WalletModal>

                {/* Profil */}
                <div
                    title="Produit popov"
                    className="p-2 sm:p-2.5 md:p-3 text-sm sm:text-base rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    <ProfilPopPov />
                </div>
            </div>

            {/* Image ou contenu glissé */}
            <div className="w-full md:w-1/2 mb-4 md:mb-0 z-0">
                {children}
            </div>

            <div className="w-full md:w-1/2 px-4 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                    {item?.description_product}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                    Catégorie : {item?.categorie_product} <br />
                    Taille : {item?.taille_product} <br />
                    Couleur : {item?.color_product} <br />
                    Quantité : {item?.quantity_product} <br />
                    Type : {item?.type_choice} <br />
                    Référence : {item?.code_reference} <br />
                    Opération : {item?.operation_product} <br />
                    date emprunt : {item?.date_emprunt} <br />
                    date fin d'emprunt : {item?.date_fin_emprunt}
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                    {item?.price_product} {item?.Currency_price}
                </p>
            </div>

        </section>
    );
};

export default HorizontalCard;
