import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../api/axios";
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
    updateReadStatus: (state, action) => {
      const { chatId, userId } = action.payload;
      // Efficiently update - simplistic since we assume all messages in this chat are read by this user
      // In a real paginated app, we might only update visible ones.
      // For now, iterate all since conversation size is small-ish
      state.messages.forEach((msg, index) => {
        // Check if message belongs to this chat (redundant if store only has this chat's messages, but safe)
        const msgChatId = msg.chat ? (msg.chat._id || msg.chat) : null;

        // Loose comparison for ID safety (String vs Object)
        if (msgChatId && msgChatId.toString() === chatId.toString()) {
          // Initialize readBy if missing
          if (!msg.readBy) msg.readBy = [];

          if (!msg.readBy.includes(userId)) {
            msg.readBy.push(userId);
          }
        }
      });
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
export const { getDetail, addNewMessage, addHomeDetail, addRerender, updateReadStatus } =
  messageDataSlice.actions;
export default messageDataSlice.reducer;
