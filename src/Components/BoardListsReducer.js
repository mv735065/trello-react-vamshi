
export const initialState = {
    lists: [],
    loading: true,
    error: null,
  };

  
  const listsReducer = (state = initialState, action) => {
    switch (action.type) {
      case  'getAllLists':
        // This action will set the lists when we fetch them
        return {
          ...state,
          lists: action.list,
          loading: false,
        };
  
      case 'addNewList':
        // This action will add the newly created list to the state
        return {
          ...state,
          lists: [...state.lists, action.data],
          loading: false,
        };
  
      case 'archive':
        // This action will archive (remove) a list from the state by filtering it out
        return {
          ...state,
          lists: state.lists.filter(list => list.id !== action.id),
        };
        
        case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
  
      default:
        return state;
    }
  };
  
  export default listsReducer;