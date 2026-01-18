import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    targetUser: null, // The user object to display
};

export const profileModalSlice = createSlice({
    name: "profileModal",
    initialState,
    reducers: {
        openProfileModal: (state, action) => {
            // action.payload should be the user object
            state.isOpen = true;
            state.targetUser = action.payload;
        },
        closeProfileModal: (state) => {
            state.isOpen = false;
            state.targetUser = null;
        },
    },
});

export const { openProfileModal, closeProfileModal } = profileModalSlice.actions;

export default profileModalSlice.reducer;
