import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../slices/RandomCatSlice";
import userSlice from "../slices/UserSlice";
import favoritesSlice from "../slices/FavoritesSlice";
import votesListSlice from "../slices/VoteSlice";
import findImageSlice from "../slices/findImageSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        user:userSlice,
        favorites:favoritesSlice,
        vote: votesListSlice,
        findImage: findImageSlice
    }
})