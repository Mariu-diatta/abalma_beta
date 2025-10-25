import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/Axios";
import { useDispatch, useSelector} from "react-redux";
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
import ProductModal from "../pages/ProductViewsDetails";
import LoadingCard from "../components/LoardingSpin";
import { useTranslation } from 'react-i18next';
import PrintNumberStars from "../components/SystemStar";
import ScrollingContent from "../components/ScrollContain";
import SearchBar from "../components/BtnSearchWithFilter";
import ProfilPictureView from "../components/ProfilPictureView";

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

        for (let i = 0; i < productData.length; i += 3) {
            chunked.push(productData.slice(i, i + 3));
        }

        return chunked;

    }, [productData]);

    // Fetch products and owners
    const fetchProductsAndOwners = useCallback(async (category) => {

        setIsLoading(true);

        try {

            const { data: products } = await api.get(`/products/filter/?categorie_product=${category}`);

            const availableProducts = products.filter(p => parseInt(p.quantity_product) !== 0);

            setProductData(availableProducts);

            const ownerIds = [...new Set(availableProducts.map(p => p.fournisseur).filter(Boolean))];

            const responses = await Promise.all(ownerIds.map(id =>
                api.get(`clients/${id}/`)
                    .then(res => ({ id, data: res.data }))
                    .catch(() => ({ id, data: null }))
            ));

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

    return (

        <div className="py-1 justify-center">

            {
                (currentUser && currentUser?.is_connected) &&

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
                    (productData?.length > 0 && cols?.length > 0) ?
                    (

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 mt-2 w-[100dvw] md:w-auto mx-auto overflow-x-hidden">

                        {
                            cols?.map(

                                (products, colIdx) => (

                                    <div key={colIdx} className="grid gap-1">

                                        {
                                            products.map(

                                                product => {

                                                    const isInCart = cartItems.some(p => p.id === product.id);

                                                    const owner = owners[product.fournisseur];

                                                    return (

                                                        <div
                                                            key={product?.id}
                                                            className={`w-[50dvw] md:w-50 min-h-50 rounded-lg  transition transform hover:-translate-y-1 ${isInCart
                                                                    ? "opacity-50 pointer-events-none bg-gray-100"
                                                                    : "bg-white"
                                                                }`}
                                                            style={{
                                                                backgroundColor: "var(--color-bg)",
                                                                color: "var(--color-text)"
                                                            }}
                                                        >
                                                            <div
                                                                className="relative w-full block rounded-lg overflow-hidden"
                                                                aria-label={`Voir le produit ${product?.product_name}`}
                                                            >
                                                                <img
                                                                    src={product.image_product}
                                                                    alt={"alt_prod"}
                                                                    onClick={() => {
                                                                        openModal(product);
                                                                        dispatch(addUser(owner));
                                                                    }}
                                                                    loading="lazy"
                                                                    className="h-auto w-full rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                                                />
                                                            </div>

                                                            <div className="p-1">

                                                                <div className="flex justify-between items-center mb-1">

                                                                    <OwnerAvatar owner={owner} />

                                                                    {product?.quantity_product !== "0" && (
                                                                        <span className="text-xs text-gray-600">
                                                                            {t("quantity")} {product?.quantity_product}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <PrintNumberStars productNbViews={product?.total_views} t={t} />

                                                                <p className="text-xs truncate mb-1 md:text-sm">
                                                                    {product?.description_product}
                                                                </p>

                                                                <div className="whitespace-nowrap flex text-xs gap-1 md:hidden dark:bg-white-100 p-1 rounded-lg">
                                                                    <p>{t('quantity_sold')}</p>{product?.quatity_sold}
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
                                                    );
                                                }
                                            )
                                        }

                                    </div>
                                )
                            )
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
                                className="mt-5 flex items-center justify-center rounded-md shadow-lg border border-gray-300 h-20 w-20 bg-white hover:bg-gray-100 transition"
                            >
                                <svg
                                    className="text-gray-800 dark:text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                    />
                                </svg>

                            </button>

                        </ProfilPictureView>
                    )
            }

            <ProductModal
                isOpen={!!modalData}
                onClose={closeModal}
                dataProduct={productData}
            />

        </div>
    );
};

export default GridProductDefault;
