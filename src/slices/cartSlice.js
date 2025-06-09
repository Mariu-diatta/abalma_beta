// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],          // Produits normaux
    cardCreated: [],    // Produits personnalisés
    nbItem: 0,          // Total global
    nbItemCustom: 0,    // Total des produits personnalisés (cardCreated)
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
                existingItem.quantity += 1;
            } else {
                targetArray.push({ ...action.payload, quantity: 1 });
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
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
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
        },
    },
});

// 🔢 Helpers pour recalculer les quantités
const updateItemCounts = (state) => {
    const sum = (arr) => arr.reduce((total, item) => total + item.quantity, 0);
    state.nbItem = sum(state.items) + sum(state.cardCreated);
    state.nbItemCustom = sum(state.cardCreated);
};

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
