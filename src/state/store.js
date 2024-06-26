import { configureStore } from '@reduxjs/toolkit'
import modalShowReducer from './counter/modalShowSlice'
import muiModalShowReducer from './muiModalState/muiModalState'
import serverDetailReducer from './serverDetailData/serverDetailSlice'
import messageDetailReducer from './messageData/messageDataSlice'
import userInfoReducer, { fetchUserInfo } from './userInfoData/userInfoSlice'

// redux-persist
import storage from 'redux-persist/lib/storage';
import {combineReducers} from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

const rootReducer = combineReducers({
  modalShow: modalShowReducer,
  muiModalShow: muiModalShowReducer,
  serverDetail: serverDetailReducer,
  userInfo:  userInfoReducer,
  messageDetail: messageDetailReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['modalShow', 'messageDetail'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);



const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>{
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['payload.isGroupChat'],

      }
    })
  },

})

export const persistor = persistStore(store);

// Check if userInfo is null and token is available in localStorage
const token = localStorage.getItem('diskGodUserToken');
if (token) {
  store.dispatch(fetchUserInfo("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc5OTcwMmIwMTY3MTk5NzdmMzU0YmUiLCJpYXQiOjE3MTk0MjYzMTIsImV4cCI6MTcyMDAzMTExMn0.5wZW2Z-GnOiBkSs-YgsDzhWimHfCWYdhaiFujEfn5Uc"));
}

export default store;