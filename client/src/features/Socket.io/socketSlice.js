import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isConnected: false,
  connectionDetails: {},
};

const socketIoSlice = createSlice({
  name: "socketIo",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state, action) => {
      state.messages = [];
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    setConnectionDetails: (state, action) => {
      state.connectionDetails = action.payload;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  setConnectionStatus,
  setConnectionDetails,
} = socketIoSlice.actions;

export default socketIoSlice.reducer;
