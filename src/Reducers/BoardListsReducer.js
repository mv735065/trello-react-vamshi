export const initialState = {
  lists: [],
  loading: true,
  error: null,
};

const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "getAllLists":
      return {
        ...state,
        lists: action.list.filter((ele) => !ele.closed),
        loading: false,
      };

    case "addNewList":
      return {
        ...state,
        lists: [...state.lists, action.data],
        loading: false,
      };

    case "archive":
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.id),
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    case "Error":
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default listsReducer;
