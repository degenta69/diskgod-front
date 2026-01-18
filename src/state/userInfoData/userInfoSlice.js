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
      // payload can be just user object OR { user, token }
      if (action.payload.token) {
        state.token = action.payload.token;
        state.user = action.payload.user; // standardized
        state.newUser = action.payload.user; // legacy support
      } else {
        state.newUser = action.payload;
        state.user = action.payload; // sync them
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    updateOnlineUser: (state, action) => {
      const { userId, isOnline } = action.payload;
      if (!state.onlineUsers) state.onlineUsers = {}; // Ensure it exists
      if (isOnline) {
        state.onlineUsers[userId] = true;
      } else {
        delete state.onlineUsers[userId];
      }
    },
    logoutUser: (state) => {
      state.user = initialState.user;
      state.newUser = initialState.newUser;
      state.token = "";
      state.onlineUsers = {};
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
// Action creators are generated for each case reducer function
export const { getUser, addUser, updateOnlineUser, logoutUser, setToken } = userInfoSlice.actions;

export default userInfoSlice.reducer;
