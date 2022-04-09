import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import serverDetailReducer from './serverDetailData/serverDetailSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    serverDetail: serverDetailReducer,
  },
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware({
      serializableCheck:false
    })
  },

})