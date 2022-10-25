import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../slices/RandomCatSlice";
import userSlice from "../slices/UserSlice";
import favoritesSlice from "../slices/FavoritesSlice";
import votesListSlice from "../slices/VoteSlice";
import breedsSlice from "../slices/BreedsSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        user:userSlice,
        favorites:favoritesSlice,
        vote: votesListSlice,
        breeds: breedsSlice
    }
})