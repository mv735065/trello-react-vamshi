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
    error: null,
  },
  reducers: {},
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
        state.error = action.error.message;
      });

      builder
      .addCase(addBoard.fulfilled,(state,action)=>{
        state.boards.push(action.payload);
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; 
      });
  },
});

export default boardSlice.reducer;
