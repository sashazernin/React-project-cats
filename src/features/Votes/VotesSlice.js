import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {voteApi} from "../../Api";

const initialState = {
    allVotes: {}
}

export const getAllVotes = createAsyncThunk('getAllVotes/VotesSlice',
    async (data, {dispatch}) => {
        const resp = await voteApi.getAllVotes(data)
        dispatch(setVotes(resp.data))
    }
)

export const deleteFromVote = createAsyncThunk('deleteFromVote/VotesSlice',
    async (data, {dispatch}) => {
        try {
            const resp = await voteApi.DeleteFromVote(data)
            dispatch(deleteVote(data))
        }catch (error){
            alert(error)
        }
    }
)

const votesSlice = createSlice({
    name: 'votes',
    initialState,
    reducers: {
        setVotes: (state, action) => {
            state.allVotes = action.payload
        },
        deleteVote: (state,action) => {
            state.allVotes = state.allVotes.filter(vote => vote.id !== action.payload)
        }
    }
})

export const {setVotes,deleteVote} = votesSlice.actions
export default votesSlice.reducer