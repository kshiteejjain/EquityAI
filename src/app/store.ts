import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import fetchTickersReducer from '../features/APIServices/FetchTickerSlice';
import fetchTickerDetailReducer from '../features/APIServices/FetchTickerDetailSlice';
import fetchNewsReducer from '../features/APIServices/FetchNews';
import fetchStockFinancialsReducer from '../features/APIServices/StockFinancialsSlice';
//import thunk from 'redux-thunk'; // Import thunk from redux-thunk

const reducers = combineReducers({
  tickers: fetchTickersReducer,
  tickerDetail: fetchTickerDetailReducer,
  news: fetchNewsReducer,
  stockFinancials: fetchStockFinancialsReducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  //middleware: [thunk]
})

export const persistor = persistStore(store)
