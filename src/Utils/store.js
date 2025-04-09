
import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import boardSlice from './BoardSlice'
import listSlice from './boardListSlice'
import cardSlice from './CardSlice'
import selectedCardSlice  from './SelectedCardSlice'
import checkListReducer from "./checkListSlice";
import checkListItemsReducer from './checkListItemsSlice';
const Store = configureStore({
    reducer:{
        board:boardSlice,
        lists:listSlice,
        card:cardSlice,
        selectedCard:selectedCardSlice,
        checkLists: checkListReducer,
        checkListItems: checkListItemsReducer,
    }
})

export default Store