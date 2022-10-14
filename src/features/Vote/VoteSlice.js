import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRandomCatImage, voteApi} from "../../Api";

const initialState = {
    image_id: null,
    catUrl: null,
    favoriteId: null
}

export const getRandomCat = createAsyncThunk('vote/getRandomCat',
    async (_, {dispatch}) => {
        const resp = await getRandomCatImage()
        dispatch(setCat(resp.data['0']))
    }
)

export const createVote = createAsyncThunk('vote/getRandomCat',
    async (data, {dispatch}) => {
        try {
            const resp = await voteApi.createAVote(data)
            if (resp.data.message === "SUCCESS") {
                dispatch(getRandomCat())
            } else {
                alert("vote error2")
            }
        } catch (error) {
            alert("vote error1")
        }
    }
)

export const voteSlice = createSlice({
    name: "vote",
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

export const {setCat,setFavoriteId} = voteSlice.actions
export default voteSlice.reducer