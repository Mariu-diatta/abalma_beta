import React, { useEffect, useState } from 'react';
import GridSlideProduct from './GridProductSlide';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import HorizontalCard from './HorizontalCard';
import api from '../services/Axios';

const categories = [
    'All', 'JOUET', 'HABITS', 'MATERIELS_INFORMATIQUES', 'CAHIERS', 'SACS', 'LIVRES',
    'ELECTROMENAGER', 'TELEPHONIE', 'ACCESSOIRES', 'SPORT', 'JEUX_VIDEO',
    'MEUBLES', 'VEHICULES', 'FOURNITURES_SCOLAIRES', 'DIVERS'
];

const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory }) => (
    <div className="scrollbor_hidden overflow-x-auto w-full mb-4">
        <div className="flex gap-2 min-w-max">
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
);

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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
                                        className="w-full h-55 object-cover rounded-lg mb-2"
                                        onError={(e) => { e.target.src = "/default-product.jpg"; }}
                                    />
                                </button>

                                <div className="flex justify-between items-center mb-1">
                                    {owner?.image && (
                                        <img
                                            src={owner.image}
                                            alt={owner.nom || "Fournisseur"}
                                            className="h-6 w-6 rounded-full object-cover"
                                            title={owner.nom}
                                        />
                                    )}
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
                                            className="p-1 bg-green-100 rounded-full hover:bg-green-200 transition"
                                        >
                                            🛒
                                        </button>
                                        <button
                                            title="Ajouter en cadeau"
                                            onClick={() => alert(`Cadeau ajouté: ${item.description_product}`)}
                                            className="p-1 bg-yellow-100 rounded-full hover:bg-yellow-200 transition"
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
                    className="fixed inset-0 z-50 bg-gray-100 bg-opacity-90 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl shadow-lg p-4"
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
