import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessageNotif } from "../slices/chatSlice";
import WalletModal from "../features/WalletModal";
import ProfilPopPov from "../features/PopovProfile";
import { addToCart,updateSelectedProduct } from "../slices/cartSlice";
import { useTranslation } from 'react-i18next';
import { productViews } from "../utils";
import PrintNumberStars from "../components/SystemStar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import express_delivery from "../../src/assets/express-delivery_1981844.png"
import home_5657414 from "../../src/assets/home-address_12248895.png"
import pay_8331969 from "../../src/assets/pay_8331969.png" 
import RendrePrixProduitMonnaie from "../features/ConvertCurrency";
import TextParagraphs from "../components/TextToParagraph";


const getLogoTitlOperation = (t, prod) => {

    return (
        [
            { logo: express_delivery, title: t('delivery'), do: (prod?.delivery)?.toLowerCase()},
            { logo: home_5657414, title: t('adress'), do: (prod?.adress)?.toLowerCase() },
            { logo: pay_8331969, title: t('paymentMethod'), do: (prod?.paymentMethod)?.toLowerCase() }

        ]
    )
}


const ProductModal = ({ isOpen, onClose, products}) => {

    const { t } = useTranslation();

    const currentSelectedProductView = useSelector(state => state.cart.selectedProductView)

    const [hiddenShowDirection, setHiddenShowDirection] = useState(false);

    const currentUser = useSelector(state => state.auth.user)

    const indexOfCurrentProduct = useMemo(() => {

        if (!Array.isArray(products) || products.length === 0 || !currentSelectedProductView?.id) {

            return -1;
        }

        return products.findIndex(product => product?.id === currentSelectedProductView.id);

    }, [products, currentSelectedProductView]);

    const selectedUser = useSelector(state => state.chat.userSlected)

    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const dispatch = useDispatch();

    const [isProductAdd, setIsProductAdd] = useState(false);

    const [productNbViews, setProductNbViews] = useState(null);

    const buttonRef = useRef(null)

    const popovRef = useRef(null)

    const [showLeft, setShowLeft] = useState(true);

    const [showRight, setShowRight] = useState(true);

    useEffect(() => {

        if (!products || products.length <= 1 || !currentSelectedProductView) {
            setShowLeft(false);
            setShowRight(false);
            return;
        }

        const index = products.findIndex(p => p?.id === currentSelectedProductView?.id);

        setShowLeft(index > 0);

        setShowRight(index < products.length - 1);

    }, [products, currentSelectedProductView]);

    const scroll = useCallback((direction) => {

        if (indexOfCurrentProduct === -1 ) return;

        const nextIndex =  direction === "left" ? indexOfCurrentProduct - 1 : indexOfCurrentProduct + 1;

        // Vérifie que l'index est dans les limites du tableau
        if (nextIndex < 0 || nextIndex >= products.length) return;

        // Met à jour le produit sélectionné (logique métier)
        dispatch(updateSelectedProduct(products[nextIndex]));

    }, [dispatch, products, indexOfCurrentProduct]);

    useEffect(() => {

        if (isOpen) {
            setIsProductAdd(false);
            setHiddenShowDirection(false);
            productViews(currentSelectedProductView, setProductNbViews)
        }

    }, [currentSelectedProductView, isOpen]);

    useEffect(() => {
        // Vérifie si l'utilisateur actuel correspond à l'utilisateur sélectionné ou au fournisseur du produit
        const isCurrent = currentUser && (
            (selectedUser && currentUser.id === selectedUser.id) ||
            (currentSelectedProductView && currentUser.id === currentSelectedProductView.fournisseur)
        );

        setIsCurrentUser(!!isCurrent); // Convertit en booléen
    }, [currentUser, selectedUser, currentSelectedProductView]);

    // Sans paramètre, pour un appel manuel
    const handleAddToCart_ = () => {

        if (!currentSelectedProductView) return;

        dispatch(addToCart(currentSelectedProductView));

        setIsProductAdd(true);

        const dateAjout = new Date().toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        dispatch(

            addMessageNotif(`Produit ${currentSelectedProductView.code_reference} sélectionné le ${dateAjout}`)
        );
    };

    if (!isOpen || !currentSelectedProductView ) return null;

    return (

        <>

            {
                showLeft && !hiddenShowDirection && <button className="fixed z-50 absolute left-1 top-1/2 rounded-full px-3 cursor-pointer" onClick={() => scroll("left")}> <ChevronLeft className="w-6 h-6 text-gray-300 bg-gray-200 rounded-full hover:bg-white/80" /></button>
            }

            <div
                className="fixed inset-0 z-[100] shadow-full "
                role="dialog"
                aria-modal="true"
                ref={popovRef}
            >

                {/* ====== MODAL OVERLAY ====== */}
                <div
                    className="fixed inset-0 bg-gray-500/75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                    ref={buttonRef}
                >
                </div>

                {/* ====== CONTENT ====== */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 m-0 md:mx-15 md:my-1">

                    <main
                        className="relative flex flex-col md:flex-row items-stretch justify-center
                             h-full w-screen  bg-[var(--color-bg)] text-[var(--color-text)]
                             rounded-sm shadow-xl overflow-y-auto md:overflow-hidden mx-auto transition h-full 
                        "
                    >
                        {/* Contenu en grille : image + détails */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 w-full h-full">

                            {/* IMAGE */}
                            <div className=" col-span-1 md:col-span-6 flex items-center justify-center max-h-[40dvh] w-full md:max-h-full  md:h-full  md:w-full">

                                <img
                                    src={currentSelectedProductView?.image_product}
                                    alt="Product"
                                    className="w-full h-full object-contain flex justify-center item-center relative"
                                />

                            </div>

                            {/* DETAILS */}
                            <div className="col-span-1 md:col-span-6 flex-col items-center justify-between px-2 overflow-y-auto md:pb-0 scrollbor_hidden w-full h-full pt-[10dvh] md:pt-0">

                                {/*buttons top: close, add product, view user profil the component*/}
                                <div className="flex fixed lg:absolute right-0 z-50 bg-gray top-1.5 mb-3">

                                    <div className="hidden md:block me-5">

                                        <NavButtons
                                            isCurrentUser={isCurrentUser}
                                            handleAddToCart_={handleAddToCart_}
                                            isProductAdd={isProductAdd}
                                            setHiddenShowDirection={setHiddenShowDirection }
                                        />

                                    </div>

                                    <button

                                        type="button"

                                        onClick={onClose}

                                        className="fixed top-1 right-1 cursor-pointer z-20 rounded-full flex items-center justify-center px-2  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <span style={{ color: "#E5E7EB", fontSize: "20px" }}>✖</span>

                                    </button>


                                </div>

                                {/*main contain*/}
                                <div className=" flex flex-col gap-6 pt-20 pb-30">

                                    <div className="flex flex-col ">

                                        <h2 className="text-2xl font-bold  sm:pr-12">

                                            {currentSelectedProductView?.categorie_product}

                                        </h2>

                                        <h3 className="text-xl   sm:pr-12">

                                            {currentSelectedProductView?.name_product}

                                        </h3>

                                    </div>

                                    <section className="mt-2 ">


                                        <p className="text-xl ">
                                            {t("code_ref")}: {currentSelectedProductView?.code_reference}
                                        </p>

                                        <h2 className="text-2xl">
                                            <RendrePrixProduitMonnaie item={currentSelectedProductView} />
                                        </h2>

                                        <PrintNumberStars t={t} productNbViews={productNbViews} />

                                    </section>

                                    {/* Color Options */}
                                    <fieldset>

                                        {t("color_prod")}

                                        <legend className="text-sm font-medium ">

                                            {currentSelectedProductView?.color_prouct}

                                        </legend>

                                        <div className="mt-4 flex items-center gap-x-3">

                                            {[currentSelectedProductView?.image_product].map((color) => (

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

                                                                : "bg-black-900"

                                                            } checked:outline-2 checked:outline-offset-2 checked:outline-gray-400 focus-visible:outline-3 focus-visible:outline-offset-3`}

                                                        defaultChecked={color === "white"}
                                                    />

                                                </div>
                                            ))}

                                        </div>

                                    </fieldset>

                                    <div className="text-sm  my-2 h-[20dvh] overflow-y-auto scrollbor_hidden leading-relaxed whitespace-pre-line">

                                        <h1 className="text-xl">{t('description_prod')} </h1>

                                        <TextParagraphs text={currentSelectedProductView?.description_product?.toLowerCase()}/>

                                    </div>

                                    {/* SIZE / INFO GRID */}
                                    <fieldset>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                            {[
                                                { label: "Type", value: currentSelectedProductView?.type_choice },
                                                { label: "Quantité", value: currentSelectedProductView?.quantity_product },
                                                { label: "Taille", value: currentSelectedProductView?.taille_product },
                                                { label: "Opération", value: currentSelectedProductView?.operation_product },
                                                { label: "Catégorie", value: currentSelectedProductView?.categorie_product },
                                            ].map(
                                                (item, index) =>
                                                    item?.value && (
                                                        <div
                                                            key={index}
                                                            className="text-md  p-2 rounded-md"
                                                        >
                                                            <strong className="font-semibold">
                                                                {item.label}
                                                            </strong>

                                                            <div className="mt-1 text-gray-900 dark:text-gray-300">
                                                                {String(item.value)?.toLowerCase()}
                                                            </div>
                                                        </div>
                                                    )
                                            )}
                                        </div>

                                    </fieldset>


                                    <div className="border-0 overflow-x-auto w-full  scrollbor_hidden flex gap-2">

                                        {/*information complémentaire*/}
                                        <fieldset className="border-0 flex  gap-4 items-center text-sm text-gray-600 p-3 rounded-md  animate-scroll ">

                                            {
                                                getLogoTitlOperation(t, currentSelectedProductView).map((el, idx)=>

                                                    <span className="border-0 flex items-center gap-1 justify-center  whitespace-nowrap" key={idx}>

                                                        <span className="border-0 flex items-center gap-2 justify-center font-medium px-3">

                                                            <img className="rounded-sm border-0 " src={el?.logo} alt="" width="20" height="20"/>

                                                            <span>{el?.title}:</span>

                                                        </span>

                                                        <span>{el?.do}</span>

                                                    </span>
                                                )
                                            }

                                        </fieldset>

                                    </div>

                                </div>

                                {/*Buttons for phone resolution sm*/}
                                <div className="flex  gap-4 bg-white/80 absolute bottom-0 text-xs text-gray-500 mb-1 w-full flex justify-around fixed">

                                    <div className="flex flex-col justify-center items-center">

                                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5" />
                                        </svg>

                                        <fieldset>

                                            {(() => {

                                                const createdDate = new Date(currentSelectedProductView?.created);

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

                                    <div className="md:hidden">

                                        <NavButtons
                                            isCurrentUser={isCurrentUser}
                                            handleAddToCart_={handleAddToCart_}
                                            isProductAdd={isProductAdd}
                                            setHiddenShowDirection={setHiddenShowDirection}
                                        />

                                    </div>


                                </div>

                            </div>

                        </div>

                    </main>

                </div>

            </div>


            {
                showRight && !hiddenShowDirection && <button className="fixed z-50 absolute right-1 top-1/2 rounded-full px-3 cursor-pointer" onClick={() => scroll("right")}> <ChevronRight className="w-6 h-6 text-gray-300 bg-gray-200 hover:bg-white/80 rounded-full" /></button>
            }

        </>
    );
};

export default ProductModal;

const NavButtons = ({
    isProductAdd,
    handleAddToCart_,
    isCurrentUser,
    setHiddenShowDirection,
}) => {

    const { t } = useTranslation();

    return (

        <div className="flex items-center justify-between gap-4 w-full">

            {/* Add to cart */}
            {!isProductAdd && !isCurrentUser && (
                <button
                    onClick={handleAddToCart_}
                    title={t("add_in_basket")}
                    aria-label={t("add_in_basket")}
                    className="z-20 flex flex-col items-center gap-1 p-2 rounded-lg
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     text-gray-800 dark:text-gray-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <svg
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4
                             2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4
                             2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                        />
                    </svg>

                    <span className="text-sm whitespace-nowrap">
                        {t("add_in_basket")}
                    </span>

                </button>
            )}

            {/* Wallet */}
            {!isCurrentUser && (
                <WalletModal setHiddenShowDirection={setHiddenShowDirection} />
            )}

            {/* Profil popover */}
            <ProfilPopPov />

        </div>
    );
};

