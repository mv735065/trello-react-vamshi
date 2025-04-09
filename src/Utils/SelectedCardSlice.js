import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const SelectedCardSlice = createSlice({
  name: "selectedCard",
  initialState: null,
  reducers: {
    setSelectedCard: (state, action) => {
      return action.payload;
    },
  },
});

export default SelectedCardSlice.reducer;
export const {setSelectedCard} =SelectedCardSlice.actions
