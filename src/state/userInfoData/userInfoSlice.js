import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    _id: "",
    name: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    profilepic: "",
    dob: "",
  },
  newUser: {
    name: "",
    email: "",
    id: "",
    dob: "",
  },
  token: "",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    getUser: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state;
    },
    addUser: (state, action) => {

      state.newUser = action.payload;;
    },
    // addHomeDetail: (state, action) => {
    //   state.userName = action.payload.userName;
    //   state.userEmail = action.payload.userEmail;
    //   state.userId = action.payload.userId;
    //   state.userAvatar = action.payload.userAvatar;
    //   state.userStatus = action.payload.userStatus;
    //   state.userStatusMessage = action.payload.userStatusMessage;
    //   state.isHome = true;
    //   return { ...state };
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const { getUser, addUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;
