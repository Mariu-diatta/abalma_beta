import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import api from '../services/Axios';
import OwnerAvatar from '../components/OwnerProfil';
import { useRef, } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMessageNotif, addUser } from '../slices/chatSlice';
import ProductModal from '../pages/ProductViewsDetails';
import { useTranslation } from 'react-i18next';
import LoadingCard from '../components/LoardingSpin';



const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory }) => {

    const { t } = useTranslation();


    const categories = [
        t('ListItemsFilterProduct.All'),
        t('ListItemsFilterProduct.JOUET'),
        t('ListItemsFilterProduct.HABITS'),
        t('ListItemsFilterProduct.MATERIELS_INFORMATIQUES'),
        t('ListItemsFilterProduct.CAHIERS'),
        t('ListItemsFilterProduct.SACS'),
        t('ListItemsFilterProduct.LIVRES'),
        t('ListItemsFilterProduct.ELECTROMENAGER'),
        t('ListItemsFilterProduct.TELEPHONIE'),
        t('ListItemsFilterProduct.ACCESSOIRES'),
        t('ListItemsFilterProduct.SPORT'),
        t('ListItemsFilterProduct.JEUX_VIDEO'),
        t('ListItemsFilterProduct.MEUBLES'),
        t('ListItemsFilterProduct.VEHICULES'),
        t('ListItemsFilterProduct.FOURNITURES_SCOLAIRES'),
        t('ListItemsFilterProduct.DIVERS')
    ];

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

                    className="absolute left-0 top-1/2 -translate-y-1/2 z-0 bg-white p-2 shadow rounded-full"

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

                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm  transition 

                                ${activeCategory === cat

                                    ? 'bg-blue-700 text-white'

                                    : 'text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white'

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

                    className="absolute right-0 top-1/2 -translate-y-1/2 z-0 bg-white p-2 shadow rounded-full"

                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />

                </button>
            )}
        </div>
    );
};




const GridLayoutProduct = () => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(true)
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

            } finally {

                setLoading(false)
            }
        };

        fetchProductsAndOwners();

    }, []);


    const filteredItems = activeCategory === 'All'

        ? productData.filter(item => parseInt(item?.quantity_product) !== 0 && item.image_product)

        : productData.filter(item => item.categorie_product === activeCategory && parseInt(item?.quantity_product) !== 0 && item.image_product);

    return (

        <div

            className="p-4 space-y-4 dark:bg-gray-900 dark:text-white"

            style={{

                backgroundColor: "var(--color-bg)",

                color: "var(--color-text)"
            }}
        >

            <ScrollableCategoryButtons

                activeCategory={activeCategory}

                setActiveCategory={setActiveCategory}
            />

            {
                loading ?

                <LoadingCard />
                :
                <>
                    {filteredItems.length > 0 ? (

                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 "

                            style={
                                {

                                    backgroundColor: "var(--color-bg)",
                                    color: "var(--color-text)"
                                }
                            }
                        >

                            {filteredItems.length>0 && filteredItems.map(item => {

                                const isInCart = cartItems.some(product => product.id === item.id);

                                const owner = owners[item.fournisseur];

                                return (

                                   <div

                                            key={item.id}

                                            className={`rounded-lg p-1 shadow-md transition transform hover:-translate-y-1 hover:shadow-lg 

                                            ${isInCart ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}

                                            style={{

                                                backgroundColor: "var(--color-bg)",

                                                color: "var(--color-text)"
                                            }}
                                        >
                                            <button

                                                onClick={() => {

                                                    openModal(item)

                                                    dispatch(addUser(owners[item.fournisseur]))

                                                }}

                                                className="block w-full rounded-lg overflow-hidden"
                                            >
                                            <img
                                                src={item?.image_product}
                                                alt={item?.description_product}
                                                className="w-full h-55 object-cover rounded-lg mb-2 transition duration-300 ease-in-out hover:brightness-75 hover:grayscale"
                                                onError={(e) => {
                                                    if (e.target.src !== window.location.origin + "/default-product.jpg") {
                                                        e.target.src = "/default-product.jpg";
                                                    }
                                                }}
                                            />

                                            </button>

                                            <div className="flex justify-between items-center mb-1">

                                                <OwnerAvatar owner={owner} />

                                                {item.quantity_product !== "1" && (

                                                    <span className="text-xs text-gray-600">Quantité {item.quantity_product}</span>
                                                )}

                                            </div>

                                            <p className="text-sm text-center  truncate mb-1">

                                                {item.description_product}

                                            </p>

                                            <div className="flex justify-between items-center">

                                                <span className="text-blue-700 font-semibold text-sm">${item.price_product}</span>

                                                <div className="flex gap-2">

                                                    <button

                                                        title="Ajouter au panier"

                                                        onClick={() => {

                                                            addProductToCart(item);

                                                            dispatch(addMessageNotif(`Produit ${item?.code_reference} sélectionné le ${Date.now()}`));
                                                        }}

                                                        className="cursor-pointer p-1 rounded-full  hover:bg-green-100 transition"
                                                    >
                                                        <svg className="w-[26px] h-[26px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">

                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />

                                                        </svg>

                                                    </button>

                                                    {/*<button*/}
                                                    {/*    title="Ajouter en cadeau"*/}
                                                    {/*    onClick={() => alert(`Cadeau ajouté: ${item.description_product}`)}*/}
                                                    {/*    className="cursor-pointer p-1 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"*/}
                                                    {/*>*/}
                                                    {/*    🎁*/}
                                                    {/*</button>*/}

                                                </div>

                                            </div>
                                </div>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="text-center text-gray-500">{t('ListItemsFilterProduct.noProduct')}</div>
                    )}

                </>
            }

            <ProductModal isOpen={!!modalData} onClose={closeModal} dataProduct={modalData} />

        </div>
    );
};

export default GridLayoutProduct;






