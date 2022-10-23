import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRandomCatImage, voteApi} from "../Api";

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

export const createVote = createAsyncThunk('vote/createVote',
    async (data, {dispatch}) => {
        try {
            const resp = await voteApi.createAVote(data)
            if (resp.data.message === "SUCCESS") {
                await dispatch(getRandomCat())
                dispatch(setFavoriteId(null))
            } else {
                alert("vote error")
            }
        } catch (error) {
            alert(error)
        }
    }
)

const voteSlice = createSlice({
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