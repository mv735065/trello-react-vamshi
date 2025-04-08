
import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import boardSlice from './BoardSlice'
import listSlice from './boardListSlice'
const Store = configureStore({
    reducer:{
        board:boardSlice,
        lists:listSlice,
    }
})

export default Store