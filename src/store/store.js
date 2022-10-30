import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../slices/RandomCatSlice";
import userSlice from "../slices/UserSlice";
import favoritesSlice from "../slices/FavoritesSlice";
import votesListSlice from "../slices/VoteSlice";
import findImageSlice from "../slices/findImageSlice";
import uploadSlice from "../slices/UploadSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        user:userSlice,
        favorites:favoritesSlice,
        vote: votesListSlice,
        findImage: findImageSlice,
        upload:uploadSlice
    }
})