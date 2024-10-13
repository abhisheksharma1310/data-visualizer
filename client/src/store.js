import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
// navDetail reducer
import navDetailReducer from "./features/navDetail/navDetailSlice";
// serial data reducer and api query service
import { serialDataApi } from "./services/serialDataApi";
import serialDataReducer from "./features/serialData/serialDataSlice";
// http data reducer and api query service
import { httpDataApi } from "./services/httpDataApi";
import httpDataReducer from "./features/httpData/httpDataSlice";
// mqtt data reducer
import mqttReducer from "./features/mqttData/mqttDataSlice";
// webSocket data reducer
import webSocketReducer from "./features/webSocket/webSocketSlice";
// socketIo data reducer
import socketIoReducer from "./features/Socket.io/socketSlice";

// Combine your reducers
const rootReducer = combineReducers({
  navDetail: navDetailReducer,
  serialData: serialDataReducer,
  httpData: httpDataReducer,
  mqttData: mqttReducer,
  webSocket: webSocketReducer,
  socketIo: socketIoReducer,
  [serialDataApi.reducerPath]: serialDataApi.reducer,
  [httpDataApi.reducerPath]: httpDataApi.reducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["navDetail", "serialData", "httpData", "mqttData"], // Add the slices you want to persist
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
