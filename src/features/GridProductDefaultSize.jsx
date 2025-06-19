import React, { useEffect, useState, useMemo } from "react";
import GridSlideProduct from "./GridProductSlide";
import HorizontalCard from "./HorizontalCard";
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

    const [productData, setProductData] = useState(data || []);
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
                setProductData(products);

                const uniqueOwnerIds = [...new Set(products.map(p => p.fournisseur))].filter(Boolean);
                const responses = await Promise.all(
                    uniqueOwnerIds.map(id =>
                        api.get(`clients/${id}/`).then(res => ({ id, data: res.data })).catch(() => ({ id, data: null }))
                    )
                );

                const ownerMap = responses.reduce((acc, { id, data }) => {
                    if (data) acc[id] = data;
                    return acc;
                }, {});

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
                                            {owner?.image
                                                &&
                                                <OwnerAvatar owner={owner} />
                                            }
                                            {product.quantity_product !== "1" && (
                                                <span className="text-sm text-gray-700">
                                                    Quantité {product.quantity_product}
                                                </span>
                                            )}
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
                                                    🛒
                                                </button>
                                                <button
                                                    title="Ajouter en cadeau"
                                                    onClick={() =>
                                                        alert(`Cadeau ajouté: ${product.description_product}`)
                                                    }
                                                    className="p-1 bg-yellow-100 rounded-full hover:bg-yellow-200"
                                                >
                                                    🎁
                                                </button>
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

            {/* MODAL */}
            {
                //modalData && (
                //<div
                //    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm  sm:px-1"
                //    onClick={closeModal}
                //    role="dialog"
                //    aria-modal="true"
                //    data-modal-backdrop="static"
                //>
                //    <div
                //        onClick={(e) => e.stopPropagation()}
                //        className="w-full m-0 p-0 max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl  animate-fade-in-up"
                //    >
                //        <HorizontalCard
                //            item={modalData}
                //        >
                //            <GridSlideProduct srcs={[modalData.image_product]} />

                //        </HorizontalCard>
                //    </div>
                //</div>
                //)
            }

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
