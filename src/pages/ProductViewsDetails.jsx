import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessageNotif } from "../slices/chatSlice";
import WalletModal from "../features/WalletModal";
import ProfilPopPov from "../features/PopovProfile";
import { addToCart,updateSelectedProduct } from "../slices/cartSlice";
import { useTranslation } from 'react-i18next';
import { productViews } from "../utils";
import RendrePrixProduitMonnaie from "../components/ConvertCurrency";
import PrintNumberStars from "../components/SystemStar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import express_delivery from "../../src/assets/express-delivery_1981844.png"
import home_5657414 from "../../src/assets/home-address_12248895.png"
import pay_8331969 from "../../src/assets/pay_8331969.png" 


const getLogoTitlOperation = (t, prod) => {

    return (
        [
            { logo: express_delivery, title: t('delivery'), do: (prod?.delivery).toLowerCase()},
            { logo: home_5657414, title: t('adress'), do: (prod?.adress).toLowerCase() },
            { logo: pay_8331969, title: t('paymentMethod'), do: (prod?.paymentMethod).toLowerCase() }

        ]
    )


}


const ProductModal = ({ isOpen, onClose, products}) => {

    const { t } = useTranslation();

    const currentSelectedProductView = useSelector(state => state.cart.selectedProductView)

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

    //const scrollRef = useRef(null);
    //const panelRef = useRef(null);

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

            productViews(currentSelectedProductView, setProductNbViews)
        }

    }, [currentSelectedProductView, isOpen]);


    useEffect(

        () => {

            var isCurrent_User = () => !(currentUser?.id === selectedUser?.id && currentUser?.email === selectedUser?.email)

            setIsCurrentUser(isCurrent_User)

        }, [currentUser?.id, selectedUser?.id, currentUser?.email, selectedUser?.email]

    )

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

    if (!isOpen || !currentSelectedProductView) return null;

    return (

        <>

            {
                showLeft && <button className="z-50 absolute left-6 top-1/2 rounded-full px-3 cursor-pointer" onClick={() => scroll("left")}> <ChevronLeft className="w-5 h-5 text-gray-300" /></button>
            }

            <div className="relative z-40" role="dialog" aria-modal="true" ref={popovRef}>
            
                <div
                    className="fixed inset-0 bg-gray-500/75 transition-opacity md:block"
                    aria-hidden="true"
                    onClick={onClose}
                    ref={buttonRef}
                >
                </div>

                <div className="fixed inset-0 z-40 w-screen overflow-y-auto">

                    <div

                        className="flex min-h-full items-stretch justify-center text-center 
                        items-center 
                        w-full transform text-left text-base transition 
                        md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl 
                        relative items-center m-auto justify-center"

                        style={
                            {
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text)"
                            }
                        }

                    >

                        <div className="flex gap-2 mb-5">

                            <div className="absolute bottom-0 left-2 mt-5 lg:mt-auto  lg:left-auto lg:right-12 lg:top-0 lg:bottom-auto md:top-1 md:bottom-auto flex items-between gap-1 ">

                                {
                                    (!isProductAdd) &&
                                    <button

                                        onClick={(e) => handleAddToCart_(e)}

                                        title="Ajouter au panier"

                                        className="z-20 cursor-pointer flex items-center justify-center p-3 rounded-full  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

                                        aria-label="Ajouter au panier"

                                    >
                                        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                        </svg>

                                    </button>
                                }

                                <WalletModal/>

                                {
                                    isCurrentUser &&

                                    <div
                                        title="Profil Produit Popov"

                                    className=" z-20 rounded-full "

                                        tabIndex={0}

                                        aria-label="Profil Produit Popov"

                                    >
                                        <ProfilPopPov/>

                                    </div>
                                }

                            </div>

                            <div className="fixed lg:absolute top-0 right-0 z-50">

                                <button

                                    type="button"

                                    onClick={onClose}

                                    className="cursor-pointer z-20 rounded-full flex items-center justify-center p-3  hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <svg
                                        className="z-0 size-10 lg:size-5"

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

                        <div className="relative gap-y-8  grid w-full grid-cols-1 items-start sm:grid-cols-12 lg:gap-x-1 mx-h-[100dvh]">

                            <div className="relative sm:col-span-6 lg:col-span-7 max-h-[100dvh]  flex items-center justify-center my-auto mx-auto overflow-auto scrollbor_hidden">
                                <img
                                    src={currentSelectedProductView?.image_product}
                                    alt="Product"
                                    className="max-w-full max-h-full object-contain items-center "
                                />
                            </div>

                            <div className="sm:col-span-6 lg:col-span-5 w-full h-full  lg:mt-6 lg:pt-2 p-2  mb-8 pb-8 gap-y-8 " >

                                <div className="flex flex-col ">

                                    <h2 className="text-2xl font-bold  sm:pr-12">

                                        {currentSelectedProductView?.categorie_product}

                                    </h2>

                                    <h3 className="text-xl   sm:pr-12">

                                        {currentSelectedProductView?.name_product}

                                    </h3>

                                </div>

                                <section className="mt-2 ">

                                    <p className="text-2xl 0">
                                        <RendrePrixProduitMonnaie item={currentSelectedProductView} />
                                    </p>

                                    <PrintNumberStars t={t} productNbViews={productNbViews} />

                                </section>

                                {/* Color Options */}
                                <fieldset>

                                    <legend className="text-sm font-medium ">

                                        {currentSelectedProductView?.color_prouct}

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

                                <h2 className="text-sm  mt-5 h-[42dvh] overflow-y-auto scrollbor_hidden ">

                                    {currentSelectedProductView?.description_product?.toLowerCase()}

                                </h2>

                                {/* Size Options */}
                                <fieldset className="mt-10">

                                    <div className="flex items-center justify-between">

                                        <div className="text-sm font-medium">

                                            {currentSelectedProductView?.color_prouct}

                                        </div>

                                    </div>

                                    <div className="z-0 mt-4 mb-2 sm:mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">

                                        {[
                                            { label: "Type", value: currentSelectedProductView?.type_choice },
                                            { label: "Quantité", value: currentSelectedProductView?.quantity_product },
                                            { label: "Taille", value: currentSelectedProductView?.taille_product },
                                            { label: "Opération", value: currentSelectedProductView?.operation_product },
                                            { label: "Catégorie", value: currentSelectedProductView?.categorie_product },

                                        ].map(({ label, value }, idx) => (

                                            label && value  && <label

                                                key={`${label}-${idx}`}

                                                htmlFor={`${label}-${value}`}

                                                className="relative overflow-x-auto scrollbor_hidden w-full group relative flex flex-col items-center justify-center border border-gray-300  rounded-md px-1 py-1 text-xs text-gray-800 hover:bg-gray-100 transition-all duration-150"
                                            >
                                                <input
                                                    type="radio"
                                                    name="productDetail"
                                                    id={`${label}-${value}`}
                                                    value={value}
                                                    className="absolute sr-only lowercase"
                                                />

                                                <span className="text-xs">{label.toLowerCase()}</span>

                                                <span className="text-xs">{value.toLowerCase() || "N/A"}</span>

                                            </label>
                                        ))}

                                    </div>

                                </fieldset>

                                <div className="overflow-x-auto w-full  scrollbor_hidden flex gap-2 ">
                                    {/*information complémentaire*/}
                                    <fieldset className="flex  gap-4 items-center text-sm text-gray-600 p-3 rounded-md shadow-sm animate-scroll">

                                        {
                                            getLogoTitlOperation(t, currentSelectedProductView).map((el, idx)=>

                                                <span className="flex items-center gap-1 justify-center  whitespace-nowrap" key={idx}>

                                                    <span className="flex items-center gap-2 justify-center font-medium px-3 text-gray-700">

                                                        <img className="rounded-sm " src={el?.logo} alt="" width="25" />

                                                        <span>{el?.title}:</span>

                                                    </span>

                                                    <span>{el?.do}</span>

                                                </span>
                                            )
                                        }

                                    </fieldset>


                                </div>

                                <fieldset className="absolute bottom-2 right-2 text-xs text-gray-500">

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

                        </div>

                    </div>

                </div>

            </div>


            {
                showRight && <button className="z-50 absolute right-6 top-1/2 rounded-full px-3 cursor-pointer" onClick={() => scroll("right")}> <ChevronRight className="w-5 h-5 text-gray-300" /></button>
            }
        </>
    );
};

export default ProductModal;