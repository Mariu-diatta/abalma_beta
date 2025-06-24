import { createSlice } from '@reduxjs/toolkit';
import api from '../services/Axios';

const initialState = {
    currentChats: [], // Liste des rooms actuellement actives (sans doublon)
    newChat: {},
    currentChat:{},
    userSlected: null,
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

            const roomName = action.payload;

            // Si le chat supprimé est le chat courant, on le réinitialise
            if (state.currentChat?.name === roomName) {

                state.currentChat = {};
            }

            // Supprimer localement le chat de la liste
            state.currentChats = state.currentChats.filter(room => room?.name !== roomName);
        },

        // 🧹 Vider toutes les rooms
        clearRooms: (state) => {
            state.currentChats = [];
            state.userSlected = null;
            state.currentChat=null
        },

        newRoom: (state, payload) => {
            state.newChat = payload?.name;
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addUser: (state, action) => {
       
            state.userSlected = action?.payload
           
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addCurrentChat: (state, action) => {

            state.currentChat= action?.payload

        },

        addMessageNotif: (state, action) => {

            state.messageNotif.push(action?.payload)

        },

        removeMessageNotif: (state) => {
            state.messageNotif = state.messageNotif.slice(1);
        },
        cleanAllMessageNotif: (state) => {
            state.messageNotif = [];
        }
    },
});

export const { addRoom, removeRoom, clearRooms, newRoom, addUser, addCurrentChat, addMessageNotif,
    removeMessageNotif, cleanAllMessageNotif } = chatSlice.actions;

export const deleteRoomAsync = (roomName) => async (dispatch) => {
    try {
        const resp = await api.get(`/rooms/?name=${roomName}`);
        const pk_id = resp?.data[0]?.pk;

        if (pk_id) {
            await api.delete(`/rooms/${pk_id}/`);
        }

        // Mise à jour du store après succès
        dispatch(removeRoom(roomName));

    } catch (err) {
        console.error("Erreur de suppression :", err);
    }
};

export default chatSlice.reducer;
