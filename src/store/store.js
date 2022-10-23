import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../slices/RandomCatSlice";
import voteSlice from "../slices/VoteSlice";
import userSlice from "../slices/UserSlice";
import favoritesSlice from "../slices/FavoritesSlice";
import votesListSlice from "../slices/VotesListSlice";
import breedsSlice from "../slices/BreedsSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        vote:voteSlice,
        user:userSlice,
        favorites:favoritesSlice,
        votes: votesListSlice,
        breeds: breedsSlice
    }
})