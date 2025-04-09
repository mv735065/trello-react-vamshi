import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const checkListItemsSlice = createSlice({
  name: 'checkListItems',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    deleteItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleItem(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.state = item.state === 'complete' ? 'incomplete' : 'complete';
      }
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setItems,
  addItem,
  deleteItem,
  toggleItem,
  setError,
} = checkListItemsSlice.actions;

export default checkListItemsSlice.reducer;
