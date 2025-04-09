import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const fetchAllCardsFromApi = async (boardId) => {
  return await axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
    params: {
      ...API_CREDENTIALS,
    },
    headers: {
      Accept: "application/json",
    },
  });
};

export const fetchAllCardsInBoard = createAsyncThunk(
  "card/fetchAllCardsInBoard",
  async (boardId) => {
    const response = await fetchAllCardsFromApi(boardId);
    return response.data;
  }
);

const cardSlice = createSlice({
  name: "card",
  initialState: {
    cards: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCard: (state) => {
        state.cards = null;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCardsInBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCardsInBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = action.payload;
      })
      .addCase(fetchAllCardsInBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cardSlice.reducer;

export const {clearCard}=cardSlice.actions;
