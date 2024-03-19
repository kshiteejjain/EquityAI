import { configureStore } from '@reduxjs/toolkit';
// import thunk from 'redux-thunk'; // Import thunk from redux-thunk
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist'
import fetchNewsReducer from '../features/APIServices/FetchNews'

const reducers = combineReducers({
  news: fetchNewsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  // middleware: [thunk]
});

export const persistor = persistStore(store);
