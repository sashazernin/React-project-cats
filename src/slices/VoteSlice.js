import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getRandomCatImage, voteApi} from "../Api";

const initialState = {
    image_id: null,
    catUrl: null,
    favoriteId: null,
    allVotes: null
}

export const getRandomCat = createAsyncThunk('voteSlice/getRandomCat',
    async (_, {dispatch}) => {
        const resp = await getRandomCatImage()
        dispatch(setImage(resp.data['0']))
    }
)

export const createVote = createAsyncThunk('voteSlice/createVote',
    async (data, {dispatch}) => {
        try {
            const resp = await voteApi.createAVote(data)
            if (resp.data.message === "SUCCESS") {
                await dispatch(getRandomCat())
            } else {
                alert("vote error")
            }
        } catch (error) {
            alert(error)
        }
    }
)

export const getAllVotes = createAsyncThunk('voteSlice/getAllVotes',
    async (data, {dispatch}) => {
        const resp = await voteApi.getAllVotes(data)
        dispatch(setVotes(resp.data))
    }
)

export const deleteFromVote = createAsyncThunk('voteSlice/deleteFromVote',
    async (data, {dispatch}) => {
        try {
            dispatch(deleteVote(data))
            const resp = await voteApi.DeleteFromVote(data)

        }catch (error){
            alert(error)
        }
    }
)

const voteSlice = createSlice({
    name: 'votes',
    initialState,
    reducers: {
        setImage: (state, action) => {
            state.catUrl = action.payload.url
            state.id = action.payload.id
        },
        setFavoriteId: (state, action) => {
            state.favoriteId = action.payload
        },
        setVotes: (state, action) => {
            state.allVotes = action.payload
        },
        deleteVote: (state,action) => {
            state.allVotes = state.allVotes.filter(vote => vote.id !== action.payload)
        }
    }
})

export const {setImage,setFavoriteId,setVotes,deleteVote} = voteSlice.actions
export default voteSlice.reducer