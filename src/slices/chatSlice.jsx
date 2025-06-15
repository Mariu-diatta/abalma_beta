import { createSlice } from '@reduxjs/toolkit';
import api from '../services/Axios';

const initialState = {
    currentChats: [], // Liste des rooms actuellement actives (sans doublon)
    newChat: "",
    userSlected:null
};

const chatSlice = createSlice({

    name: 'chat',

    initialState,

    reducers: {

        // ➕ Ajouter une room s'il n'existe pas déjà
        addRoom: (state, action) => {
            const exists = state.currentChats.some(room => room.name === action.payload.name);
            if (!exists) {
                state.currentChats.push(action.payload);
            }
        },

        // ➖ Supprimer une room par nom
        removeRoom: (state, action) => {

            state.currentChats = state.currentChats.filter(room => room.name !== action.payload.name);

            const fetchRooms = async () => {

                try {


                    console.log("deleted item ", action.payload?.pk)

                    const resp = await api.delete(`/rooms/${action.payload?.pk}/`);


                } catch (err) {
                    console.log(err)
                }
            }

            fetchRooms()
        },

        // 🧹 Vider toutes les rooms
        clearRooms: (state) => {
            state.currentChats = [];
            state.userSlected= null
        },

        newRoom: (state, payload) => {
            state.newChat = payload?.name;
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addUser: (state, action) => {
       
            state.userSlected = action?.payload
           
        },
    },
});

export const { addRoom, removeRoom, clearRooms, newRoom, addUser } = chatSlice.actions;

export default chatSlice.reducer;
