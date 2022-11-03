import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../features/slices/RandomCatSlice";
import SubscriberSlice from "../features/slices/SubscriberSlice";
import favoritesSlice from "../features/slices/FavoritesSlice";
import votesListSlice from "../features/slices/VoteSlice";
import findImageSlice from "../features/slices/findImageSlice";
import uploadSlice from "../features/slices/UploadSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        Subscriber:SubscriberSlice,
        favorites:favoritesSlice,
        vote: votesListSlice,
        findImage: findImageSlice,
        upload:uploadSlice
    }
})