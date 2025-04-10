import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const fetchCheckListsFromApi = async (cardId) => {
  return await axios.get(
    `https://api.trello.com/1/cards/${cardId}/checklists`,
    {
      params: {
        ...API_CREDENTIALS,
      },
      headers: { Accept: "application/json" },
    }
  );
};
export const fetchCheckLists = createAsyncThunk(
  "checklist/fetchCheckLists",
  async (cardId) => {
    const response = await fetchCheckListsFromApi(cardId);
    return response.data;
  }
);

const checkListSlice = createSlice({
  name: "checkList",
  initialState: {
    checklists: [],
    isLoading: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckLists.pending, (state) => {
        state.isLoading = 'loading';
        state.error = null;
      })
      .addCase(fetchCheckLists.fulfilled, (state, action) => {
        state.isLoading = 'resolved';
        state.checklists = action.payload;
      })
      .addCase(fetchCheckLists.rejected, (state, action) => {
        state.isLoading = 'rejecetd';
        state.error = action.payload;
      });
  },
});

export default checkListSlice.reducer;


