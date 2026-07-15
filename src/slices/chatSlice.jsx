import { createSlice } from '@reduxjs/toolkit';
import api from '../services/Axios';
import { API_ENDPOINTS } from "../services/apiEndpoints";
import { showMessage } from '../components/AlertMessage';

const initialState = {
    currentChats: [], // Liste des rooms actuellement actives (sans doublon)
    deleteChat: null,
    currentChat:null,
    userSlected: null,
    messageNotif: [],
};

const chatSlice = createSlice({

    name: 'chat',

    initialState,

    reducers: {

        // ➕ Ajouter une room s'il n'existe pas déjà
        addRoom: (state, action) => {

            if (!action.payload?.pk) return

            const exists = state.currentChats.some(room => room?.pk === action.payload?.pk);

            if (!exists) {

                state.currentChats.push(action.payload);
            }
        },

        // ➖ Supprimer une room par nom
        removeRoom: (state, action) => {

            if (!action.payload) return 

            const room_pk = action.payload?.pk;

            // Si le chat supprimé est le chat courant, on le réinitialise
            if (state.currentChat?.pk === room_pk) {

                state.currentChat = null;
            }

            // Supprimer localement le chat de la liste
            state.currentChats = state.currentChats.filter(room => room?.pk !== room_pk);
        },

        // 🧹 Vider toutes les rooms
        clearRooms: (state) => {
            state.currentChats = [];
            state.userSlected = null;
            state.currentChat=null
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addUser: (state, action) => {
       
            state.userSlected = action?.payload
           
        },

        // ➕ Ajouter une room s'il n'existe pas déjà
        addCurrentChat: (state, action) => {

            state.currentChat= action?.payload

        },
        addChatMessage: (state, action) => {
            if (!state.currentChat) return;

            const message = action.payload;

            const exists = state.currentChat.messages.some(
                m => m.id === message.id
            );

            if (!exists) {
                state.currentChat.messages.push(message);
            }
        },
        addPendingMessage: (state, action) => {
            if (!state.currentChat) return;

            state.currentChat.messages.push(action.payload);
        },
        confirmPendingMessage: (state, action) => {
            if (!state.currentChat) return;

            const message = action.payload;

            const index = state.currentChat.messages.findIndex(
                m => m.pending && m.text === message.text
            );

            if (index !== -1) {
                state.currentChat.messages[index] = message;
            } else {
                const exists = state.currentChat.messages.some(
                    m => m.id === message.id
                );

                if (!exists) {
                    state.currentChat.messages.push(message);
                }
            }
        },
        addMessageNotif: (state, action) => {

            if (state.currentChats.includes(action?.payload)) return 

            state.messageNotif.push(action?.payload)

        },

        removeMessageNotif: (state) => {
            state.messageNotif = state.messageNotif.slice(1);
        },
        cleanAllMessageNotif: (state) => {
            state.messageNotif = [];
        },

        getDeleteChat: (state, action) => {

            state.deleteChat = action.payload;

        },
    },
});

export const { addRoom, removeRoom, clearRooms, addUser, addCurrentChat, addChatMessage, addPendingMessage, confirmPendingMessage, addMessageNotif,
    removeMessageNotif, cleanAllMessageNotif, getDeleteChat} = chatSlice.actions;

export const deleteRoomAsync = (room) => async (dispatch) => {

    // Mise à jour optimiste du store
    dispatch(getDeleteChat(room));

    try {

        await api.delete(API_ENDPOINTS.CHAT.DELETE_ROOM(room?.pk));

    } catch (err) {

        console.error("ChatSlice.jsx = Erreur de suppression", err);

        // La suppression a échoué côté serveur : on remet la conversation
        // dans la liste plutôt que de la laisser disparaître silencieusement.
        dispatch(addRoom(room));

        showMessage(dispatch, {
            Type: "Erreur",
            Message: "Impossible de supprimer cette discussion. Réessayez.",
        });
    }
};

export default chatSlice.reducer;
