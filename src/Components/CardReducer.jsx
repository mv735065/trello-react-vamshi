import React from "react";

export const initialState = {
  cards: [],
  isLoading: false,
  isError: null,
};

const CardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "addNewCard":
      return {
        ...state,
        cards: [...state.cards, action.data],
      };
    case "deleteCard": {
      return {
        ...state,
        cards: state.cards.filter((ele) => ele.id != action.id),
      };
    }
    default:
      return state;
  }
};

export default CardReducer;
