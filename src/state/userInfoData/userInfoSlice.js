import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../api/axios";
import UrlPaths from "../../Models/UrlPaths";

const initialState = {
  userState:null,
  token: "",
};

// Async thunk to fetch user info
export const fetchUserInfo = createAsyncThunk(
  'userInfo/fetchUserInfo',
  async (token, { rejectWithValue }) => {
    try {
      console.log(token)
      const response = await instance.get(UrlPaths.GET_USER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
      

      state.userState = action.payload;;
    },
    extraReducers: (builder) => {
      builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
        console.log(state,action)
        return action.payload;
      });
      builder.addCase(fetchUserInfo.rejected, (state, action) => {
        // Handle error state if needed
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { getUser, addUser } = userInfoSlice.actions;

export default userInfoSlice.reducer;
