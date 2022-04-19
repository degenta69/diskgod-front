import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isHome: true,
  name: "",
  email: "",
  userId: "",
  profilePic: "",
  userStatus: "",
  userStatusMessage: "",
  newState:
    '{"isGroupChat":false,"users":[{"name":"","email":""},{"name":"","email":""},{"name":"","email":""}],"_id":"","chatName":"","groupAdmin":{"name":"","email":""}}',
  rerender:false
  };

export const serverDetailSlice = createSlice({
  name: "serverDetail",
  initialState,
  reducers: {
    getDetail: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state;
    },
    addServerDetail: (state, action) => { state.newState = JSON.stringify(action.payload); state.isHome = false},
    addHomeDetail: (state) => {state.isHome = true}, 
    addRerender: (state) => {state.rerender = !state.rerender}
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
});

// Action creators are generated for each case reducer function
export const { getDetail, addServerDetail, addHomeDetail, addRerender } =
  serverDetailSlice.actions;

export default serverDetailSlice.reducer;
