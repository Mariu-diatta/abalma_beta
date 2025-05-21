// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    items: [], // { id, name, price, quantity }
    nbItem: 0

};

const cartSlice = createSlice({

    name: 'cart',

    initialState,

    reducers: {

        addToCart: (state, action) => {

            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.nbItem = state.items.reduce((sum, item) => sum + item.quantity, 0);
        },

        removeFromCart: (state, action) => {

            state.items = state.items.filter(item => item.id !== action.payload.id);
            state.nbItem = state.items.reduce((sum, item) => sum + item.quantity, 0);
        },

        decreaseQuantity: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.id !== action.payload.id);
                }
            }
            state.nbItem = state.items.reduce((sum, item) => sum + item.quantity, 0);
        },

        clearCart: (state) => {

            state.items = [];
            state.nbItem = 0
        },
    },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
