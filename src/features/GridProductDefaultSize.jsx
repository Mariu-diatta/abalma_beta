import React, { useEffect, useState, useMemo } from "react";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import OwnerAvatar from "../components/OwnerProfil";
import { setCurrentNav } from "../slices/navigateSlice";
import {  addMessageNotif, addUser } from "../slices/chatSlice";
import ProductModal from "../pages/ProductViewsDetails";

const GridProductDefault = ({data}) => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const currentUser = useSelector((state) => state.auth.user);

    const [productData, setProductData] = useState(() => data.filter((product, _) => product.quantity_product!==0) || []);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);


    const addProductToCart = (product) => dispatch(addToCart(product));

    const cols = useMemo(() => {

        if (!Array.isArray(productData) || productData.length === 0) return [];

        return productData.reduce((acc, product, idx) => {
            const colIndex = Math.floor(idx / 3);
            if (!acc[colIndex]) acc[colIndex] = [];
            acc[colIndex].push(product);
            return acc;
        }, []);
    }, [productData]);

    const openModal = (e, product) => {
        e.preventDefault();
        setModalData(product);
    };

    const closeModal = () => setModalData(null);

    //update data
    useEffect(() => {setProductData(data)}, [data])

    useEffect(() => {
        const fetchProductsAndOwners = async () => {
            try {
                const { data: products } = await api.get("produits/");

                // Ne garder que les produits avec une quantité > 0
                const filteredProducts = products.filter(product => parseInt(product.quantity_product) !== 0);

                // Met à jour l'état avec les produits filtrés
                setProductData(filteredProducts);

                // Récupère les fournisseurs uniques
                const uniqueOwnerIds = [
                    ...new Set(filteredProducts.map(p => p.fournisseur).filter(Boolean))
                ];

                // Récupère les données des fournisseurs
                const responses = await Promise.all(
                    uniqueOwnerIds.map(id =>
                        api.get(`clients/${id}/`)
                            .then(res => ({ id, data: res.data }))
                            .catch(() => ({ id, data: null }))
                    )
                );

                // Crée une map { id: data } pour les fournisseurs valides
                const ownerMap = responses.reduce((acc, { id, data }) => {
                    if (data) acc[id] = data;
                    return acc;
                }, {});

                // Met à jour l'état des fournisseurs
                setOwners(ownerMap);

            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            }
        };

        fetchProductsAndOwners();
    }, []);


    return (
        <>
            {/* PRODUIT GRID */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mt-2">

                {cols.length > 0 && cols.flat().length > 0 && (

                    cols.map((products, colIdx) => (

                        <div key={colIdx} className="grid gap-4">

                            {products.map((product) => {

                                const isInCart = cartItems.some((p) => p.id === product.id);

                                const owner = owners[product.fournisseur];

                                return (
                                    <div
                                        key={product.id}
                                        className={`rounded-lg p-1 transition transform hover:-translate-y-1 ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            className="relative w-full block rounded-lg overflow-hidden"
                                            onClick={(e) => {

                                                dispatch(addUser(owners[product.fournisseur]))

                                                openModal(e, product);

                                            }}
                                            aria-label={`Voir le produit ${product.description_product}`}
                                        >
                                            <img
                                                src={product.image_product}
                                                alt={`Produit ${product.description_product}`}
                                                className="h-auto w-full rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                            />

                                        </button>

                                        <div className="flex justify-between items-center mt-2 mb-1">

                                            <OwnerAvatar owner={owner} />
                                            
                                            {
                                                product.quantity_product !== "1" && (
                                                    <span className="text-sm text-gray-700">
                                                        Quantité {product.quantity_product}
                                                    </span>
                                                )
                                            }

                                        </div>

                                        <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">

                                            {product.description_product}

                                        </p>

                                        <div className="flex justify-between items-center mt-1">

                                            <span className="text-blue-700 font-semibold text-sm">

                                                ${product?.price_product}

                                            </span>

                                            <div className="flex gap-2">

                                                <button
                                                    title="Ajouter au panier"
                                                    onClick={() => {
                                                        addProductToCart(product)
                                                        dispatch(addMessageNotif(`Produit ${product?.code_reference} crée le ${Date.now()}`))
                                                    }}
                                                    className="p-1 bg-green-100 rounded-full hover:bg-green-200"
                                                >
                                                    <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                                                    </svg>

                                                </button>

                                                {/*<button*/}
                                                {/*    title="Ajouter en cadeau"*/}
                                                {/*    onClick={() =>*/}
                                                {/*        alert(`Cadeau ajouté: ${product.description_product}`)*/}
                                                {/*    }*/}
                                                {/*    className="p-1 rounded-full border border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"*/}
                                                {/*>*/}
                                                {/*    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">*/}
                                                {/*        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.65692 9.41494h.01M7.27103 13h.01m7.67737 1.9156h.01M10.9999 17h.01m3.178-10.90671c-.8316.38094-1.8475.22903-2.5322-.45571-.3652-.36522-.5789-.82462-.6409-1.30001-.0574-.44-.0189-.98879.1833-1.39423-1.99351.20001-3.93304 1.06362-5.46025 2.59083-3.51472 3.51472-3.51472 9.21323 0 12.72793 3.51471 3.5147 9.21315 3.5147 12.72795 0 1.5601-1.5602 2.4278-3.5507 2.6028-5.5894-.2108.008-.6725.0223-.8328.0157-.635.0644-1.2926-.1466-1.779-.633-.3566-.3566-.5651-.8051-.6257-1.2692-.0561-.4293.0145-.87193.2117-1.26755-.1159.20735-.2619.40237-.4381.57865-1.0283 1.0282-2.6953 1.0282-3.7235 0-1.0282-1.02824-1.0282-2.69531 0-3.72352.0977-.09777.2013-.18625.3095-.26543" />*/}
                                                {/*    </svg>*/}

                                                {/*</button>*/}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))

                )}
            </div>

            <ProductModal isOpen={!!modalData} onClose={closeModal} dataProduct={modalData} />


            {
                !(cols.length > 0 && cols.flat().length > 0) &&
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center text-gray-500 text-lg">

                    <img
                        alt=""
                        src={currentUser?.image}
                        title={currentUser?.description}
                        className="h-30 w-30 rounded-full object-cover cursor-pointer ring-1 ring-gray-300 hover:ring-blue-500 transition mb-4"
                    />

                    <p className="mb-1">Aucun produit disponible.</p>

                    <div className="w-full h-px bg-gray-300" />

                        <button
                            onClick={() => dispatch(setCurrentNav("add_product")) }
                            title="Ajouter un nouveau produit"
                            className="mt-5 flex items-center justify-center rounded-full border border-gray-300 h-50 w-50 bg-white hover:bg-gray-100 transition">
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
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                clipRule="evenodd"
                            />

                        </svg>

                    </button>

                </div>
            }

        </>
    );
};

export default GridProductDefault;
