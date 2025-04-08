
import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import boardSlice from './BoardSlice'
const Store = configureStore({
    reducer:{
        board:boardSlice,

    }
})

export default Store