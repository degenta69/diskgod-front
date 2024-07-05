import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../Models/Interfaces/User";



interface UserInfoState {
  currentUser: User;
  newUser: User; // Keeping this for compatibility, but using the same User interface
  token: string;
}

const initialState: UserInfoState = {
  currentUser: {
    _id: "",
    name: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    profilepic: "",
    dob: "",
  },
  newUser: {
    _id: "",
    name: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    profilepic: "",
    dob: "",
  },
  token: "",
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    setNewUser: (state, action: PayloadAction<User>) => {
      state.newUser = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearUserInfo: (state) => {
      return initialState;
    },
  },
});

export const { setCurrentUser, setNewUser, setToken, clearUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;