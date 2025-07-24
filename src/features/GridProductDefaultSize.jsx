import React, { useEffect, useState, useMemo, useCallback } from "react";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import OwnerAvatar from "../components/OwnerProfil";
import { setCurrentNav } from "../slices/navigateSlice";
import { addMessageNotif, addUser } from "../slices/chatSlice";
import ProductModal from "../pages/ProductViewsDetails";
import { useNavigate } from 'react-router-dom';


const GridProductDefault = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const currentUser = useSelector(state => state.auth.user);
    const navigate = useNavigate()
    const [productData, setProductData] = useState([]);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);

    const addProductToCart = useCallback((product) => {
        dispatch(addToCart(product));
        dispatch(addMessageNotif(`Produit ${product?.code_reference} ajouté le ${new Date().toLocaleString()}`));
    }, [dispatch]);

    const openModal = useCallback((e, product) => {
        e.preventDefault();
        dispatch(addUser(owners[product.fournisseur]));
        setModalData(product);
    }, [owners, dispatch]);

    const closeModal = () => setModalData(null);

    const cols = useMemo(() => {
        const chunked = [];
        if (productData.length) {
            for (let i = 0; i < productData.length; i += 3) {
                chunked.push(productData.slice(i, i + 3));
            }
        }
        return chunked;
    }, [productData]);

    useEffect(() => {
        const fetchProductsAndOwners = async () => {
            try {
                const { data: products } = await api.get("produits/");
                const filtered = products.filter(p => parseInt(p.quantity_product) !== 0);
                setProductData(filtered);

                const ownerIds = [...new Set(filtered.map(p => p.fournisseur).filter(Boolean))];
                const responses = await Promise.all(
                    ownerIds.map(id =>
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
            } catch (error) {
                console.error("Erreur lors du chargement des produits :", error);
            }
        };

        fetchProductsAndOwners();

    }, []);

    return (

        <>
            {
                (productData?.length > 0) ? (
                <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mt-2">
                    {cols.map((products, colIdx) => (
                        <div key={colIdx} className="grid gap-4">
                            {products.map(product => {
                                const isInCart = cartItems.some(p => p.id === product.id);
                                const owner = owners[product.fournisseur];

                                return (
                                    <div
                                        key={product.id}
                                        className={`rounded-lg p-1 transition transform hover:-translate-y-1 ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                                            }`}
                                        style={{
                                            backgroundColor: "var(--color-bg)",
                                            color: "var(--color-text)"
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="relative w-full block rounded-lg overflow-hidden"
                                            onClick={(e) => openModal(e, product)}
                                            aria-label={`Voir le produit ${product.description_product}`}
                                        >
                                            <img
                                                src={product.image_product}
                                                alt={`${product.description_product}`}
                                                loading="lazy"
                                                className="h-auto w-full rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                            />
                                        </button>

                                        <div className="flex justify-between items-center mt-2 mb-1">
                                            <OwnerAvatar owner={owner} />
                                            {parseInt(product.quantity_product) > 1 && (
                                                <span className="text-sm text-gray-700">
                                                    Quantité {product.quantity_product}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-center text-sm md:text-base">
                                            {product.description_product}
                                        </p>

                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-blue-700 font-semibold text-sm">
                                                ${product.price_product}
                                            </span>

                                            <button
                                                title="Ajouter au panier"
                                                onClick={() => addProductToCart(product)}
                                                className="p-1 rounded-full hover:bg-green-200"
                                            >
                                                <svg
                                                    className="w-[26px] h-[26px] text-gray-800 dark:text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="0.8"
                                                        d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
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

                        onClick={

                            () => {
                                dispatch(setCurrentNav("add_product"));

                                navigate("/add_product");
                            }
                        }
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
                </div>
                )
            }

            <ProductModal isOpen={!!modalData} onClose={closeModal} dataProduct={modalData} />
        </>
    );
};

export default GridProductDefault;
