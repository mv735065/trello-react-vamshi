export  let initialState={
      boards:[],
      loading:false,
      error:null,
      showForm:false,
}

import React from 'react'

const BoardReducer = (state=initialState,action) => {
   switch (action.type){
     case 'Loading':{
        return {
            ...state,
            loading:action.loading,
        }
     }
     case 'allBoards':{
        return {
            ...state,
            boards:action.data,
            loading:false,
        }
     }
     case 'Error':{
        return {
            ...state,
            error:action.message,
            loading:false,
        }
     }
     case 'addNewBoard' :{
        return {
           ...state,
            boards:[...state.boards,action.data],
            showForm: false,
            loading:false,
          }
     }
     case 'openForm':{
        return {
            ...state,
            showForm:action.showForm,
        }
     }
     default: return state;
   }
}

export default BoardReducer