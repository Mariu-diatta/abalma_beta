// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    aiChat:null
};

const aiSlice = createSlice({

    name: 'aiChat',

    initialState,

    reducers: {

        addAiChat: (state, action) => {
            state.aiChat=action.payload
        }

    },
});


export const { addAiChat } = aiSlice.actions;

export default aiSlice.reducer;





