import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const fetchBoardsFromApi = async () => {
  const response = await axios.get(
    "https://api.trello.com/1/members/me/boards",
    {
      params: API_CREDENTIALS,
      headers: { Accept: "application/json" },
    }
  );
  return response;
};

const addNewBoardFromApi = async (name) => {
  const response = await axios.post("https://api.trello.com/1/boards/", null, {
    params: { name: name, ...API_CREDENTIALS },
  });
  return response;
};

const fetchSingleBoardFromApi = async(id) => {
    const response = await axios.get(`https://api.trello.com/1/boards/${id}`, {
      params: {
        ...API_CREDENTIALS,
      },
      headers: {
        Accept: "application/json",
      },
    });
    return response;
  }
  export const fetchSingleBoard=createAsyncThunk("board/fetchSingleBoard", async (id) => {
    const response = await fetchSingleBoardFromApi(id);
    return response.data;
  });


export const fetchBoards = createAsyncThunk("board/fetchBoards", async () => {
  const response = await fetchBoardsFromApi();
  return response.data;
});

export const addBoard = createAsyncThunk("board/addBoard", async (name) => {
    const response = await addNewBoardFromApi(name);
    return response.data;
  });



const boardSlice = createSlice({
  name: "board",
  initialState: {
    status: "idle",
    boards: [],
    currentBoard:null,
    error: null,
  },
  reducers: {
    clearBoard: (state) => {
      state.currentBoard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch boards";
      })

      .addCase(addBoard.fulfilled,(state,action)=>{
        state.boards.push(action.payload);
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      })

      .addCase(fetchSingleBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBoard = action.payload; // Store single board data
        
      })
      .addCase(fetchSingleBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch the board";
      })
     
     
  },
});

export default boardSlice.reducer;

export const {clearBoard}=boardSlice.actions;
