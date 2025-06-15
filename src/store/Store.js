// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import cartReducer from '../slices/cartSlice';
import navigateSlice from '../slices/navigateSlice';
import chatSlice from '../slices/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        navigate: navigateSlice,
        chat: chatSlice
    },
});
