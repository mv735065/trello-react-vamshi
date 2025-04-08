import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  loading: true,
  error: null,
  showForm: false,
};

const boardSlice = createSlice({
  name: 'boarding',
  initialState,
  reducers: {
    addNewBoard: (state, action) => {
      state.boards.push(action.payload);
      state.showForm = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAllBoards: (state, action) => {
      state.boards = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
  },
});

export const {
  addNewBoard,
  setLoading,
  setAllBoards,
  setError,
  setShowForm,
} = boardSlice.actions;

export default boardSlice.reducer;
