// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],          // Produits normaux
    cardCreated: [],    // Produits personnalisés
    nbItem: 0,          // Total global
    nbItemCustom: 0,    // Total des produits personnalisés (cardCreated
    totalPrice: 0,
    productUpdate: null,
    nbrProductViews:0,
    selectedProductView: null,
    contentBlog:null
};

const cartSlice = createSlice({

    name: 'cart',

    initialState,

    reducers: {

        // ➕ Ajouter un produit
        addToCart: (state, action) => {

            const isCustom = action.payload.methode;

            const targetArray = isCustom ? state.cardCreated : state.items;

            const existingItem = targetArray.find(item => item.id === action.payload.id);

            if (existingItem) {

                existingItem.quanttity_product_sold += 1;

            } else {
                targetArray.push({ ...action.payload, quanttity_product_sold: 1 });
            }

            // Met à jour les compteurs
            updateItemCounts(state);
        },

        // ➖ Supprimer complètement un produit
        removeFromCart: (state, action) => {
            const isCustom = action.payload.methode;
            const targetArray = isCustom ? state.cardCreated : state.items;

            const filtered = targetArray.filter(item => item.id !== action.payload.id);
            if (isCustom) state.cardCreated = filtered;
            else state.items = filtered;

            updateItemCounts(state);
        },

        // ➖ Réduire la quantité
        decreaseQuantity: (state, action) => {

            const isCustom = action.payload.methode;

            const targetArray = isCustom ? state.cardCreated : state.items;

            const existingItem = targetArray.find(item => item.id === action.payload.id);


            if (existingItem) {

                if (existingItem.quanttity_product_sold > 1) {

                    existingItem.quanttity_product_sold -= 1;

                } else {

                    const filtered = targetArray.filter(item => item.id !== action.payload.id);

                    if (isCustom) state.cardCreated = filtered;

                    else state.items = filtered;
                }
            }

            updateItemCounts(state);
        },

        // 🧹 Vider tout le panier
        clearCart: (state) => {
            state.items = [];
            state.cardCreated = [];
            state.nbItem = 0;
            state.nbItemCustom = 0;
            state.totalPrice = 0;
            state.totalPrice= 0
        },

        getTotalPrice: (state, action) => {

            state.totalPrice=action.payload
        },

        setProductUpdate: (state, action) => {

            state.productUpdate = action.payload
        },

        updateNumberProductViews: (state, action) => {

            state.nbrProductViews = action.payload
        },
        updateSelectedProduct: (state, action) => {

            state.selectedProductView = action.payload
        },
        updateContentBlog: (state, action) => {

            state.contentBlog = action.payload
        }

    },
});

// 🔢 Helpers pour recalculer les quantités
const updateItemCounts = (state) => {
    const sum = (arr) => arr.reduce((total, item) => total + item.quanttity_product_sold, 0);
    state.nbItem = sum(state.items) + sum(state.cardCreated);
    state.nbItemCustom = sum(state.cardCreated);
};

export const { addToCart, removeFromCart, decreaseQuantity, clearCart, getTotalPrice, setProductUpdate, updateNumberProductViews, updateSelectedProduct, updateContentBlog } = cartSlice.actions;

export default cartSlice.reducer;





