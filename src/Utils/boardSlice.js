import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};


const fetchBoardsFromApi = async () => {
  const response = await axios.get("https://api.trello.com/1/members/me/boards", {
    params: API_CREDENTIALS,
    headers: { Accept: "application/json" },
  });
  return response;
};

const addNewBoardFromApi = async (name) => {
  const response = await axios.post("https://api.trello.com/1/boards/", null, {
    params: { name, ...API_CREDENTIALS },
  });
  return response;
};

const fetchSingleBoardFromApi = async (boardId) => {
  const response = await axios.get(`https://api.trello.com/1/boards/${boardId}`, {
    params: { ...API_CREDENTIALS },
    headers: { Accept: "application/json" },
  });
  return response;
};

const deleteBoardFromApi = async (id) => {
  const response = await axios.delete(`https://api.trello.com/1/boards/${id}`, {
    params: { ...API_CREDENTIALS },
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

export const fetchSingleBoard = createAsyncThunk("board/fetchSingleBoard", async (id) => {
  const response = await fetchSingleBoardFromApi(id);
  return response.data;
});

export const deleteBoard = createAsyncThunk("board/deleteBoard", async (boardId, { rejectWithValue }) => {
  try {
    await deleteBoardFromApi(boardId);
    return boardId;
  } catch (err) {
    return rejectWithValue(err.message || "Failed to delete board");
  }
});


const boardSlice = createSlice({
  name: "board",
  initialState: {
    status: "idle",
    boards: [],
    currentBoard: null,
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

      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchSingleBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBoard = action.payload;
      })
      .addCase(fetchSingleBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch the board";
      })

      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((board) => board.id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});


export const { clearBoard } = boardSlice.actions;
export default boardSlice.reducer;
