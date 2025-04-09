import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import  boardSliceReducer from './boardSlice'

const store = configureStore({
    reducer:{
         board:boardSliceReducer,
    }
})

export default store