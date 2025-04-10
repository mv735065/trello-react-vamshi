import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const deleteCheckListFromApi = async (cardId, checkListId) => {
  return await axios.delete(
    `https://api.trello.com/1/cards/${cardId}/checklists/${checkListId}`,
    {
      params: { ...API_CREDENTIALS },
    }
  );
};

const addNewCheckListToApi = async (name, cardId) => {
  return await axios.post(`https://api.trello.com/1/checklists`, null, {
    params: {
      name: name,
      idCard: cardId,
      ...API_CREDENTIALS,
    },
  });
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

export const deleteCheckList = createAsyncThunk(
  "checklist/deleteCheckList",
  async ({ cardId, checkListId }, { rejectWithValue }) => {
    try {
      await deleteCheckListFromApi(cardId, checkListId);
      return checkListId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete checklist");
    }
  }
);

export const addNewCheckList = createAsyncThunk(
  "checklist/addNewCheckList",
  async ({ name, cardId }, { rejectWithValue }) => {
    try {
      const response = await addNewCheckListToApi(name, cardId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add checklist");
    }
  }
);

export const fetchCheckLists = createAsyncThunk(
  "checklist/fetchCheckLists",
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await fetchCheckListsFromApi(cardId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch checklists");
    }
  }
);

const checkListSlice = createSlice({
  name: "checkList",
  initialState: {
    checklists: [],
    isLoading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckLists.pending, (state) => {
        state.isLoading = "loading";
        state.error = null;
      })
      .addCase(fetchCheckLists.fulfilled, (state, action) => {
        state.isLoading = "resolved";
        state.checklists = action.payload;
      })
      .addCase(fetchCheckLists.rejected, (state, action) => {
        state.isLoading = "rejected";
        state.error = action.payload;
      })

      .addCase(addNewCheckList.pending, (state) => {
        state.isLoading = "loading";
        state.error = null;
      })
      .addCase(addNewCheckList.fulfilled, (state, action) => {
        state.isLoading = "resolved";
        state.checklists.push(action.payload);
      })
      .addCase(addNewCheckList.rejected, (state, action) => {
        state.isLoading = "rejected";
        state.error = action.payload;
      })

      .addCase(deleteCheckList.pending, (state) => {
        state.isLoading = "loading";
        state.error = null;
      })
      .addCase(deleteCheckList.fulfilled, (state, action) => {
        state.isLoading = "resolved";
        state.checklists = state.checklists.filter(
          (checkList) => checkList.id !== action.payload
        );
      })
      .addCase(deleteCheckList.rejected, (state, action) => {
        state.isLoading = "rejected";
        state.error = action.payload;
      });
  },
});

export default checkListSlice.reducer;
