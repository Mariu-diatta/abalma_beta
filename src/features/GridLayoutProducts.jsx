
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import HorizontalCard from './HorizontalCard';
import GridSlideProduct from './GridProductSlide';
import api from '../services/Axios';

// Catégories possibles
const categories = [
    'All', 'JOUET', 'HABITS', 'MATERIELS_INFORMATIQUES', 'CAHIERS', 'SACS', 'LIVRES',
    'ELECTROMENAGER', 'TELEPHONIE', 'ACCESSOIRES', 'SPORT', 'JEUX_VIDEO',
    'MEUBLES', 'VEHICULES', 'FOURNITURES_SCOLAIRES', 'DIVERS'
];

// Composant pour les boutons de catégories
const ScrollableCategoryButtons = ({ activeCategory, setActiveCategory }) => (
    <div className="scrollbor_hidden overflow-x-auto w-full ">
        <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition 
            ${activeCategory === cat
                            ? 'bg-blue-700 text-white'
                            : 'bg-white text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white'}`}
                >
                    {cat.replace('_', ' ')}
                </button>
            ))}
        </div>
    </div>
);

// Carte produit individuelle
const ProductCard = ({ item, owner, isInCart, onAddToCart, onOpenModal }) => {
    const {
        id, image_product, description_product, quantity_product,
        price_product, fournisseur
    } = item;

    return (
        <div
            key={id}
            className={`rounded-xl p-2 shadow-md transition transform hover:-translate-y-1 hover:shadow-lg 
        ${isInCart ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-white'}`}
        >
            <button onClick={() => onOpenModal(item)} className="block w-full rounded-lg overflow-hidden">
                <img
                    src={image_product}
                    alt={description_product}
                    className="w-full h-48 object-cover rounded-md mb-3 hover:grayscale hover:brightness-90 transition"
                />
            </button>

            <div className="flex justify-between items-center mb-2">
                {fournisseur && owner?.image && (
                    <img
                        src={owner.image}
                        alt="Fournisseur"
                        className="h-6 w-6 rounded-full object-cover cursor-pointer"
                        onClick={() => alert("USER BLOCK")}
                    />
                )}
                {quantity_product !== "1" && (
                    <span className="text-xs text-gray-600">Quantité {quantity_product}</span>
                )}
            </div>

            <p className="text-sm text-center font-medium text-gray-800 truncate mb-1">
                {description_product}
            </p>

            <div className="flex justify-between items-center">
                <span className="text-blue-700 font-semibold text-sm">${price_product}</span>
                <div className="flex gap-2">
                    <ActionButton
                        iconColor="green-600"
                        bgColor="bg-green-100"
                        hoverColor="hover:bg-green-200"
                        onClick={() => onAddToCart(item)}
                        title="Ajouter au panier"
                    >
                        <CartIcon />
                    </ActionButton>
                    <ActionButton
                        iconColor="yellow-600"
                        bgColor="bg-yellow-100"
                        hoverColor="hover:bg-yellow-200"
                        onClick={() => alert(`Cadeau ajouté: ${description_product}`)}
                        title="Ajouter en cadeau"
                    >
                        <GiftIcon />
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};

// Bouton d'action générique
const ActionButton = ({ children, onClick, title, bgColor, hoverColor, iconColor }) => (
    <button
        title={title}
        onClick={onClick}
        className={`p-1 rounded-full ${bgColor} ${hoverColor} transition`}
    >
        <div className={`w-5 h-5 text-${iconColor}`}>{children}</div>
    </button>
);

// Icônes
const CartIcon = () => (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h1.5L8 16h8m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4zm8-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
    </svg>
);

const GiftIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 7h-.7c.23-.47.35-.98.35-1.5a3.5 3.5 0 00-3.5-3.5c-1.72 0-3.22 1.2-4.33 2.48C10.4 2.84 8.95 2 7.5 2A3.5 3.5 0 004 5.5c0 .52.12 1.03.35 1.5H4a2 2 0 00-2 2v2a1 1 0 001 1h18a1 1 0 001-1V9a2 2 0 00-2-2z" />
    </svg>
);

// Composant principal
const GridLayoutProduct = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);

    const [productData, setProductData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [modalData, setModalData] = useState(null);
    const [owners, setOwners] = useState({});

    const addProductToCart = item => dispatch(addToCart(item));
    const openModal = item => setModalData(item);
    const closeModal = () => setModalData(null);

    useEffect(() => {
        api.get("produits/")
            .then(resp => {
                setProductData(resp.data);
                [...new Set(resp.data.map(p => p.id))].forEach(fetchOwner);
            })
            .catch(console.error);
    }, []);

    const fetchOwner = async (id) => {
        if (owners[id]) return;
        try {
            const { data } = await api.get(`clients/${id}/`);
            setOwners(prev => ({ ...prev, [id]: data }));
        } catch (err) {
            console.error(err);
        }
    };

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
                    {filteredItems.map(item => (
                        <ProductCard
                            key={item.id}
                            item={item}
                            owner={owners[item.id]}
                            isInCart={cartItems.some(product => product.id === item.id)}
                            onAddToCart={addProductToCart}
                            onOpenModal={openModal}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">Aucun produit disponible</div>
            )}

            {modalData && (
                <div
                    className="fixed inset-0 z-50 bg-gray-100 bg-opacity-90 flex items-center justify-center"
                    onClick={closeModal}
                >
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl shadow-lg p-4">
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
