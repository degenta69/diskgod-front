import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../axios";
// First, create the thunk
export const fetchMessagesByChatid = createAsyncThunk(
  "message/fetchMessageStatus",
  async (chatId, thunkAPI) => {
    const response = await instance.get(`/api/message/${chatId}`);
    return response.data;
  }
);

const initialState = {
  messages: [{}],
  loading: false,
};

export const messageDataSlice = createSlice({
  name: "messageData",
  initialState,
  reducers: {
    getDetail: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state;
    },
    addNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
      state.isHome = false;
    },
    addHomeDetail: (state) => {
      state.isHome = true;
    },
    addRerender: (state) => {
      state.rerender = !state.rerender;
    },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
  extraReducers: {
    [fetchMessagesByChatid.pending]: (state) => {
      state.loading = true;
    },
    [fetchMessagesByChatid.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.messages = payload;
    },
    [fetchMessagesByChatid.rejected]: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getDetail, addNewMessage, addHomeDetail, addRerender } =
  messageDataSlice.actions;
export default messageDataSlice.reducer;
