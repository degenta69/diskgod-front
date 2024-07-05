import { configureStore, combineReducers } from '@reduxjs/toolkit';
import modalShowReducer from './counter/modalShowSlice';
import muiModalShowReducer from './muiModalState/muiModalState';
import serverDetailReducer from './serverDetailData/serverDetailSlice';
import messageDetailReducer from './messageData/messageDataSlice';
import userInfoReducer from './userInfoData/userInfoSlice';

import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  PersistConfig,
} from 'redux-persist';

const rootReducer = combineReducers({
  modalShow: modalShowReducer,
  muiModalShow: muiModalShowReducer,
  serverDetail: serverDetailReducer,
  userInfo: userInfoReducer,
  messageDetail: messageDetailReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['modalShow', 'messageDetail'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ['payload.isGroupChat'],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export default store;