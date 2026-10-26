import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {imagesAPI, voteApi} from "../Api";
import {filterHiddenVotes, hideVoteId} from "../hiddenVotes";

export const VOTES_PAGE_SIZE = 20

const initialState = {
    image_id: null,
    catUrl: null,
    favoriteId: null,
    allVotes: null,
    votesPage: 0,
    votesHasMore: false,
    votesPageSize: VOTES_PAGE_SIZE,
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

const isVoteCreateSuccess = (data) => {
    if (!data) {
        return false
    }
    if (data.message === 'SUCCESS') {
        return true
    }
    return data.id != null && (data.value === 0 || data.value === 1)
}

export const createVote = createAsyncThunk('voteSlice/createVote',
    async ([data, setErrorMessage], {dispatch}) => {
        try {
            const resp = await voteApi.createAVote(data)
            if (isVoteCreateSuccess(resp.data)) {
                await dispatch(getRandomCat(setErrorMessage))
            } else {
                setErrorMessage('Vote Error')
            }
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

export const getAllVotes = createAsyncThunk('voteSlice/getAllVotes',
    async ([subscriberName, page, setErrorMessage], {dispatch, getState}) => {
        try {
            const pageSize = getState().vote.votesPageSize ?? VOTES_PAGE_SIZE
            const resp = await voteApi.getAllVotes(subscriberName, page, pageSize)
            const rawVotes = Array.isArray(resp.data) ? resp.data : []
            const votes = filterHiddenVotes(subscriberName, rawVotes)
            dispatch(setVotes({
                votes,
                page,
                hasMore: rawVotes.length >= pageSize,
            }))
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
)

/** The Cat API has no DELETE /votes — only hide locally for this browser session. */
export const deleteFromVote = createAsyncThunk('voteSlice/deleteFromVote',
    async ([voteId, setErrorMessage], {dispatch, getState}) => {
        try {
            const subscriberName = getState().Subscriber.SubscriberName
            hideVoteId(subscriberName, voteId)
            dispatch(deleteVote(voteId))
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
            state.allVotes = action.payload.votes
            state.votesPage = action.payload.page
            state.votesHasMore = action.payload.hasMore
        },
        deleteVote: (state, action) => {
            state.allVotes = state.allVotes.filter(vote => vote.id !== action.payload)
        },
        setVotesPageSize: (state, action) => {
            state.votesPageSize = action.payload
        },
    }
})

export const {setImage, setFavoriteId, setVotes, deleteVote, setVotesPageSize} = voteSlice.actions
export default voteSlice.reducer