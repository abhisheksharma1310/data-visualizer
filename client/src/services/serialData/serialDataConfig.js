import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: {
    comport: "COM50",
    baudrate: 9600,
    datatype: "json",
  },
  options: {
    pollingInterval: 0,
    refetchOnMountOrArgChange: false,
    skip: false,
  },
};

const serialDataConfigSlice = createSlice({
  name: "serialDataConfig",
  initialState,
  reducers: {
    setConfig: (state, action) => {
      state.query = action.payload.query;
      state.options = action.payload.options;
    },
    resetConfig: (state, action) => {
      state.query = initialState.query;
      state.options = initialState.options;
    },
  },
});

export const { setConfig, resetConfig } = serialDataConfigSlice.actions;

export default serialDataConfigSlice.reducer;
