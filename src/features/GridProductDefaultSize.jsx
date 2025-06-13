import React, { useEffect, useState, useMemo } from "react";
import GridSlideProduct from "./GridProductSlide";
import HorizontalCard from "./HorizontalCard";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const GridProductDefault = ({data}) => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

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
                {cols.map((products, colIdx) => (
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
                                        onClick={(e) => openModal(e, product)}
                                        aria-label={`Voir le produit ${product.description_product}`}
                                    >
                                        <img
                                            src={product.image_product}
                                            alt={`Produit ${product.description_product}`}
                                            className="h-auto w-full rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                        />
                                    </button>

                                    <div className="flex justify-between items-center mt-2 mb-1">
                                        {owner?.image && (
                                            <img
                                                src={owner.image}
                                                alt="Fournisseur"
                                                className="h-6 w-6 rounded-full object-cover cursor-pointer"
                                                onClick={() => alert("USER BLOCK")}
                                            />
                                        )}
                                        {product.quantity_product !== "1" && (
                                            <span className="text-sm text-gray-700">Quantité {product.quantity_product}</span>
                                        )}
                                    </div>

                                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                        {product.description_product}
                                    </p>

                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-blue-700 font-semibold text-sm">${product.price_product}</span>
                                        <div className="flex gap-2">
                                            <button
                                                title="Ajouter au panier"
                                                onClick={() => addProductToCart(product)}
                                                className="p-1 bg-green-100 rounded-full hover:bg-green-200"
                                            >
                                                🛒
                                            </button>
                                            <button
                                                title="Ajouter en cadeau"
                                                onClick={() => alert(`Cadeau ajouté: ${product.description_product}`)}
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
                ))}
            </div>

            {/* MODAL */}
            {modalData && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-white opacity-95  transition-opacity duration-300 "
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    data-modal-backdrop="static"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}

                        className="z-100  bg-black  shadow-lg transform scale-100 p-0 animate-fade-in-up  "
                    >
                        <HorizontalCard

                            item={{
                                id: modalData?.id,
                                src: modalData?.image_product,
                                price: modalData?.price_product,
                                title: modalData?.description_product,
                                description: `Quantité: ${modalData?.quantity_product}`,
                            }}
                        >
                            <GridSlideProduct srcs={[modalData?.image_product]} />

                        </HorizontalCard>
                    </div>
                </div>
            )}
        </>
    );
};

export default GridProductDefault;
