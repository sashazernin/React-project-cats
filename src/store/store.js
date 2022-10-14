import {configureStore} from '@reduxjs/toolkit'
import randomCatSlice from "../features/RandomCat/RandomCatSlice";
import voteSlice from "../features/Vote/VoteSlice";
import userSlice from "../features/User/UserSlice";

export const store = configureStore({
    reducer:{
        randomCat:randomCatSlice,
        vote:voteSlice,
        user:userSlice
    }
})