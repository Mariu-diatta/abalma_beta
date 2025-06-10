import React, { useEffect, useState } from 'react';
import GridSlideProduct from './GridProductSlide';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import HorizontalCard from './HorizontalCard';
import api from '../services/Axios';

const categories = ['All', 'Shoes', 'Bags', 'Electronics', 'Gaming'];

const GridLayoutProduct = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.cart.items);
    const [productData, setProductData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [modalData, setModalData] = useState(null);
    const [ownerProduct, setOwnerProduct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);

    const addProductToCart = (item) => dispatch(addToCart(item));

    const getUser = async (id) => {
        try {
            const response = await api.get(`clients/${id}/`);
            setOwnerProduct(response.data);
            console.log("Propriétaire de la photo", response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredItems = activeCategory === 'All'
        ? productData
        : productData.filter(item => item.categorie_product === activeCategory);

    const openModal = (item) => setModalData(item);
    const closeModal = () => setModalData(null);

    useEffect(() => {
        api.get("produits/")
            .then(resp => {
                console.log("Product Data", resp.data);
                setProductData(resp.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-4">
            {/* Category Tabs */}
            <div className="flex justify-center flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2 rounded-full transition font-medium text-sm ${activeCategory === cat
                                ? 'bg-blue-700 text-white'
                                : 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

                {filteredItems.map(item => {

                    const isInCart = data.some(product => product.id === item.id);

                    getUser(item?.id)

                    return (
                        <div
                            key={item.id}
                            className={`rounded-lg p-3 border-0 shadow-sm transition transform hover:-translate-y-1 hover:shadow-md ${isInCart ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'
                                }`}
                        >
                            <button
                                onClick={() => openModal(item)}
                                className="block w-full overflow-hidden rounded-lg"
                            >
                                <img
                                    src={item.image_product}
                                    alt={item.description_product}
                                    className="w-full h-50 object-cover rounded-lg mb-3 hover:grayscale hover:brightness-90 transition"
                                />
                            </button>

                            <div className="flex justify-between items-center mb-2">
                                {item.fournisseur && (
                                    <img
                                        src={ownerProduct?.image}
                                        alt="Fournisseur"
                                        className="h-6 w-6 rounded-full object-cover cursor-pointer"
                                        onClick={() => alert("USER BLOCK")}
                                    />
                                )}
                                {item.quantity_product !== "1" && (
                                    <span className="text-sm text-gray-700">Quantité {item.quantity_product}</span>
                                )}
                            </div>

                            <p className="text-sm text-center font-medium text-gray-800 truncate mb-1">
                                {item.description_product}
                            </p>

                            <div className="flex justify-between items-center">

                                <span className="text-blue-700 font-semibold text-sm">${item.price_product}</span>

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

            {/* Modal */}
            {modalData && (
                <div
                    className="fixed inset-0 z-50 bg-gray-100 bg-transparent  bg-opacity-100 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-white-900 rounded-xl p-0 lg-w-full  shadow-lg"
                    >
                        <HorizontalCard item={modalData}>

                            <GridSlideProduct />

                        </HorizontalCard>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GridLayoutProduct;
