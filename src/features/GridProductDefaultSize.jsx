import React, { useEffect, useState, useMemo } from "react";
import GridSlideProduct from "./GridProductSlide";
import HorizontalCard from "./HorizontalCard";
import api from "../services/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const GridProductDefault = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.cart.items);
    const [productData, setProductData] = useState([]);
    const [owners, setOwners] = useState({});
    const [modalData, setModalData] = useState(null);

    const addProductToCart = (item) => dispatch(addToCart(item));

    const cols = useMemo(() => {
        return productData.reduce((acc, product, idx) => {
            const col = Math.floor(idx / 3);
            if (!acc[col]) acc[col] = [];
            acc[col].push(product);
            return acc;
        }, []);
    }, [productData]);

    const openModal = (id) => {
        setModalData({
            id,
            img: `https://flowbite.s3.amazonaws.com/docs/gallery/square/image${id ? `-${id}` : ''}.jpg`,
            price: 79,
            title: 'Saussure neuve.',
        });
    };

    const closeModal = () => setModalData(null);

    useEffect(() => {

        const fetchData = async () => {

            try {
                const resp = await api.get("produits/");

                setProductData(resp.data);

                // Fetch all owner info in parallel
                const ownerResponses = await Promise.all(

                    resp.data.map(product =>

                        api.get(`clients/${product.id}/`).then(res => ({ id: product.id, data: res.data }))
                    )
                );

                const ownerMap = ownerResponses.reduce((acc, { id, data }) => {

                    acc[id] = data;

                    return acc;

                }, {});

                setOwners(ownerMap);

            } catch (err) {

                console.error(err);
            }
        };

        fetchData();

    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">

            {cols.map((productsInCol, colIndex) => (

                <div key={colIndex} className="grid gap-4">

                    {productsInCol.map((item) => {

                        const isInCart = data.some(product => product.id === item.id);

                        const ownerProduct = owners[item.id];

                        return (
                            <div
                                key={item?.id}
                                className={`rounded-lg p-1 border-0 shadow-sm transition transform hover:-translate-y-1 hover:shadow-md ${isInCart ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}
                            >
                                <button
                                    type="button"
                                    className="relative p-0 mb-1 border-0 bg-transparent cursor-pointer block rounded-lg overflow-hidden"
                                    onClick={() => openModal(item?.id)}
                                    aria-label={`Voir l'image ${item?.id}`}
                                >
                                    <img
                                        src={item?.image_product}
                                        alt={`Image`}
                                        className="h-auto w-auto rounded-lg transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                    />
                                </button>

                                <div className="flex justify-between items-center mb-2">
                                    {item.fournisseur && ownerProduct?.image && (
                                        <img
                                            src={ownerProduct.image}
                                            alt="Fournisseur"
                                            className="h-6 w-6 rounded-full object-cover cursor-pointer"
                                            onClick={() => alert("USER BLOCK")}
                                        />
                                    )}
                                    {item.quantity_product !== "1" && (
                                        <span className="text-sm text-gray-700">Quantité {item.quantity_product}</span>
                                    )}
                                </div>

                                <p className="text-center text-gray-600 dark:text-gray-300 text-sm md:text-base tracking-normal text-gray-500 tracking-wide">
                                    {item?.description_product}
                                </p>

                                <div className="flex justify-between items-center">
                                    <span className="text-blue-700 font-semibold text-sm">${item?.price_product}</span>
                                    <div className="flex gap-2">
                                        <button
                                            title="Ajouter au panier"
                                            onClick={() => addProductToCart(item)}
                                            className="p-1 bg-green-100 rounded-full hover:bg-green-200 transition"
                                        >
                                            <svg
                                                className="w-5 h-5 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M4 4h1.5L8 16h8m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4zm8-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                                            </svg>
                                        </button>
                                        <button
                                            title="Ajouter en cadeau"
                                            onClick={() => alert(`Cadeau ajouté: ${item.description_product}`)}
                                            className="p-1 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
                                        >
                                            <svg
                                                className="w-5 h-5 text-yellow-600"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div onClick={(e) => e.stopPropagation()}>

                        <HorizontalCard item={{ id: 1, src: "image-11", price: 59, title: "Produit 12", description: "Description courte 12" }}>

                            <GridSlideProduct />

                        </HorizontalCard>

                    </div>

                </div>
            )}
        </div>
    );
};

export default GridProductDefault;
