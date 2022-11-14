import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI, voteApi} from "../Api";

const initialState = {
    image_id: null,
    catUrl: null,
    favoriteId: null,
    allVotes: null
}

export const getRandomCat = createAsyncThunk('voteSlice/getRandomCat',
    async (setErrorMessage, {dispatch}) => {
        try {
            const resp = await imagesAPI.getRandomCatImage()
            dispatch(setImage(resp.data['0']))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

export const createVote = createAsyncThunk('voteSlice/createVote',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            const resp = await voteApi.createAVote(data)
            if (resp.data.message === "SUCCESS") {
                await dispatch(getRandomCat())
            } else {
                setErrorMessage('Vote Error')
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

export const getAllVotes = createAsyncThunk('voteSlice/getAllVotes',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            const resp = await voteApi.getAllVotes(data)
            dispatch(setVotes(resp.data))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

export const deleteFromVote = createAsyncThunk('voteSlice/deleteFromVote',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            dispatch(deleteVote(data))
            const resp = await voteApi.DeleteFromVote(data)

        } catch (error) {
            setErrorMessage(error.message)
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
        deleteVote: (state, action) => {
            state.allVotes = state.allVotes.filter(vote => vote.id !== action.payload)
        }
    }
})

export const {setImage, setFavoriteId, setVotes, deleteVote} = voteSlice.actions
export default voteSlice.reducer