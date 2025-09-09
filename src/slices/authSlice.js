// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    isAuthenticated: false,

    user: null,

    compteUser: null,
};

const authSlice = createSlice({

    name: 'auth',

    initialState,

    reducers: {

        login: (state, action) => {

            state.isAuthenticated = action.payload?true:false;

            state.user = action.payload; // user object
        },

        logout: (state) => {

            state.isAuthenticated = false;

            state.user = null;

            state.compteUser = null;
        },

        getFirebaseToken: (state, action) => {

            state.firebaseToken =action.payload;
        },

            updateUserData: (state, action) => {

                state.user = action.payload; // user object
            },
        updateCompteUser: (state, action) => {

            state.compteUser = action.payload; // user object
        }
    },
});

export const {  updateCompteUser, updateUserData, getFirebaseToken, login, logout } = authSlice.actions;

export default authSlice.reducer;

