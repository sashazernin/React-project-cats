import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../features/RandomCat/RandomCatSlice";
import voteSlice from "../features/Vote/VoteSlice";
import userSlice from "../features/User/UserSlice";
import favoritesSlice from "../features/Favorites/FavoritesSlice";
import votesSlice from "../features/Votes/VotesSlice";
import breedsSlice from "../features/Breeds/BreedsSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        vote:voteSlice,
        user:userSlice,
        favorites:favoritesSlice,
        votes: votesSlice,
        breeds: breedsSlice
    }
})