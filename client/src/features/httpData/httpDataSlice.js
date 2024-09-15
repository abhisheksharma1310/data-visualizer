import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseUrl: "http://localhost:5000/serial/",
};

const httpDataSlice = createSlice({
  name: "httpData",
  initialState,
  reducers: {
    setBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
  },
});

export const { setBaseUrl } = httpDataSlice.actions;
export default httpDataSlice.reducer;
