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


            const fetchRooms = async () => {


                // Réinitialiser le chat courant si supprimé
                if (state.currentChat?.name === roomName) {
                    state.currentChat = {};
                }

                try {

                    const resp = await api.get(`/rooms/?name=${roomName}`)

                    const pk_id = resp?.data[0].pk

                    await api.delete(`/rooms/${pk_id}/`);

                } catch (err) {

                    console.log(err)
                }
            }

            state.currentChats = state.currentChats.filter(room => room?.name !== roomName);

            fetchRooms()

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

export default chatSlice.reducer;
