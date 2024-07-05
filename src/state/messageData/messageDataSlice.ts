import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import instance from "../../api/axios";

interface Message {
  // Add properties of a message here
  // For example:
  id: string;
  content: string;
  // ... other properties
}

interface MessageDataState {
  messages: Message[];
  loading: boolean;
  isHome?: boolean;
  rerender?: boolean;
}

export const fetchMessagesByChatid = createAsyncThunk(
  "message/fetchMessageStatus",
  async (chatId: string) => {
    const response = await instance.get(`/api/message/${chatId}`);
    return response.data;
  }
);

const initialState: MessageDataState = {
  messages: [],
  loading: false,
};

export const messageDataSlice = createSlice({
  name: "messageData",
  initialState,
  reducers: {
    getDetail: (state) => state,
    addNewMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if ('isHome' in state) state.isHome = false;
    },
    addHomeDetail: (state) => {
      if ('isHome' in state) state.isHome = true;
    },
    addRerender: (state) => {
      if ('rerender' in state) state.rerender = !state.rerender;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByChatid.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessagesByChatid.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesByChatid.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { getDetail, addNewMessage, addHomeDetail, addRerender } =
  messageDataSlice.actions;
export default messageDataSlice.reducer;