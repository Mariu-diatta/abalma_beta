import React, { useEffect, useState, useMemo } from "react";
import GridSlideProduct from "./GridProductSlide";
import HorizontalCard from "./HorizontalCard";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const GridProductDefault = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const [productData, setProductData] = useState([]);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);

    const addProductToCart = (product) => dispatch(addToCart(product));

    const cols = useMemo(() => {
        return productData.reduce((acc, product, idx) => {
            const colIndex = Math.floor(idx / 3);
            if (!acc[colIndex]) acc[colIndex] = [];
            acc[colIndex].push(product);
            return acc;
        }, []);
    }, [productData]);

    const openModal = (product) => {
        setModalData(product);
    };

    const closeModal = () => setModalData(null);

    useEffect(() => {
        const fetchProductsAndOwners = async () => {
            try {
                const { data: products } = await api.get("produits/");
                setProductData(products);

                // Récupère tous les IDs uniques de fournisseurs
                const uniqueOwnerIds = [...new Set(products.map(p => p.fournisseur))].filter(Boolean);

                // Appelle tous les owners en parallèle
                const responses = await Promise.all(
                    uniqueOwnerIds.map(id =>
                        api.get(`clients/${id}/`).then(res => ({ id, data: res.data })).catch(() => ({ id, data: null }))
                    )
                );

                // Construit un objet clé-valeur pour un accès rapide
                const ownerMap = responses.reduce((acc, { id, data }) => {
                    if (data) acc[id] = data;
                    return acc;
                }, {});

                setOwners(ownerMap);
            } catch (error) {
                console.error("Erreur lors du chargement des produits ou des propriétaires :", error);
            }
        };

        fetchProductsAndOwners();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

            {cols.map((products, colIdx) => (

                <div key={colIdx} className="grid gap-4">

                    {products.map(product => {

                        const isInCart = cartItems.some(p => p.id === product.id);

                        const owner = owners[product.fournisseur];

                        return (
                            <div
                                key={product.id}
                                className={`rounded-lg p-1 border-0 shadow-sm transition transform hover:-translate-y-1 hover:shadow-md ${isInCart ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
                                    }`}
                            >
                                <button
                                    type="button"
                                    className="relative p-0 mb-1 border-0 bg-transparent cursor-pointer block rounded-lg overflow-hidden"
                                    onClick={() => openModal(product)}
                                    aria-label={`Voir le produit ${product.description_product}`}
                                >
                                    <img
                                        src={product.image_product}
                                        alt={`Produit ${product.description_product}`}
                                        className="h-auto w-auto rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                    />
                                </button>

                                <div className="flex justify-between items-center mb-2">
                                    {product.fournisseur && owner?.image && (
                                        <img
                                            src={owner.image}
                                            alt="Image fournisseur"
                                            className="h-6 w-6 rounded-full object-cover cursor-pointer"
                                            onClick={() => alert("USER BLOCK")}
                                        />
                                    )}
                                    {product.quantity_product !== "1" && (
                                        <span className="text-sm text-gray-700">Quantité {product.quantity_product}</span>
                                    )}
                                </div>

                                <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base tracking-wide">
                                    {product.description_product}
                                </p>

                                <div className="flex justify-between items-center">
                                    <span className="text-blue-700 font-semibold text-sm">${product.price_product}</span>

                                    <div className="flex gap-2">
                                        <button
                                            title="Ajouter au panier"
                                            onClick={() => addProductToCart(product)}
                                            className="p-1 bg-green-100 rounded-full hover:bg-green-200 transition"
                                        >
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M4 4h1.5L8 16h8m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4zm8-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                                            </svg>
                                        </button>

                                        <button
                                            title="Ajouter en cadeau"
                                            onClick={() => alert(`Cadeau ajouté: ${product.description_product}`)}
                                            className="p-1 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
                                        >
                                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 7h-.7c.23-.47.35-.98.35-1.5a3.5 3.5 0 00-3.5-3.5c-1.72 0-3.22 1.2-4.33 2.48C10.4 2.84 8.95 2 7.5 2A3.5 3.5 0 004 5.5c0 .52.12 1.03.35 1.5H4a2 2 0 00-2 2v2a1 1 0 001 1h18a1 1 0 001-1V9a2 2 0 00-2-2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {modalData && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <HorizontalCard
                            item={{
                                id: modalData.id,
                                src: modalData.image_product,
                                price: modalData.price_product,
                                title: modalData.description_product,
                                description: `Quantité: ${modalData.quantity_product}`,
                            }}
                        >
                            <GridSlideProduct />
                        </HorizontalCard>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GridProductDefault;
