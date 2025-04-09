// checkListSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  checkLists: [],
  error: null,
};

const checkListSlice = createSlice({
  name: "checkLists",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    fetchChecklists(state, action) {
      state.checkLists = action.payload;
    },
    addCheckList(state, action) {
      state.checkLists.push(action.payload);
    },
    deleteCheckList(state, action) {
      state.checkLists = state.checkLists.filter(
        (checkList) => checkList.id !== action.payload
      );
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  fetchChecklists,
  addCheckList,
  deleteCheckList,
  setError,
} = checkListSlice.actions;

export default checkListSlice.reducer;
