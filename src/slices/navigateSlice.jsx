// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const navigateApp = createSlice(

    {
        name: "Navigate",

        initialState: {

            previousNav: null,

            currentNav:"home"
        },

        reducers: {

            setPreviousNav: state => {

                state.previousNav = state.currentNav
            },

            setCurrentNav: state => {

                state.previousNav = 0
            }

        }
    }
)

export const { setPreviousNav, setCurrentNav} = navigateApp.actions;

export default navigateApp.reducer;