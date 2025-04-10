import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

const API_CREDENTIALS = { key: apiKey, token: apiToken };

const fetchAllCardsFromApi = async (boardId) => {
  return await axios.get(`https://api.trello.com/1/boards/${boardId}/cards`, {
    params: { ...API_CREDENTIALS },
    headers: { Accept: "application/json" },
  });
};

const addNewCardFromApi = async ( {name, listId }) => {
  
  return await axios.post("https://api.trello.com/1/cards", null, {
    params: { name, idList: listId, ...API_CREDENTIALS },
  });
};

const deleteCardFromApi = async (id) => {
  return await axios.delete(`https://api.trello.com/1/cards/${id}`, {
    params: { ...API_CREDENTIALS },
  });
};

export const fetchAllCardsInBoard = createAsyncThunk(
  "card/fetchAllCardsInBoard",
  async (boardId) => {
    const response = await fetchAllCardsFromApi(boardId);
    return response.data;
  }
);
export const addNewCard = createAsyncThunk(
  "card/addNewCard",
  async ({ name, listId }, { rejectWithValue }) => {

    try {
      const response = await addNewCardFromApi({ name, listId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const deleteCard = createAsyncThunk("card/deleteCard", async (id) => {
  await deleteCardFromApi(id);
  return id;
});

const cardSlice = createSlice({
  name: "card",
  initialState: {
    cards: [],
    status: "idle",
    error: null,
    selectedCard: null,
    showForm: false,
  },
  reducers: {
    clearCard: (state) => {
      state.cards = null;
    },
    setSelectedCard: (state, action) => {
      state.selectedCard = action.payload;
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
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
      })
      .addCase(addNewCard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards.push(action.payload);
      })
      .addCase(addNewCard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteCard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cards = state.cards.filter((card) => card.id !== action.payload);
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cardSlice.reducer;

export const { clearCard, setSelectedCard, setShowForm } = cardSlice.actions;
