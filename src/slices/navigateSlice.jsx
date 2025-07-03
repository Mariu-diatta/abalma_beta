// slices/navigateSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    previousNav: null,

    currentNav: 'home',

    messageAlert: null,

    theme:'light'
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

        setCurrentMessage: (state, action) => {

            state.messageAlert = action.payload;    // payload = nouvelle valeur simple, ex: "shop"
        },

        clearMessage: (state) => {

            state.messageAlert = null;
        },

        updateTheme: (state, action) => {

            state.theme = action.payload;
        },
    }
});

export const { clearMessage, setCurrentMessage, setPreviousNav, setCurrentNav, updateTheme } = navigateSlice.actions; 

export default navigateSlice.reducer;
