import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRandomCatImage} from "../../Api";

const initialState = {
    catUlr: ''
}

export const getRandomCat = createAsyncThunk('randomCat/getRandomCat',
    async (_, {dispatch}) => {
        const resp = await getRandomCatImage()
        dispatch(setCatUrl(resp.data['0'].url))
    }
)

export const randomCatSlice = createSlice({
    name: "randomCat",
    initialState,
    reducers: {
        setCatUrl: (state,action) => {
            state.catUrl = action.payload
        }
    },
})

export const {setCatUrl} = randomCatSlice.actions
export default randomCatSlice.reducer