﻿import React, { useEffect, useState } from 'react';
import GridSlideProduct from './GridProductSlide';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import HorizontalCard from './HorizontalCard';
import api from '../services/Axios';
import OwnerAvatar from '../components/OwnerProfil';
import { useRef,  } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
    'All', 'JOUET', 'HABITS', 'MATERIELS_INFORMATIQUES', 'CAHIERS', 'SACS', 'LIVRES',
    'ELECTROMENAGER', 'TELEPHONIE', 'ACCESSOIRES', 'SPORT', 'JEUX_VIDEO',
    'MEUBLES', 'VEHICULES', 'FOURNITURES_SCOLAIRES', 'DIVERS'
];

const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory }) => {

    const scrollRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false);

    const [showRight, setShowRight] = useState(false);

    const updateButtonsVisibility = () => {

        const container = scrollRef.current;

        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        setShowLeft(scrollLeft > 0);

        setShowRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 to handle rounding issues
    };

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 200;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    useEffect(() => {

        const container = scrollRef.current;

        if (!container) return;

        updateButtonsVisibility(); // Initial state

        container.addEventListener("scroll", updateButtonsVisibility);

        window.addEventListener("resize", updateButtonsVisibility); // Handle screen resize

        return () => {

            container.removeEventListener("scroll", updateButtonsVisibility);

            window.removeEventListener("resize", updateButtonsVisibility);
        };
    }, []);

    return (
        <div className="relative w-full mb-4">

            {/* Bouton gauche */}
            {showLeft && (
                <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
            )}

            {/* Conteneur scrollable */}
            <div
                ref={scrollRef}

                className="scrollbor_hidden_ overflow-x-auto  px-10"
            >
                <div className="flex gap-2 min-w-max py-2">

                    {categories.map((cat) => (

                        <button

                            key={cat}

                            onClick={() => setActiveCategory(cat)}

                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition 

                                ${activeCategory === cat

                                ? 'bg-blue-700 text-white'

                                : 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white'

                                }`}
                        >
                            {cat.replace('_', ' ')}

                        </button>
                    ))}
                </div>
            </div>

            {/* Bouton droit */}
            {showRight && (

                <button

                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full"

                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />

                </button>
            )}
        </div>
    );
};




const GridLayoutProduct = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const [productData, setProductData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [modalData, setModalData] = useState(null);
    const [owners, setOwners] = useState({});

    const addProductToCart = (item) => dispatch(addToCart(item));
    const openModal = (item) => setModalData(item);
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


    const filteredItems = activeCategory === 'All'
        ? productData
        : productData.filter(item => item.categorie_product === activeCategory);

    return (
        <div className="p-4 space-y-4">

            <ScrollableCategoryButtons

                activeCategory={activeCategory}

                setActiveCategory={setActiveCategory}
            />

            {filteredItems.length > 0 ? (

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 ">

                    {filteredItems.map(item => {

                        const isInCart = cartItems.some(product => product.id === item.id);

                        const owner = owners[item.fournisseur];

                        return (

                            <div

                                key={item.id}

                                className={`rounded-lg p-1 shadow-md transition transform hover:-translate-y-1 hover:shadow-lg 

                                ${isInCart ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}
                            >
                                <button

                                    onClick={() => openModal(item)}

                                    className="block w-full rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={item.image_product}
                                        alt={item.description_product}
                                        className="w-full h-55 object-cover rounded-lg mb-2  transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                        onError={(e) => { e.target.src = "/default-product.jpg"; }}
                                    />

                                </button>

                                <div className="flex justify-between items-center mb-1">

                                    {owner?.image && <OwnerAvatar owner={owner} />}

                                    {item.quantity_product !== "1" && (

                                        <span className="text-xs text-gray-600">Quantité {item.quantity_product}</span>
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
                                            className="cursor-pointer p-1 bg-green-100 rounded-full hover:bg-green-200 transition"
                                        >
                                            🛒
                                        </button>

                                        <button
                                            title="Ajouter en cadeau"
                                            onClick={() => alert(`Cadeau ajouté: ${item.description_product}`)}
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
            ) : (
                <div className="text-center text-gray-500">Aucun produit disponible</div>
            )}

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
        </div>
    );
};

export default GridLayoutProduct;






