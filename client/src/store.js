import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// serial data reducer and api query service
import { serialDataApi } from "./services/serialDataApi";
import serialDataReducer from "./features/serialData/serialDataSlice";
// http data reducer and api query service
import { httpDataApi } from "./services/httpDataApi";
import httpDataReducer from "./features/httpData/httpDataSlice";

// Combine your reducers
const rootReducer = combineReducers({
  serialData: serialDataReducer,
  httpData: httpDataReducer,
  [serialDataApi.reducerPath]: serialDataApi.reducer,
  [httpDataApi.reducerPath]: httpDataApi.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["serialData", "httpData"], // Add the slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(serialDataApi.middleware, httpDataApi.middleware),
});

export const persistor = persistStore(store);

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
