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
        <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mt-2 justify-end">

            {cols.map((products, colIdx) => (

                <div key={colIdx} className="grid gap-4">

                    {products.map(product => {

                        const isInCart = cartItems.some(p => p.id === product.id);

                        const owner = owners[product.fournisseur];

                        return (
                            <div
                                key={product.id}
                                className={`border border-none border-width: 0px rounded-lg p-1 border-0  transition transform hover:-translate-y-1  ${isInCart ? "opacity-50 pointer-events-none bg-gray-100 " : "bg-white"
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
                                    <span className="text-blue-700 font-semibold text-sm">${product?.price_product}</span>
                                    <div className="flex gap-2">
                                        <button
                                            title="Ajouter au panier"
                                            onClick={() => addProductToCart(product)}
                                            className="cursor-pointer p-1 bg-green-100 rounded-full hover:bg-green-200 transition"
                                        >
                                            🛒
                                        </button>
                                        <button
                                            title="Ajouter en cadeau"
                                            onClick={() => alert(`Cadeau ajouté: ${product?.description_product}`)}
                                            className="cursor-pointer p-1 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
                                        >
                                            🎁
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-lg transform scale-95 opacity-100 animate-fade-in-up p-4"
                    >
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
