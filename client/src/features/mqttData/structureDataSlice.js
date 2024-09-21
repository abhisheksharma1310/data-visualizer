import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLog: [],
};

const structureDataSlice = createSlice({
  name: "structureData",
  initialState,
  reducers: {
    addNewData: (state, action) => {
      const date = new Date().toLocaleTimeString();
      const obj = {
        time: date,
        ...action.payload,
      };
      state.dataLog = [obj, ...state.dataLog];
      console.log("r: ", action.payload);
    },
    clearData: (state) => {
      state.dataLog = [];
    },
  },
});

export const { addNewData, clearData } = structureDataSlice.actions;

export default structureDataSlice.reducer;
