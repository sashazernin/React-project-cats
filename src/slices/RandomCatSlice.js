import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRandomCatImage} from "../Api";

const initialState = {
    image_id: null,
    catUrl: null,
    favoriteId: null
}

export const getRandomCat = createAsyncThunk('randomCat/getRandomCat',
    async (_, {dispatch}) => {
        const resp = await getRandomCatImage()
        dispatch(setCat(resp.data['0']))
    }
)

const randomCatSlice = createSlice({
    name: "randomCat",
    initialState,
    reducers: {
        setCat: (state, action) => {
            state.catUrl = action.payload.url
            state.id = action.payload.id
        },
        setFavoriteId: (state, action) => {
            state.favoriteId = action.payload
        }
    },
})

export const {setCat, setFavoriteId} = randomCatSlice.actions
export default randomCatSlice.reducer