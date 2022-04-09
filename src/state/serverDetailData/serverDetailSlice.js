import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isHome: false,
  userName:'',
  userEmail:'',
  userId:'',
  userAvatar:'',
  userStatus:'',
  userStatusMessage:'',
  newState:'{"isGroupChat":true,"users":[{"name":"John Doe","email":"jon@example.com"},{"name":"Piyush","email":"piyush@example.com"},{"name":"Guest User","email":"guest@example.com"}],"_id":"617a518c4081150716472c78","chatName":"Friends","groupAdmin":{"name":"Guest User","email":"guest@example.com"}}',

}

export const serverDetailSlice = createSlice({
  name: 'serverDetail',
  initialState,
  reducers: {
    getDetail: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return state
    },
    addServerDetail: (state, action) => {
      const newState = JSON.stringify(action.payload)
      if(action.payload.home){
        state.isHome = true
      }else{
        state.isHome = false
      }
      return {...state,newState: newState}
    },
    addHomeDetail: (state, action) => {  
      state.userName = action.payload.userName
      state.userEmail = action.payload.userEmail
      state.userId = action.payload.userId
      state.userAvatar = action.payload.userAvatar
      state.userStatus = action.payload.userStatus
      state.userStatusMessage = action.payload.userStatusMessage
      state.isHome = true
      return {...state}
    },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { getDetail, addServerDetail } = serverDetailSlice.actions

export default serverDetailSlice.reducer