import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import  boardSliceReducer from './boardSlice'
import boardListSliceReducer from './boardListSlice'
import cardSliceReducer from './cardSlice'
import singleBoardSliceReducer from './singleBoardSlice'
import checkListSliceReducer from './checkListSlice'

const store = configureStore({
    reducer:{
         board:boardSliceReducer,
         list:boardListSliceReducer,
         card:cardSliceReducer,
         singleBoard:singleBoardSliceReducer,
         checkList:checkListSliceReducer,

    }
})

export default store