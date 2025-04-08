import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  board: {},
  listsOfBoard: [],
  allCardsInBoard: [],
  showForm: false,
  loading: true,
  error: null,
};

const boardListSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    getAllData: (state, action) => {
      state.listsOfBoard = action.payload.lists;
      state.allCardsInBoard = action.payload.cards;
      state.board = action.payload.board;
      state.loading = false;
      state.error = null; 
      state.showForm =false;
    },
    addNewList: (state, action) => {
      state.listsOfBoard.push(action.payload);
      state.showForm =false;
    },
    archiveList: (state, action) => {
      state.listsOfBoard = state.listsOfBoard.filter(
        (ele) => ele.id !== action.payload
      );
      state.showForm =false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false; 
    },
    showForm: (state, action) => {
      state.showForm = action.payload;
    },
    setLoading:(state,action)=>{
      state.loading=action.payload;
    },
    clearAllPrevData: (state) => {
      state.board = {};
      state.listsOfBoard = [];
      state.allCardsInBoard = [];
      state.showForm = false;
      state.loading = true;
      state.error = null;
    }
  },
});

export default boardListSlice.reducer; 

export const { getAllData, addNewList, setError, showForm, archiveList,clearAllPrevData } =
  boardListSlice.actions;
