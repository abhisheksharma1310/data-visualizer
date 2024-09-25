import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseUrl: "https://jsonplaceholder.typicode.com/posts",
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
