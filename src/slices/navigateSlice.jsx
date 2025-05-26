// slices/navigateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    previousNav: null,
    currentNav: 'home',
};

const navigateSlice = createSlice({
    name: 'navigateapp',
    initialState,
    reducers: {
        setPreviousNav: (state) => {
            state.previousNav = state.currentNav;
        },
        setCurrentNav: (state, action) => {
            state.previousNav = state.currentNav; // on garde aussi l'ancien
            state.currentNav = action.payload;    // payload = nouvelle valeur simple, ex: "shop"
        },
    },
});

export const { setPreviousNav, setCurrentNav } = navigateSlice.actions;

export default navigateSlice.reducer;
