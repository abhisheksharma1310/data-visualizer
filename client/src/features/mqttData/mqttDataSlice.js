import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  host: "ws://127.0.0.1:9001",
  options: {
    keepalive: 60,
    clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    userName: "",
    password: "",
  },
  receivedMessages: [],
  sendMessage: "",
  subscribeToTopic: "",
  publishToTopic: "",
};

const mqttDataSlice = createSlice({
  name: "mqttData",
  initialState,
  reducers: {
    setMqttDetails: (state, action) => {
      state.host = action.payload.host;
      state.options = action.payload.options;
    },
    setReceivedMessages: (state, action) => {
      const date = new Date();
      const obj = {
        timestamp: date,
        data: JSON.stringify(action.payload),
      };
      state.receivedMessages =
        state.receivedMessages.length > 0
          ? [obj, ...state.receivedMessages]
          : [obj];
    },
    setSendMessage: (state, action) => {
      state.sendMessage = action.payload;
    },
    setSubscribeToTopic: (state, action) => {
      state.subscribeToTopic = action.payload;
    },
    setPublishToTopic: (state, action) => {
      state.publishToTopic = action.payload;
    },
    setClearMessage: (state, action) => {
      state.receivedMessages = [];
    },
  },
});

export const {
  setMqttDetails,
  setReceivedMessages,
  setSendMessage,
  setSubscribeToTopic,
  setPublishToTopic,
  setClearMessage,
} = mqttDataSlice.actions;

export default mqttDataSlice.reducer;
