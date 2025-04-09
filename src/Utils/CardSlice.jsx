import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
  loading: true,
  error: null,
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    addNewCard: (state, action) => {
      state.cards.push(action.payload);
      state.showForm = false;
    },
    getAllCards: (state, action) => {
      state.cards = action.payload;
    },
    deleteCard: (state, action) => {
      state.cards = state.cards.filter((ele) => ele.id !== action.payload);
      state.selectedCard = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

  },
});

export default cardSlice.reducer;

export const {
  addNewCard,
  getAllCards,
  deleteCard,
  setError,
} = cardSlice.actions;
