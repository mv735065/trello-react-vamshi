import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const fetchSingleBoardFromApi = async (id) => {
  const response = await axios.get(`https://api.trello.com/1/boards/${id}`, {
    params: {
      ...API_CREDENTIALS,
    },
    headers: {
      Accept: "application/json",
    },
  });
  return response;
};

export const fetchSingleBoard = createAsyncThunk(
  "board/fetchSingleBoard",
  async (id) => {
    const response = await fetchSingleBoardFromApi(id);
    return response.data;
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    currentBoard: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBoard = action.payload;
      })
      .addCase(fetchSingleBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default boardSlice.reducer;
