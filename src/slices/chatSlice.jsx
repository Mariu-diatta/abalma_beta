import { createSlice } from '@reduxjs/toolkit';
import api from '../services/Axios';

const initialState = {
    currentChats: [], // Liste des rooms actuellement actives (sans doublon)
    newChat: "",
    currentChat:"",
    userSlected: "",
    messageNotif:[]
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

                     await api.delete(`/rooms/${action.payload?.pk}/`);


                } catch (err) {
                    console.log(err)
                }
            }

            fetchRooms()
        },

        // 🧹 Vider toutes les rooms
        clearRooms: (state) => {
            state.currentChats = [];
            state.userSlected = null;
            state.currentChat=""
        },

        newRoom: (state, payload) => {
            state.newChat = payload?.name;
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addUser: (state, action) => {
       
            state.userSlected = action?.payload
           
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addCUrrentChat: (state, action) => {

            state.currentChat= action?.payload

        },

        addMessageNotif: (state, action) => {

            state.messageNotif.push(action?.payload)

        },

        removeMessageNotif: (state) => {
            state.messageNotif = state.messageNotif.slice(1);
        }
    },
});

export const { addRoom, removeRoom, clearRooms, newRoom, addUser, addCUrrentChat, addMessageNotif,
    removeMessageNotif } = chatSlice.actions;

export default chatSlice.reducer;
