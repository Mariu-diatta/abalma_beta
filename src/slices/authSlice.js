// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    isAuthenticated: false,

    firebaseToken:null,

    user: null,
};

const authSlice = createSlice({

    name: 'auth',

    initialState,

    reducers: {

        login: (state, action) => {

            state.isAuthenticated = true;

            state.user = action.payload; // user object
        },

        logout: (state) => {

            state.isAuthenticated = false;

            state.user = null;
        },

        getFirebaseToken: (state, action) => {

            state.firebaseToken = state.user = action.payload;;
        },
    },
});

export const { getFirebaseToken, login, logout } = authSlice.actions;

export default authSlice.reducer;
