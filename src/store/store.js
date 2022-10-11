import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../features/RandomCat/RandomCatSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice
    }
})