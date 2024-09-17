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
  },
  receivedMessage: "",
  sendMessage: "",
  subscribeToTopic: "temp",
  publishToTopic: "temperature",
};

const mqttDataSlice = createSlice({
  name: "mqttData",
  initialState,
  reducers: {
    setMqttDetails: (state, action) => {
      state.host = action.payload.host;
      state.options = action.payload.options;
    },
    setReceivedMessage: (state, action) => {
      state.receivedMessage = action.payload;
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
  },
});

export const {
  setMqttDetails,
  setReceivedMessage,
  setSendMessage,
  setSubscribeToTopic,
  setPublishToTopic,
} = mqttDataSlice.actions;

export default mqttDataSlice.reducer;
