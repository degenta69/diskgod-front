import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServerUser {
  name: string;
  email: string;
}

interface ChatState {
  isGroupChat: boolean;
  users: ServerUser[];
  _id: string;
  chatName: string;
  groupAdmin: ServerUser;
}

interface ServerDetailState {
  isHome: boolean;
  name: string;
  email: string;
  userId: string;
  profilePic: string;
  userStatus: string;
  userStatusMessage: string;
  currentChat: ChatState;
  rerender: boolean;
}

const initialChatState: ChatState = {
  isGroupChat: false,
  users: [{ name: "", email: "" }, { name: "", email: "" }, { name: "", email: "" }],
  _id: "",
  chatName: "",
  groupAdmin: { name: "", email: "" },
};

const initialState: ServerDetailState = {
  isHome: true,
  name: "",
  email: "",
  userId: "",
  profilePic: "",
  userStatus: "",
  userStatusMessage: "",
  currentChat: initialChatState,
  rerender: false,
};

export const serverDetailSlice = createSlice({
  name: "serverDetail",
  initialState,
  reducers: {
    setServerDetail: (state, action: PayloadAction<Partial<ServerDetailState>>) => {
      return { ...state, ...action.payload, isHome: false };
    },
    setCurrentChat: (state, action: PayloadAction<ChatState>) => {
      state.currentChat = action.payload;
      state.isHome = false;
    },
    setHomeDetail: (state) => {
      state.isHome = true;
    },
    toggleRerender: (state) => {
      state.rerender = !state.rerender;
    },
  },
});

export const { setServerDetail, setCurrentChat, setHomeDetail, toggleRerender } = serverDetailSlice.actions;

export default serverDetailSlice.reducer;