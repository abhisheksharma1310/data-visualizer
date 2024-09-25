import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serverAddress: "wss://echo.websocket.org",
  message: "",
  receivedMessages: [],
  connectionStatus: "Disconnected",
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setServerAddress: (state, action) => {
      state.serverAddress = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    addReceivedMessage: (state, action) => {
      const date = new Date().toLocaleTimeString();
      const obj = {
        time: date,
        data: action.payload,
      };
      state.receivedMessages = [obj, ...state.receivedMessages];
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    clearMessages: (state) => {
      state.receivedMessages = [];
    },
  },
});

export const {
  setServerAddress,
  setMessage,
  addReceivedMessage,
  setConnectionStatus,
  clearMessages,
} = webSocketSlice.actions;

export default webSocketSlice.reducer;
