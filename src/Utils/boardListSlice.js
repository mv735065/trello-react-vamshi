import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const fetchListsFromApi = async (boardId) => {
  return await axios.get(`https://api.trello.com/1/boards/${boardId}/lists`, {
    params: {
      ...API_CREDENTIALS,
    },
    headers: {
      Accept: "application/json",
    },
  });
};

export const fetchlistsOfSingleBoard = createAsyncThunk(
  "list/fetchlistsOfSingleBoard",
  async (boardId) => {
    const response = await fetchListsFromApi(boardId);
    return response.data;
  }
);

const archiveListFromApi = async (id) => {
  const response = await axios.put(
    `https://api.trello.com/1/lists/${id}/closed`,
    null,
    {
      params: { value: true, ...API_CREDENTIALS },
      headers: {
        Accept: "application/json",
      },
    }
  );
  return response.data;
};

export const archiveList = createAsyncThunk(
  "list/archiveList",
  async (id, { rejectWithValue }) => {
    try {
      const data = await archiveListFromApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const addNewListToApi = async (boardId, listName) => {
  const response = await axios.post("https://api.trello.com/1/lists", null, {
    params: {
      name: listName,
      idBoard: boardId,
      ...API_CREDENTIALS,
    },
    headers: { Accept: "application/json" },
  });
  return response.data;
};

export const addNewList = createAsyncThunk(
  "list/addNewList",
  async ({ boardId, listName }) => {
    console.log(listName);
    
    const data = await addNewListToApi(boardId, listName);
    console.log(data.name);
    
    return data;
  }
);

const boardListSlice = createSlice({
  name: "list",
  initialState: {
    status: "idle",
    lists: [],
    error: null,
  },
  reducers: {
    clearLists: (state) => {
      state.lists = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchlistsOfSingleBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchlistsOfSingleBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = action.payload;
      })
      .addCase(fetchlistsOfSingleBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error?.message || "An error occurred while fetching the lists";
      })
      .addCase(archiveList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = state.lists.filter(
          (list) => list.id !== action.payload.id
        );
      })
      .addCase(archiveList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addNewList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists.push(action.payload);
        console.log(action.payload);
        
      })
      .addCase(addNewList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default boardListSlice.reducer;
export const { clearLists } = boardListSlice.actions;
