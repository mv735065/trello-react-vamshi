export const initialState = {
  checkLists: [],
  isLoading: false,
  error: null,
};

const CheckListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "fetchAllCheckLists":
      return {
        ...state,
        checkLists: [...action.data],
      };
    case "addNewCheckList":
      return {
        ...state,
        checkLists: [...state.checkLists, action.data],
      };
    case "deleteCheckList": {
      return {
        ...state,
        checkLists: state.checkLists.filter((ele) => ele.id != action.id),
      };
    }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
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

export default CheckListReducer;
