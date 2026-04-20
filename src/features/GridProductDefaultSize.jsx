import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
    addToCart,
    updateSelectedProduct
} from "../slices/cartSlice";

import {
    setCurrentNav,
    updateCategorySelected
} from "../slices/navigateSlice";

import {
    addMessageNotif,
    addUser
} from "../slices/chatSlice";

import OwnerAvatar from "../components/OwnerProfil";
import ProductDetailsSection from "../pages/ProductViewsDetails";
import LoadingCard from "../components/LoardingSpin";
import { useTranslation } from 'react-i18next';
import PrintNumberStars from "../components/SystemStar";
import ScrollingContent from "../components/ScrollContain";
import SearchBar from "../components/BtnSearchWithFilter";
import ProfilPictureView from "../components/ProfilPictureView";
import { removeAccents } from "../utils";

const GridProductDefault = ({ categorie_item }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cartItems = useSelector(state => state.cart.items);
    const currentUser = useSelector(state => state.auth.user);

    const [productData, setProductData] = useState([]);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const categorySelectedData = useSelector(state => state?.navigate?.categorySelectedOnSearch)

    // Open modal with product
    const openModal = (product) => {
        setModalData(product);
        dispatch(updateSelectedProduct(product));
    };

    const closeModal = () => setModalData(null);

    const shouldDisableSearch = useMemo(() => productData?.length <= 0, [productData]);

    // Group products into columns of 3
    const cols = useMemo(() => {

        const chunked = [];

        for (let i = 0; i < productData?.length; i += 3) {
            chunked.push(productData.slice(i, i + 3));
        }

        return chunked;

    }, [productData]);

    // Fetch products and owners
    const fetchProductsAndOwners = useCallback(async (category) => {

        setIsLoading(true);

        try {

            let cleanCategory = removeAccents(category)?.toLowerCase();

            const url = "products/filter/"

            const { data: products } = await api.get(url, {
                params: {
                    product_categorie: cleanCategory,
                },
            });
            const availableProducts = products.filter(p => parseInt(p.quantity_product) !== 0);

            setProductData(availableProducts);

            const uniqueOwnerIds = [...new Set(products.map(p => p?.fournisseur?.id))]
                .filter(id => id != null);

            const responses = await Promise.all(

                uniqueOwnerIds.map(id =>

                    api.get(`clients/${id}/`)

                        .then(res => ({ id, data: res.data }))

                        .catch(() => ({ id, data: null }))
                )
            );

            const ownerMap = responses.reduce((acc, { id, data }) => {

                if (data) acc[id] = data;

                return acc;

            }, {});

            setOwners(ownerMap);

            dispatch(updateCategorySelected(category));

        } catch (error) {
            //    console.error("Erreur de chargement des produits :", error);
        } finally {

            setIsLoading(false);
        }

    }, [dispatch]);

    const productDataColsLenght = (productData?.length > 0 && cols?.length > 0)

    const isCurrentUserConnected = (currentUser && currentUser?.is_connected)

    // Fetch on category change
    useEffect(() => {

        fetchProductsAndOwners(categorie_item);

    }, [fetchProductsAndOwners, categorie_item]);

    // Fetch on search
    useEffect(() => {

        if (categorySelectedData) {

            fetchProductsAndOwners(categorySelectedData);
        }

    }, [fetchProductsAndOwners, categorySelectedData]);

    const VariantSlider = ({ variants = [] }) => {
        const [index, setIndex] = useState(0);

        useEffect(() => {
            if (!variants.length) return;

            const interval = setInterval(() => {
                setIndex(prev => (prev + 1) % variants.length);
            }, 2500);

            return () => clearInterval(interval);
        }, [variants.length]);

        if (!variants.length) return null;

        return (
            <img
                src={variants[index]?.image}
                alt="variant"
                loading="lazy"
                className="h-auto w-full rounded-lg transition duration-500 ease-in-out hover:brightness-75 hover:grayscale"
            />
        );
    };

    return (

        <div className="py-3 justify-center items-center my-6">

            {
                isCurrentUserConnected &&

                <div className={`${cols?.length <= 4 ? "hidden" : ""} md:w-1/2 flex m-auto justify-center  my-1`}>

                    <SearchBar
                        disabled={shouldDisableSearch}
                    />

                </div>
            }

            {
                isLoading ?
                    (
                        <LoadingCard />
                    )
                    :
                    productDataColsLenght ?
                        (

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2 w-full mx-auto justify-items-center">

                                {
                                    cols?.map((products, colIdx) => (

                                    <div key={colIdx} className="flex flex-col items-center gap-3">

                                        {
                                            products?.map(product => 

                                                {
                                                    const isInCart = cartItems?.some(p => p.id === product.id);

                                                    const owner = owners[product.fournisseur];

                                                    const prodQutySupZero = product?.quantity_product !== "0"

                                                    return(

                                                        <div
                                                            key={product?.id}
                                                            className={`w-[50dvw] md:w-50 mx-auto min-h-auto rounded-lg transition transform hover:-translate-y-1 ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                                                                }`}
                                                        >
                                                            <div className="relative w-full block rounded-lg overflow-hidden">
                                                                <VariantSlider variants={product?.variants || []} />
                                                            </div>
                                                            <div className="p-1">

                                                                <div className="flex justify-between items-center mb-1">

                                                                    <OwnerAvatar owner={owner} />

                                                                    {prodQutySupZero && (
                                                                        <span className="text-xs text-gray-600">
                                                                            {t("quantity")} {product?.quantity_product}
                                                                        </span>
                                                                    )}

                                                                </div>

                                                                <PrintNumberStars productNbViews={product?.view_count} t={t} />

                                                                <p className="text-xs truncate mb-1 md:text-sm">
                                                                    {product?.description_product}
                                                                </p>

                                                                <div className="whitespace-nowrap flex text-xs gap-1 md:hidden dark:bg-white-100 p-1 rounded-lg">
                                                                    <p>{t('quantity_sold')}</p>{product?.quantity_product_sold}
                                                                </div>

                                                                <div className="flex justify-between items-center">

                                                                    <ScrollingContent
                                                                        item={product}
                                                                        t={t}
                                                                        qut_sold={product?.quatity_sold}
                                                                    />

                                                                    <button
                                                                        title="Ajouter au panier"
                                                                        onClick={() => {
                                                                            dispatch(addToCart(product));
                                                                            dispatch(
                                                                                addMessageNotif(
                                                                                    `Produit ${product?.code_reference} sélectionné le ${Date.now()}`
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="cursor-pointer p-1 rounded-full hover:bg-green-100 transition"
                                                                    >
                                                                        <svg
                                                                            className="w-8 h-6 text-gray-800 dark:text-white border-1 rounded-lg"
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
                                                    )
                                                }
                                            )
                                        }

                                    </div>

                                    ))
                                }

                            </div>

                        )
                        :
                        (
                            <ProfilPictureView currentUser={currentUser}>

                                <button
                                    onClick={() => {
                                        dispatch(setCurrentNav("add-product"));
                                        navigate("/add-product");
                                    }}
                                    title="Ajouter un nouveau produit"
                                    className="mt-5 flex items-center justify-center rounded-md  border border-gray-100 h-30 w-30 bg-white hover:bg-gray-100 transition"
                                >

                                    <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>

                                </button>

                            </ProfilPictureView>
                        )
            }

            <ProductDetailsSection
                isOpen={!!modalData}
                onClose={closeModal}
            />

        </div>
    );
};

export default GridProductDefault;
