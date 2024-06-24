import { configureStore } from '@reduxjs/toolkit'
import modalShowReducer from './counter/modalShowSlice'
import muiModalShowReducer from './muiModalState/muiModalState'
import serverDetailReducer from './serverDetailData/serverDetailSlice'
import messageDetailReducer from './messageData/messageDataSlice'
import userInfoReducer from './userInfoData/userInfoSlice'

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
export default store;